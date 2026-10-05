# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import copy
import http.client
import json
import subprocess
import sys
import tempfile
import threading
import unittest
from pathlib import Path
from musiclab.application import build, capabilities
from musiclab.storyboard_timing_review import review, markdown, source, timing_panel
from musiclab.storyboard_timing import diagnose
from music_lab_server import WorkbenchServer, WorkbenchHandler
from music_lab_mcp import tool_list

ROOT = Path(__file__).resolve().parents[1]


def panel(duration='1', fps='24', first='.5', second='.5', tail='1'):
    return {'fields': {'mv-duration': duration, 'mv-fps': fps},
            'shots': [{'start': '0', 'end': first}, {'start': second, 'end': tail}]}


def node(cases):
    code = "const fs=require('node:fs'),T=require('./web/storyboard-timing.js');console.log(JSON.stringify(JSON.parse(fs.readFileSync(0,'utf8')).map(p=>{const data=T.report(p);return {data,markdown:T.markdown(data)};})));"
    p = subprocess.run(['node', '-e', code], input=json.dumps(cases, ensure_ascii=False), capture_output=True, text=True, encoding='utf-8', cwd=ROOT, timeout=15)
    assert p.returncode == 0, p.stderr
    return json.loads(p.stdout)


class StoryboardTimingTests(unittest.TestCase):
    def test_missing_invalid_unicode_numbers_preserve_source_and_partial_counts(self):
        p = panel('', '二十四', '', '0x10', '1_0')
        original = copy.deepcopy(p);r = review({'panel': p})
        self.assertEqual(r['total_shots'], 2);self.assertEqual(r['timed_shots'], 0);self.assertIsNone(r['total_frames'])
        self.assertEqual([(i['row'], i['field'], i['code']) for i in r['issues']], [(0,'mv-duration','missing_clock'),(0,'mv-fps','invalid_number'),(1,'end','missing_clock'),(2,'start','invalid_number')])
        self.assertEqual(p, original);self.assertEqual(r['source'], p)

    def test_frame_only_overlap_and_gap_keep_original_row_and_previous_reference(self):
        for first, second, code in [('.06251','.0616','frames_overlap'),('.06249','.0634','frames_gap')]:
            p = panel(first=first, second=second);r = review({'panel': p})
            self.assertEqual(r['issue_count'], 1);self.assertEqual(r['timed_shots'], 2)
            self.assertEqual((r['issues'][0]['row'],r['issues'][0]['field'],r['issues'][0]['code'],r['issues'][0]['related_row']), (2,'start',code,1))
            self.assertEqual(r['source'], p);self.assertIn('前鏡 1',markdown(r))

    def test_tail_frame_mismatch_cannot_hide_in_second_tolerance(self):
        for duration, tail in [('.93751','.9366'),('.93749','.9384')]:
            r = review({'panel': panel(duration=duration, first='.1',second='.1',tail=tail)})
            self.assertEqual(r['issue_count'],1);self.assertEqual(r['issues'][0]['code'],'tail_frames');self.assertEqual(r['issues'][0]['row'],2)

    def test_empty_rows_and_short_declaration_remain_explicit(self):
        p = panel(duration='.001');p['shots']=[];r=review({'panel':p})
        self.assertEqual(r['total_frames'],0);self.assertEqual(r['timed_shots'],0);self.assertEqual([i['code'] for i in r['issues']],['short_declaration','no_shots'])

    def test_full_range_row_order_and_declaration_limits_do_not_guess(self):
        p=panel(duration='1',fps='121',first='-1',second='2',tail='2');r=review({'panel':p})
        self.assertEqual([i['code'] for i in r['issues']],['invalid_range','invalid_range','nonpositive_duration']);self.assertEqual(r['timed_shots'],0)
        p=panel(first='.5',second='.5',tail='2');self.assertIn('beyond_declaration',[i['code'] for i in review({'panel':p})['issues']])

    def test_reports_are_isolated_and_unknown_shapes_or_capacity_refuse(self):
        for edit in [lambda p:p.update(extra=True),lambda p:p['fields'].update({'mv-fps':24}),lambda p:p['shots'][0].update(extra=''),lambda p:p.update(shots=[p['shots'][0]]*1001),lambda p:p['fields'].update({'mv-fps':'\ud800'}),lambda p:p['shots'][0].update(start='漢'*(3*1024*1024))]:
            p=panel();edit(p)
            with self.assertRaises((ValueError,UnicodeError)):source(p)
        r=review({'panel':panel()});r['source']['shots'][0]['end']='changed';self.assertEqual(panel()['shots'][0]['end'],'.5')
        for payload in [{'panel':panel(),'path':'bad'},{'panel':panel(),'schema_version':999}]:
            with self.assertRaises(ValueError):review(payload)

    def test_all_rows_counted_after_two_hundred_detail_limit(self):
        p=panel();p['shots']=[{'start':'','end':''} for _ in range(1000)];r=review({'panel':p})
        self.assertEqual(r['issue_count'],2000);self.assertEqual(len(r['issues']),200);self.assertTrue(r['details_truncated']);self.assertEqual(r['total_shots'],1000);self.assertEqual(r['timed_shots'],0);self.assertIn('全部鏡頭',markdown(r))

    def test_partial_bad_row_does_not_invent_a_previous_endpoint(self):
        p=panel();p['shots']=[{'start':'0','end':''},{'start':'9','end':'10'}];p['fields']['mv-duration']='10';r=review({'panel':p})
        self.assertEqual(r['issue_count'],1);self.assertEqual(r['timed_shots'],1);self.assertEqual(r['issues'][0]['row'],1)

    def test_whole_report_markdown_and_complete_clock_acceptance_match_real_node(self):
        cases=[panel()]
        for value in ['', '4e','NaN','Infinity','0x10','\ufeff24','１２','1_2','\u0085 24 \u0085','-0.0001','121']:
            for field in ('mv-duration','mv-fps'):
                p=panel();p['fields'][field]=value;cases.append(p)
            for field in ('start','end'):
                p=panel();p['shots'][1][field]=value;cases.append(p)
        for fps in ('8','23.976','24','29.97','59.94','120'):
            for boundary in ('.06249','.0625','.06251','.104','.105','.5','.5009'):
                cases.append(panel(fps=fps,first=boundary,second=boundary))
            cases += [panel(fps=fps,first='.06251',second='.0616'),panel(fps=fps,first='.06249',second='.0634')]
        cases += [panel(duration='.93751',first='.1',second='.1',tail='.9366'),panel(duration='.93749',first='.1',second='.1',tail='.9384'),panel(duration='14400',first='7200',second='7200',tail='14400.0009'),panel(duration='.001',first='.0005',second='.0005',tail='.001')]
        replies=node(cases);template=json.loads((ROOT/'examples/first-light-mv.json').read_text(encoding='utf-8'))
        self.assertEqual(len(replies),len(cases))
        for p, reply in zip(cases,replies):
            expected=review({'panel':p});self.assertEqual(reply['data'],expected);self.assertEqual(reply['markdown'],markdown(expected))
            brief=copy.deepcopy(template);brief['duration_seconds']=p['fields']['mv-duration'];brief['fps']=p['fields']['mv-fps'];brief['shots']=brief['shots'][:2]
            for original,clocks in zip(brief['shots'],p['shots']):original.update(clocks)
            try:result=build('storyboard',brief)
            except ValueError:self.assertGreater(expected['issue_count'],0)
            else:self.assertEqual(expected['issue_count'],0);self.assertEqual(result.data['frame_timeline']['total_frames'],expected['total_frames'])

    def test_zero_timing_issues_do_not_accept_incomplete_creative_plan(self):
        r=build('storyboard_timing_review',{'panel':panel()});self.assertEqual(r.data['status'],'timing_checked');self.assertTrue(r.needs_review)
        with self.assertRaises(ValueError):build('storyboard',{'duration_seconds':1,'fps':24,'shots':[{'start':0,'end':1}]})

    def test_discovery_is_additive_and_input_is_strict_read_only(self):
        info=capabilities();self.assertEqual(len(info['operations']),16);self.assertEqual(info['storyboard_timing_review']['schema_version'],1);self.assertEqual(info['storyboard_review']['schema_version'],1)
        tool={t['name']:t for t in tool_list()}['storyboard_timing_review'];self.assertTrue(tool['annotations']['readOnlyHint']);self.assertFalse(tool['annotations']['openWorldHint']);self.assertFalse(tool['annotations']['destructiveHint'])
        schema=info['input_schemas']['storyboard_timing_review'];self.assertFalse(schema['additionalProperties']);self.assertEqual(schema['properties']['panel']['properties']['shots']['maxItems'],1000)

    def test_real_cli_raw_and_modern_draft_share_reports_and_no_overwrite(self):
        raw=json.loads((ROOT/'examples/unfinished-storyboard-review.json').read_text(encoding='utf-8'))['panel'];raw['fields']['mv-fps']='二十四';selected=timing_panel(raw)
        from musiclab.draft_contract import CONTRACT
        panels={name:{'fields':{k:'' for k in keys}} for name,keys in CONTRACT['fields'].items()}
        panels['music'].update(sections=[],avoid=[],deliverables=[]);panels['storyboard']=raw;panels['lyrics'].update(cues=[]);panels['lyrics']['fields']['lyrics-format']='.lrc';panels['audio']['fields']['audio-profile']='distribution'
        draft=dict(format='zoe-music-lab-draft',schema_version=3,tool_version='synthetic',saved_at='',tab='storyboard',panels=panels)
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder);(root/'raw.json').write_text(json.dumps({'panel':selected}),encoding='utf-8');(root/'draft.json').write_text(json.dumps(draft),encoding='utf-8')
            for name,flag in [('raw','--input'),('draft','--draft')]:
                args=[sys.executable,'-X','utf8','music_lab.py','storyboard-timing-review',flag,str(root/(name+'.json')),'--out',str(root/name)]
                r=subprocess.run(args,cwd=ROOT,capture_output=True,text=True,encoding='utf-8',timeout=10);self.assertEqual(r.returncode,2,r.stderr)
                files={f.name:f.read_bytes() for f in (root/name).iterdir()};self.assertEqual({k:v.decode('utf-8') for k,v in files.items()},build('storyboard_timing_review',{'panel':selected}).files)
                r=subprocess.run(args,cwd=ROOT,capture_output=True,text=True,encoding='utf-8',timeout=10);self.assertEqual(r.returncode,1);self.assertEqual(files,{f.name:f.read_bytes() for f in (root/name).iterdir()})

    def test_real_agent_mcp_equal_application_and_refuse_source_paths(self):
        payload={'panel':panel(first='.06251',second='.0616')};expected=build('storyboard_timing_review',payload).wire()
        rows=[dict(protocol_version=1,id=str(i),operation='storyboard_timing_review',payload=p) for i,p in enumerate([dict(payload,path='bad'),payload])]
        r=subprocess.run([sys.executable,'-X','utf8','music_lab_agent.py'],cwd=ROOT,input=''.join(json.dumps(row)+'\n' for row in rows),capture_output=True,text=True,encoding='utf-8',timeout=10);self.assertEqual(r.returncode,0,r.stderr);a=list(map(json.loads,r.stdout.splitlines()));self.assertFalse(a[0]['ok']);self.assertEqual(a[1]['result'],expected)
        rows=[dict(jsonrpc='2.0',id=1,method='initialize',params=dict(protocolVersion='2025-11-25',capabilities={},clientInfo=dict(name='timing-qa',version='1'))),dict(jsonrpc='2.0',method='notifications/initialized'),dict(jsonrpc='2.0',id=2,method='tools/list'),dict(jsonrpc='2.0',id=3,method='tools/call',params=dict(name='storyboard_timing_review',arguments=dict(payload=payload)))]
        r=subprocess.run([sys.executable,'-X','utf8','music_lab_mcp.py'],cwd=ROOT,input=''.join(json.dumps(row)+'\n' for row in rows),capture_output=True,text=True,encoding='utf-8',timeout=10);self.assertEqual(r.returncode,0,r.stderr);a=list(map(json.loads,r.stdout.splitlines()));self.assertEqual(len(a[1]['result']['tools']),16);self.assertEqual(a[2]['result']['structuredContent'],expected)

    def test_real_http_routes_and_module_defer_order(self):
        server=WorkbenchServer(('127.0.0.1',0),WorkbenchHandler);server.draft_library=None;thread=threading.Thread(target=server.serve_forever);thread.start()
        try:
            c=http.client.HTTPConnection('127.0.0.1',server.server_port,timeout=5);c.request('GET','/storyboard-timing.js');r=c.getresponse();self.assertEqual(r.status,200);self.assertEqual(r.read(),(ROOT/'web/storyboard-timing.js').read_bytes())
            c.request('GET','/');r=c.getresponse();html=r.read().decode();self.assertLess(html.index('/storyboard-frames.js'),html.index('/storyboard-timing.js'));self.assertLess(html.index('/storyboard-timing.js'),html.index('/storyboard-duration.js'));self.assertIn('id="mv-time-box"',html)
            for payload,code in [({'panel':panel()},200),({'panel':panel(),'path':'bad'},400)]:
                c.request('POST','/api/storyboard-timing-review',json.dumps(payload),{'Content-Type':'application/json'});r=c.getresponse();self.assertEqual(r.status,code);raw=r.read()
                if code==200:self.assertEqual(json.loads(raw),build('storyboard_timing_review',payload).wire())
            c.close()
        finally:server.shutdown();thread.join(5);server.server_close();self.assertFalse(thread.is_alive())
