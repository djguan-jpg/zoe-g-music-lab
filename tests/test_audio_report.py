# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
"""Independent Python producers and native File cross the whole text boundary."""
import base64
import copy
import json
import random
import tempfile
import unittest
from pathlib import Path
from musiclab.application import build
from musiclab.audio_report import decimal, render, MAX_TEXT_BYTES
from test_audio_statistics import pcm
from test_audio_result import browser, DRAFT


class AudioReportTests(unittest.TestCase):
    def test_integer_decimal_contract_matches_binary64_edges_and_deterministic_vectors(self):
        vectors = [(0, 6), (-0.0, 8), (1.25, 1), (-1.25, 1), (0.000000005, 8),
                   (-0.000000005, 8), (-0.000000004, 8), (90000000.99999999, 8), (1e-200, 8)]
        rng = random.Random(630)
        vectors += [(rng.uniform(-100000, 100000), i % 9) for i in range(2048)]
        expected = [decimal(value, places) for value, places in vectors]
        self.assertEqual(expected[:7], ['0.000000', '0.00000000', '1.3', '-1.3', '0.00000001', '-0.00000001', '0.00000000'])
        code = "const fs=require('fs'),m=require('./web/audio-report.js'),rows=JSON.parse(fs.readFileSync(0,'utf8'));console.log(JSON.stringify(rows.map(([v,p])=>m.decimal(v,p))));"
        self.assertEqual(browser(vectors, code), expected)
        for value, places in [(True, 3), (float('nan'), 3), (float('inf'), 3), (1e300, 8), (10**10000, 3), (1, -1), (1, 9), (1, True)]:
            with self.assertRaises(ValueError): decimal(value, places)

    def test_actual_pcm_markdown_exact_utf8_states_and_no_measurement_mutation(self):
        rows = []
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder)/'原文🎵合成.wav'
            for width, rate, channels, pattern, frames in [(1, 8000, 1, 'minimum', 8000), (2, 48000, 2, 'alternating', 48000),
                    (3, 11025, 1, 'silence', 11025), (4, 48000, 3, 'maximum', 37), (2, 7999, 1, 'quiet_edges', 37), (2, 192000, 1, 'silence', 1)]:
                raw=pcm(width,rate,channels,pattern,frames);path.write_bytes(raw)
                wire=build('audio',{'display_name':'原文🎵<合成>.wav'},audio_source=path).wire();before=copy.deepcopy(wire['data'])
                self.assertEqual(render(wire['data']), wire['files']['report.md']);self.assertEqual(wire['data'],before)
                self.assertEqual(path.read_bytes(),raw);self.assertNotIn('None',wire['files']['report.md'])
                rows.append(wire)
        code="const fs=require('fs'),m=require('./web/audio-report.js'),rows=JSON.parse(fs.readFileSync(0,'utf8'));console.log(JSON.stringify(rows.map(r=>m.render(r.data))));"
        actual=browser(rows,code)
        for wire, text in zip(rows,actual): self.assertEqual(text.encode('utf-8'),wire['files']['report.md'].encode('utf-8'))
        self.assertEqual({r['data']['loudness']['status'] for r in rows}, {'measured','below_gate','unsupported_channels','unsupported_sample_rate','insufficient_duration'})

    def test_whole_markdown_mutations_refuse_current_preserve_previous_and_allow_retry(self):
        with tempfile.TemporaryDirectory() as folder:
            path=Path(folder)/'synthetic.wav';raw=pcm(2,48000,1,'alternating',48000);path.write_bytes(raw)
            wires=[build('audio',{'display_name':path.name,**({'acceptance_draft':DRAFT} if drafted else {})},audio_source=path).wire() for drafted in [False,True]]
            code=r'''const fs=require('fs'),audio=require('./web/audio-review.js'),row=JSON.parse(fs.readFileSync(0,'utf8')),file=new File([Buffer.from(row.raw,'base64')],'synthetic.wav');
            (async()=>{let refused=0,writes=0;let previous='原成果🎵';for(const wire of row.wires){const selection={file,profile:'distribution',...(wire.data.acceptance_draft?{acceptanceDraft:wire.data.acceptance_draft}:{})};
              for(const change of [s=>'# 其他作品\n',s=>s.replace(wire.data.sha256,'0'.repeat(64)),s=>s.replace('RMS 不是 LUFS','RMS 就是 LUFS'),s=>s+'商業授權通過\n',s=>s.replace('48000 Hz','44100 Hz'),s=>s.replace('不可測','已確認')]){
                const wrong=structuredClone(wire);wrong.files['report.md']=change(wrong.files['report.md']);if(wrong.files['report.md']===wire.files['report.md'])throw Error('mutation ineffective');
                try{await audio.inspect({selected:()=>selection,isCurrent:()=>true,request:async()=>wrong,onResult:()=>{writes++;previous='replaced'}});throw Error('accepted wrong Markdown');}
                catch(e){if(!e.message.includes('沒有替換目前結果'))throw e;refused++;}}
              if(previous!=='原成果🎵'||writes)throw Error('prior result changed');
            }
            for(const wire of row.wires){const selection={file,profile:'distribution',...(wire.data.acceptance_draft?{acceptanceDraft:wire.data.acceptance_draft}:{})};await audio.inspect({selected:()=>selection,isCurrent:()=>true,request:async()=>wire,onResult:()=>writes++});}
            console.log(JSON.stringify({refused,retries:writes}));})().catch(e=>{console.error(e);process.exitCode=1});'''
            self.assertEqual(browser({'wires':wires,'raw':base64.b64encode(raw).decode()},code),{'refused':12,'retries':2})
            self.assertEqual(path.read_bytes(),raw)

    def test_literal_unicode_warnings_and_bounded_invalid_inputs(self):
        with tempfile.TemporaryDirectory() as folder:
            path=Path(folder)/'synthetic.wav';path.write_bytes(pcm(2,48000,1,'silence'))
            report=build('audio',{},audio_source=path).wire()['data']
        report['warnings']=[' 原文\r\n🎵\t<提醒> '];before=copy.deepcopy(report);text=render(report)
        self.assertIn('-  原文\r\n🎵\t<提醒> \n',text);self.assertEqual(report,before)
        code="const fs=require('fs'),m=require('./web/audio-report.js'),r=JSON.parse(fs.readFileSync(0,'utf8'));console.log(JSON.stringify(m.render(r)));"
        self.assertEqual(browser(report,code).encode(),text.encode())
        for change in [lambda r:r.update(file='\ud800'),lambda r:r.update(warnings=['x'*MAX_TEXT_BYTES]),
                       lambda r:r['checks'].update(channels='false'),lambda r:r['loudness'].update(status='unknown'),
                       lambda r:r.update(duration_seconds=None),lambda r:r['source_evidence'].update(bytes=True)]:
            bad=copy.deepcopy(report);change(bad)
            with self.assertRaises(ValueError):render(bad)
