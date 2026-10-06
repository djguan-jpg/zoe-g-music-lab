# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import copy
import http.client
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import threading
import unittest
from musiclab.application import build, capabilities
from musiclab.lyrics_package import validate_package, decode_document, package_files
from musiclab.tool_contracts import payload_schema
from music_lab_server import WorkbenchServer, WorkbenchHandler

ROOT = Path(__file__).resolve().parents[1]


def made(**changes):
    return build('lyrics', {'title': '原創標題 🎵', 'duration': 10,
                           'cues': [{'start': 0, 'end': 2, 'text': '末句後仍有尾奏'}], **changes}).data


class LyricsPackageTests(unittest.TestCase):
    def test_create_inspect_preserves_tail_music_title_metadata_and_input(self):
        original = made(); before = copy.deepcopy(original)
        result = build('lyrics', {'package': original})
        self.assertEqual(result.data, original); self.assertEqual(original, before)
        self.assertEqual(result.data['duration'], 10); self.assertFalse(result.data['duration_estimated'])
        self.assertEqual(result.data['format'], 'zoe-lyrics-package'); self.assertEqual(result.data['schema_version'], 1)
        self.assertFalse(result.needs_review)
        self.assertEqual(build('lyrics', {'content': result.files['lyrics.json'], 'suffix': '.json'}).data, original)
        result.data['cues'][0]['text'] = 'caller mutation'; self.assertEqual(original, before)

    def test_inferred_end_shift_and_edit_warning_survive_repeated_inspection(self):
        for payload in [dict(title='估計', cues=[{'start': 1, 'text': '一句'}]),
                        dict(title='提供總長但補結束', duration=10, cues=[{'start': 1, 'text': '一句'}]),
                        dict(title='移動', duration=10, cues=[{'start': 1, 'end': 2, 'text': '一句'}], shift_seconds=.5),
                        dict(title='編修', duration=10, cues=[{'start': 1, 'end': 2, 'text': '一句'}], text_changes=['1=新句'])]:
            with self.subTest(title=payload['title']):
                original = build('lyrics', payload); self.assertTrue(original.needs_review)
                for _ in range(2):
                    back = build('lyrics', {'package': json.loads(original.files['lyrics.json'])})
                    self.assertEqual(back.data, original.data); self.assertTrue(back.needs_review); original = back

    def test_legacy_conversion_is_explicit_and_preserves_every_old_field(self):
        package = made(); legacy = {k: package[k] for k in ('title', 'duration', 'duration_estimated', 'cues', 'timing')}
        for payload in [{'package': legacy}, {'package': legacy, 'allow_legacy': False},
                        {'content': json.dumps(legacy), 'suffix': '.json'}]:
            with self.assertRaises(ValueError): build('lyrics', payload)
        converted = build('lyrics', {'package': legacy, 'allow_legacy': True}).data
        self.assertEqual({k: converted[k] for k in legacy}, legacy)
        self.assertEqual(converted['review_notes'], []); self.assertNotIn('format', legacy)

    def test_unknown_version_fields_and_mutually_exclusive_modes_refuse(self):
        original = made()
        for mutate in [lambda p:p.update(schema_version=2), lambda p:p.update(schema_version=True),
                       lambda p:p.update(format='future'), lambda p:p.update(extra='discard me'),
                       lambda p:p['cues'][0].update(extra='discard me'), lambda p:p['timing'].update(extra=True)]:
            p=copy.deepcopy(original);mutate(p)
            for payload in [{'package':p},{'content':json.dumps(p),'suffix':'.json'}]:
                with self.assertRaises(ValueError): build('lyrics',payload)
        for extra in [{'title':original['title']},{'duration':10},{'shift_seconds':0},{'cues':original['cues']},
                      {'content':'[]'},{'allow_legacy':'true'},{'path':'unselected'}]:
            with self.assertRaises(ValueError): build('lyrics', {'package':original,**extra})

    def test_time_types_order_precision_overlap_bounds_and_provenance_refuse(self):
        p=made(cues=[{'start':0,'end':1,'text':'一'},{'start':2,'end':3,'text':'二'}])
        mutations=[lambda d:d['cues'][0].update(start='0'),lambda d:d['cues'][0].update(start=True),
                   lambda d:d['cues'][0].update(end=None),lambda d:d['cues'][0].update(start=.0004),
                   lambda d:d['cues'].reverse(),lambda d:d['cues'][0].update(end=2.1),
                   lambda d:d.update(duration=2.9),lambda d:d.update(duration_estimated=1),
                   lambda d:d['timing'].update(inferred_end_count=True),lambda d:d['timing'].update(inferred_end_count=3),
                   lambda d:d['timing'].update(tail_end_inferred=True),lambda d:d['timing'].update(duration_source='last_cue_end'),
                   lambda d:d['timing'].update(applied_shift_seconds=.0004),lambda d:d['timing'].update(applied_shift_seconds=float('inf'))]
        for mutate in mutations:
            document=copy.deepcopy(p);mutate(document)
            with self.subTest(mutate=mutate),self.assertRaises(ValueError):validate_package(document)
        estimated=build('lyrics',{'title':'估計','cues':[{'start':1,'text':'一句'}]}).data
        estimated['duration']=5;estimated['cues'][0]['end']=5
        with self.assertRaises(ValueError):validate_package(estimated)

    def test_review_notes_title_and_byte_limits_are_strict(self):
        p=made(title='🎵'*200);self.assertEqual(validate_package(p),p)
        for extra in [{'title':'🎵'*201},{'title':'\u0085'},{'review_notes':['']},
                      {'review_notes':['a'*401]},{'review_notes':['note']*21}]:
            with self.assertRaises(ValueError):validate_package({**p,**extra})
        p['cues'][0]['text']='字'*(2*1024*1024//3)
        with self.assertRaises(ValueError):validate_package(p)

    def test_json_decoder_rejects_duplicate_nonfinite_ambiguous_and_unknown_fields(self):
        for raw in ['{"cues":[],"cues":[{}]}','[NaN]','{"duration":Infinity}','[1e999]',
                    '{"title":"first","ti\\u0074le":"second"}','"'+('字'*(2*1024*1024//3+1))+'"']:
            with self.assertRaises(ValueError):decode_document(raw)
        for doc in [{'cues':[{'start':0,'end':1,'text':'句'}],'extra':'ignored'},
                    {'title':'incomplete','cues':[{'start':0,'end':1,'text':'句'}]}]:
            with self.assertRaises(ValueError):build('lyrics',{'content':json.dumps(doc),'suffix':'.json'})
        self.assertEqual(build('lyrics',{'content':'[{"start":0,"end":1,"text":"句"}]','suffix':'.json'}).data['cues'][0]['end'],1)

    def test_contract_discovery_describes_package_and_versions_independently(self):
        c=capabilities();self.assertEqual(c['protocol_version'],1);self.assertEqual(len(c['operations']),18)
        self.assertEqual(c['lyrics_package']['schema_version'],1)
        schema=payload_schema('lyrics');self.assertFalse(schema['additionalProperties']);self.assertEqual(len(schema['oneOf']),3)
        self.assertEqual(schema['properties']['package']['anyOf'][0]['properties']['format']['const'],'zoe-lyrics-package')
        self.assertFalse(schema['oneOf'][2]['additionalProperties'])

    def test_actual_cli_roundtrip_bom_other_cwd_no_override_and_no_overwrite(self):
        with tempfile.TemporaryDirectory() as folder:
            d=Path(folder);source=d/'source.json';source.write_bytes(b'\xef\xbb\xbf'+json.dumps(made(),ensure_ascii=False).encode())
            def run(*args):return subprocess.run([sys.executable,'-X','utf8',str(ROOT/'music_lab.py'),'lyrics','--input',str(source),*args],cwd=d,capture_output=True,encoding='utf-8',timeout=15)
            r=run('--out',str(d/'first'));self.assertEqual(r.returncode,0,r.stderr)
            actual=json.loads((d/'first/lyrics.json').read_text(encoding='utf-8'));self.assertEqual(actual,made())
            self.assertEqual(run('--out',str(d/'first')).returncode,1)
            for option in [('--title','override'),('--duration','10'),('--shift','0'),('--set','1=1'),('--text','1=edit'),('--legacy-json',)]:
                self.assertEqual(run('--out',str(d/'rejected'),*option).returncode,1);self.assertFalse((d/'rejected').exists())

    def test_actual_cli_explicit_legacy_conversion_and_unknown_version_refuse(self):
        with tempfile.TemporaryDirectory() as folder:
            d=Path(folder);p=made();legacy={k:p[k] for k in ('title','duration','duration_estimated','cues','timing')};source=d/'source.json';source.write_text(json.dumps(legacy),encoding='utf-8')
            args=[sys.executable,'-X','utf8',str(ROOT/'music_lab.py'),'lyrics','--input',str(source),'--out',str(d/'out')]
            self.assertEqual(subprocess.run(args,capture_output=True,timeout=15).returncode,1)
            self.assertEqual(subprocess.run(args+['--legacy-json'],capture_output=True,timeout=15).returncode,0)
            self.assertEqual(json.loads((d/'out/lyrics.json').read_text(encoding='utf-8')),p)
            source.write_text(json.dumps({**p,'schema_version':2}),encoding='utf-8')
            self.assertEqual(subprocess.run(args[:-1]+[str(d/'unknown')],capture_output=True,timeout=15).returncode,1)

    def test_actual_http_route_inspects_and_refuses_unknown_without_mutation(self):
        with WorkbenchServer(('127.0.0.1',0),WorkbenchHandler) as server:
            server.draft_library=None;thread=threading.Thread(target=server.serve_forever);thread.start()
            try:
                def request(method,path,body=None):
                    c=http.client.HTTPConnection('127.0.0.1',server.server_port,timeout=5);c.request(method,path,body,{'Content-Type':'application/json'} if body else {});r=c.getresponse();value=r.read();c.close();return r.status,value
                status,asset=request('GET','/lyrics-package.js');self.assertEqual(status,200);self.assertEqual(asset,(ROOT/'musiclab/assets/lyrics-package.js').read_bytes())
                p=made();status,raw=request('POST','/api/lyrics',json.dumps({'package':p}));self.assertEqual(status,200);self.assertEqual(json.loads(raw)['data'],p)
                status,raw=request('POST','/api/lyrics',json.dumps({'package':{**p,'schema_version':2}}));self.assertEqual(status,400)
            finally:server.shutdown();thread.join(timeout=5)

    def test_actual_jsonlines_and_mcp_bad_then_good_preserve_metadata(self):
        p=made();bad={**p,'schema_version':2}
        rows=[{'protocol_version':1,'id':str(i),'operation':'lyrics','payload':{'package':v}} for i,v in enumerate([bad,p])]
        r=subprocess.run([sys.executable,'-X','utf8',str(ROOT/'music_lab_agent.py')],input='\n'.join(json.dumps(s) for s in rows)+'\n',capture_output=True,text=True,encoding='utf-8',timeout=15)
        self.assertEqual(r.returncode,0);a=[json.loads(s) for s in r.stdout.splitlines()];self.assertFalse(a[0]['ok']);self.assertEqual(a[1]['result']['data'],p)
        rows=[{'jsonrpc':'2.0','id':1,'method':'initialize','params':{'protocolVersion':'2025-11-25','capabilities':{},'clientInfo':{'name':'package-tests','version':'1'}}},
              {'jsonrpc':'2.0','method':'notifications/initialized'},{'jsonrpc':'2.0','id':2,'method':'tools/list'}]
        rows += [{'jsonrpc':'2.0','id':i+3,'method':'tools/call','params':{'name':'lyrics_validate','arguments':{'payload':{'package':v}}}} for i,v in enumerate([bad,p])]
        r=subprocess.run([sys.executable,'-X','utf8',str(ROOT/'music_lab_mcp.py')],input='\n'.join(json.dumps(s) for s in rows)+'\n',capture_output=True,text=True,encoding='utf-8',timeout=15)
        self.assertEqual(r.returncode,0);a={x['id']:x for x in map(json.loads,r.stdout.splitlines())};self.assertEqual(len(a[2]['result']['tools']),18);self.assertTrue(a[3]['result']['isError']);self.assertEqual(a[4]['result']['structuredContent']['data'],p)


if __name__=='__main__':unittest.main()
