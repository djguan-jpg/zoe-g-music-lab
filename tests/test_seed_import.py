# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import copy
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from musiclab.application import build
from musiclab.storyboard_seed import validate_seed
from music_lab_mcp import Session, MCP_VERSION

ROOT=Path(__file__).resolve().parents[1]


def seed():
    brief=json.loads((ROOT/'examples/first-light-music.json').read_text(encoding='utf-8'))
    return build('storyboard_seed',{'music':brief}).data


class SeedImportTests(unittest.TestCase):
    def test_generated_seed_inspection_preserves_data_files_and_human_review(self):
        data=seed();before=copy.deepcopy(data);result=build('storyboard_seed',{'seed':data})
        self.assertEqual(result.data,before);self.assertEqual(data,before);self.assertTrue(result.needs_review)
        result.data['slots'][0]['purpose']='mutated';self.assertEqual(data,before)
        self.assertEqual(json.loads(result.files['storyboard-seed.json']),before)

    def test_numeric_integer_representation_and_fractional_timing_exports_roundtrip(self):
        brief=json.loads((ROOT/'examples/first-light-music.json').read_text(encoding='utf-8'))
        brief.update(bpm=123.456,beats_per_bar=3)
        for chunk in (1,3,7,128):
            generated=build('storyboard_seed',{'music':brief,'fps':29.97,'bars_per_shot':chunk})
            self.assertEqual(build('storyboard_seed',{'seed':generated.data}).files,generated.files)
        data=seed();data['source']['sections'][0]['bars']=4.0
        self.assertEqual(validate_seed(data),data)

    def test_unknown_version_status_assumption_bool_and_nonfinite_refuse(self):
        for change in (lambda s:s.update(schema_version=2),lambda s:s.update(schema_version=True),
                       lambda s:s.update(status='rendered'),lambda s:s['source'].update(timing_assumption='audio_aligned'),
                       lambda s:s['source'].update(bpm=True),lambda s:s.update(fps=float('nan')),
                       lambda s:s['slots'][0].update(start='0'),lambda s:s['slots'][0].update(start_frame=False)):
            data=seed();change(data)
            with self.assertRaises(ValueError):build('storyboard_seed',{'seed':data})

    def test_unknown_creative_or_extension_fields_are_not_silently_dropped(self):
        for change in (lambda s:s.update(custom='keep me'),lambda s:s['source'].update(path='x'),
                       lambda s:s['source']['sections'][0].update(extra='keep'),lambda s:s['slots'][0].update(visual='new drawing')):
            data=seed();change(data);before=copy.deepcopy(data)
            with self.assertRaisesRegex(ValueError,'未知欄位'):build('storyboard_seed',{'seed':data})
            self.assertEqual(data,before)

    def test_millisecond_and_half_frame_tampering_refuse_exact_consistency(self):
        for change in (lambda s:s['slots'][0].update(end=8.001),lambda s:s['source']['sections'][0].update(end=8.001),
                       lambda s:s['slots'][0].update(end_frame_exclusive=193),lambda s:s['slots'][0].update(purpose='different'),
                       lambda s:s.update(duration_seconds=136.001),lambda s:s['slots'][1].update(bar_start=9),
                       lambda s:s['slots'].pop(),lambda s:s.update(review_notes=[])):
            data=seed();change(data)
            with self.assertRaises(ValueError):validate_seed(data)

    def test_seed_and_generation_inputs_are_mutually_exclusive(self):
        for field,value in [('music',{}),('fps',24),('bars_per_shot',4),('path','x')]:
            with self.assertRaisesRegex(ValueError,'混用'):build('storyboard_seed',{'seed':seed(),field:value})

    def test_real_cli_seed_from_other_cwd_preserves_source_and_rejects_overrides(self):
        with tempfile.TemporaryDirectory() as temp:
            source=Path(temp)/'seed.json';source.write_text('\ufeff'+json.dumps(seed(),ensure_ascii=False),encoding='utf-8')
            before=source.read_bytes();out=Path(temp)/'out'
            args=[sys.executable,'-X','utf8',str(ROOT/'music_lab.py'),'storyboard-seed','--seed',str(source),'--out',str(out)]
            result=subprocess.run(args,cwd=temp,capture_output=True,encoding='utf-8',timeout=10)
            self.assertEqual(result.returncode,0,result.stderr)
            for name,content in build('storyboard_seed',{'seed':seed()}).files.items():self.assertEqual((out/name).read_bytes().decode('utf-8'),content)
            originals={p.name:p.read_bytes() for p in out.iterdir()}
            for extra in ([],['--fps','24'],['--bars-per-shot','4']):
                rejected=subprocess.run(args+extra,cwd=temp,capture_output=True,encoding='utf-8',timeout=10)
                self.assertEqual(rejected.returncode,1)
                self.assertEqual({p.name:p.read_bytes() for p in out.iterdir()},originals)
            self.assertEqual(source.read_bytes(),before)

    def test_real_jsonlines_inspects_bad_then_good_and_does_not_write(self):
        bad=seed();bad['schema_version']=2;good=seed()
        requests=[{'protocol_version':1,'id':str(i),'operation':'storyboard_seed','payload':{'seed':data}} for i,data in enumerate([bad,good])]
        with tempfile.TemporaryDirectory() as temp:
            result=subprocess.run([sys.executable,'-X','utf8',str(ROOT/'music_lab_agent.py')],cwd=temp,
                input=''.join(json.dumps(r)+'\n' for r in requests),capture_output=True,encoding='utf-8',timeout=10)
            self.assertEqual(result.returncode,0,result.stderr);replies=[json.loads(line) for line in result.stdout.splitlines()]
            self.assertFalse(replies[0]['ok']);self.assertEqual(replies[1]['result'],build('storyboard_seed',{'seed':good}).wire())
            self.assertEqual(list(Path(temp).iterdir()),[])

    def test_mcp_inspection_uses_same_boundary_and_discovery_includes_eight_tools(self):
        session=Session();session.response(json.dumps({'jsonrpc':'2.0','id':1,'method':'initialize','params':{'protocolVersion':MCP_VERSION,'capabilities':{},'clientInfo':{'name':'seed-import-test','version':'1'}}}))
        session.response('{"jsonrpc":"2.0","method":"notifications/initialized"}')
        listed=session.response('{"jsonrpc":"2.0","id":2,"method":"tools/list"}')['result']['tools'];self.assertEqual(len(listed),18)
        tool={t['name']:t for t in listed}['storyboard_seed'];self.assertIn('seed',tool['inputSchema']['properties']['payload']['properties'])
        data=seed();result=session.response(json.dumps({'jsonrpc':'2.0','id':3,'method':'tools/call','params':{'name':'storyboard_seed','arguments':{'payload':{'seed':data}}}}))
        self.assertEqual(result['result']['structuredContent'],build('storyboard_seed',{'seed':data}).wire())
        requests=[{'jsonrpc':'2.0','id':1,'method':'initialize','params':{'protocolVersion':MCP_VERSION,'capabilities':{},'clientInfo':{'name':'real-seed-inspect','version':'1'}}},
                  {'jsonrpc':'2.0','method':'notifications/initialized'},
                  {'jsonrpc':'2.0','id':2,'method':'tools/list'},
                  {'jsonrpc':'2.0','id':3,'method':'tools/call','params':{'name':'storyboard_seed','arguments':{'payload':{'seed':data}}}}]
        with tempfile.TemporaryDirectory() as temp:
            process=subprocess.run([sys.executable,'-X','utf8',str(ROOT/'music_lab_mcp.py')],cwd=temp,
                input=''.join(json.dumps(r)+'\n' for r in requests),capture_output=True,encoding='utf-8',timeout=10)
            self.assertEqual(process.returncode,0,process.stderr);replies=[json.loads(line) for line in process.stdout.splitlines()]
            self.assertEqual(len(replies),3);self.assertEqual(len(replies[1]['result']['tools']),18)
            self.assertEqual(replies[2]['result']['structuredContent'],build('storyboard_seed',{'seed':data}).wire())
            self.assertEqual(list(Path(temp).iterdir()),[])



if __name__=='__main__':unittest.main()
