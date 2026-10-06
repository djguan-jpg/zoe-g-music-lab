# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import copy,json,subprocess,sys,tempfile,unittest
from pathlib import Path
from musiclab.application import build,capabilities
from musiclab.lyrics_review import review as whole
from musiclab.lyrics_cue_review import review,markdown,descriptor
from musiclab.tool_contracts import payload_schema,output_schema
from musiclab.draft_library import DraftLibrary
ROOT=Path(__file__).resolve().parents[1]


def partial(n=120):return {'lyrics':{'title':' 原創合成🎵 ','duration':'8','cues':[{'start':'','end':'','text':' 原句🎵  '} for _ in range(n)]},'row':n}


class LyricsCueReviewTests(unittest.TestCase):
    def test_original_row_beyond_whole_limit_keeps_both_missing_times(self):
        p=partial();before=copy.deepcopy(p);all_rows=whole(p['lyrics']);d=review(p)
        self.assertEqual(all_rows['issue_count'],240);self.assertFalse(any(i['row']==120 for i in all_rows['issues']))
        self.assertEqual(d['row'],120);self.assertEqual(d['total_rows'],120);self.assertEqual(d['issue_count'],2)
        self.assertEqual([i['field'] for i in d['issues']],['start','end']);self.assertEqual(p,before)
        self.assertEqual(d['source'],{'title':p['lyrics']['title'],'duration':'8','cue':p['lyrics']['cues'][119]})

    def test_all_retained_whole_rules_relationships_and_global_duration_agree(self):
        p={'lyrics':{'duration':'bad','cues':[{'start':'0','end':'10','text':'長句'},{'start':'0','end':'2','text':'重複'},{'start':'1','end':'3','text':'多\n行'}]},'row':1}
        for row in [1,2,3]:
            p['row']=row;self.assertEqual(review(p)['issues'],[i for i in whole(p['lyrics'])['issues'] if i['row'] in (0,row)])
        p['lyrics']['duration']='2';p['row']=3;self.assertEqual(review(p)['issues'],[i for i in whole(p['lyrics'])['issues'] if i['row'] in (0,3)])

    def test_selected_zero_does_not_accept_other_unfinished_rows(self):
        p=partial();p['lyrics']['cues'][119]={'start':'0','end':'1','text':' 原句🎵  '}
        result=build('lyrics_cue_review',p);self.assertEqual(result.data['issue_count'],0);self.assertTrue(result.needs_review)
        self.assertGreater(whole(p['lyrics'])['issue_count'],200);self.assertIn('仍須完整歌詞包',markdown(result.data))

    def test_selected_horizon_counts_all_relationships_before_200_detail_cap(self):
        p={'lyrics':{'cues':[{'start':0,'end':10001,'text':'長句'}]+[{'start':i,'end':i+1,'text':'短句'} for i in range(1,10000)]},'row':1}
        d=review(p);self.assertEqual(d['issue_count'],9999);self.assertEqual(len(d['issues']),200);self.assertTrue(d['details_truncated'])
        self.assertTrue(all(i['row']==1 and i['field']=='end' and i['code']=='overlap' for i in d['issues']))
        self.assertEqual(d['issues'][0]['related_row'],2);self.assertEqual(d['issues'][-1]['related_row'],201)
        wire=build('lyrics_cue_review',p).wire();self.assertLess(len(json.dumps(wire,ensure_ascii=False).encode()),2*1024*1024)

    def test_exact_shape_row_bounds_whole_source_and_unicode(self):
        for row in [True,False,0,-1,1.5,121,None,'120',float('inf'),float('nan')]:
            p=partial();p['row']=row
            with self.assertRaises(ValueError):review(p)
        for mutate in [lambda p:p.update(extra=True),lambda p:p.pop('row'),lambda p:p['lyrics']['cues'][0].update(extra=''),lambda p:p['lyrics']['cues'][0].update(text='\ud800'),lambda p:p['lyrics'].update(cues=[]),lambda p:p['lyrics']['cues'][0].update(start=float('inf'))]:
            p=partial();mutate(p)
            with self.assertRaises((ValueError,UnicodeError)):review(p)

    def test_python_js_shared_rules_and_exact_markdown_without_mutation(self):
        cases=[partial(),{'lyrics':{'cues':[{'start':'0.0005','end':'1.9995','text':' e\u0301🎵 '}], 'duration':'2'},'row':1},
               {'lyrics':{'duration':True,'cues':[{'start':False,'end':None,'text':'多\r\n行'}]},'row':1},
               {'lyrics':{'cues':[{'start':0,'end':5,'text':'長'},{'start':1,'end':2,'text':'短'}]},'row':2}]
        code="const fs=require('node:fs'),R=require('./musiclab/assets/lyrics-review.js');process.stdout.write(JSON.stringify(JSON.parse(fs.readFileSync(0,'utf8')).map(p=>{const data=R.cueReview(p);return {data,markdown:R.cueMarkdown(data)};})));"
        process=subprocess.run(['node','-e',code],cwd=ROOT,input=json.dumps(cases,ensure_ascii=False),capture_output=True,text=True,encoding='utf-8',timeout=15)
        self.assertEqual(process.returncode,0,process.stderr);actual=json.loads(process.stdout)
        self.assertEqual(actual,[{'data':review(p),'markdown':markdown(review(p))} for p in cases])

    def test_cli_explicit_input_and_refused_overwrite(self):
        with tempfile.TemporaryDirectory() as folder:
            base=Path(folder);p=partial();source=base/'input.json';source.write_text(json.dumps(p,ensure_ascii=False),encoding='utf-8');out=base/'out'
            args=[sys.executable,'-X','utf8','music_lab.py','lyrics-cue-review','--input',str(source),'--out',str(out)]
            first=subprocess.run(args,cwd=ROOT,capture_output=True,timeout=10);self.assertEqual(first.returncode,2,first.stderr)
            before={f.name:f.read_bytes() for f in out.iterdir()};second=subprocess.run(args,cwd=ROOT,capture_output=True,timeout=10);self.assertEqual(second.returncode,1)
            self.assertEqual({f.name:f.read_bytes() for f in out.iterdir()},before)
            bad=subprocess.run(args+['--row','1'],cwd=ROOT,capture_output=True,timeout=10);self.assertEqual(bad.returncode,1)

    def test_new_read_only_tool_schemas_and_discovery(self):
        self.assertEqual(len(capabilities()['operations']),21);self.assertEqual(capabilities()['lyrics_cue_review'],descriptor())
        with tempfile.TemporaryDirectory() as folder:self.assertEqual(len(capabilities(DraftLibrary(folder))['operations']),28)
        schema=payload_schema('lyrics_cue_review');self.assertFalse(schema['additionalProperties']);self.assertEqual(set(schema['required']),{'lyrics','row'})
        out=output_schema('lyrics_cue_review');self.assertEqual(out['properties']['data']['properties']['schema_version']['const'],1)
        self.assertTrue(out['properties']['meta']['properties']['needs_review']['const'])


if __name__=='__main__':unittest.main()
