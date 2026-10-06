# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import copy,json,subprocess,tempfile,unittest
from pathlib import Path
from musiclab.application import build,capabilities
from musiclab.music_review import review as whole
from musiclab.music_section_review import review,markdown
from musiclab.draft_library import DraftLibrary
from musiclab.tool_contracts import payload_schema,output_schema
from music_lab_mcp import tool_list
ROOT=Path(__file__).resolve().parents[1]


def partial(count=40):
    p=json.loads((ROOT/'examples/unfinished-song-review.json').read_text(encoding='utf-8'))['panel']
    p['fields']={k:'' for k in p['fields']}
    p['sections']=[dict.fromkeys(p['sections'][0],'') for _ in range(count)]
    return {'panel':p,'row':count}


class MusicSectionReviewTests(unittest.TestCase):
    def test_original_row40_beyond_whole_detail_limit_keeps_all_five_fields(self):
        p=partial();before=copy.deepcopy(p);d=review(p)
        self.assertGreater(whole({'panel':p['panel']})['issue_count'],200)
        self.assertFalse(any(i['row']==40 for i in whole({'panel':p['panel']})['issues']))
        self.assertEqual(d['row'],40);self.assertEqual(d['total_sections'],40);self.assertEqual(d['issue_count'],5)
        self.assertTrue(all(i['row']==40 and i['scope']=='sections' for i in d['issues']))
        self.assertEqual(d['source'],{'section':p['panel']['sections'][39]});self.assertEqual(p,before)

    def test_selected_and_whole_song_share_required_and_number_rules(self):
        for field,value in [('name','\u0085 '),('bars','1.5'),('bars','0'),('bars','129'),('bars','bad'),('energy','0'),('energy','5.1'),('energy','NaN'),('energy','2.5')]:
            p=partial(3);p['row']=2;p['panel']['sections'][1][field]=value
            self.assertEqual(review(p)['issues'],[i for i in whole({'panel':p['panel']})['issues'] if i['scope']=='sections' and i['row']==2])

    def test_zero_selected_still_needs_review_when_global_fields_and_other_rows_are_incomplete(self):
        p=partial();p['panel']['sections'][39]={'name':' 原文🎵 ','bars':' 8.00 ','energy':'3','focus':'敘事','texture':'音色'}
        r=build('music_section_review',p);self.assertEqual(r.data['issue_count'],0);self.assertTrue(r.needs_review)
        self.assertEqual(r.data['source']['section'],p['panel']['sections'][39]);self.assertIn('仍須整首歌曲',markdown(r.data))

    def test_exact_original_row_input_shape_unicode_and_full_source_limits(self):
        for row in [True,False,0,-1,1.5,41,None,'40',float('inf'),float('nan')]:
            p=partial();p['row']=row
            with self.assertRaises(ValueError):review(p)
        for mutate in [lambda p:p.update(extra=''),lambda p:p.pop('row'),lambda p:p['panel']['sections'][0].update(extra=''),lambda p:p['panel']['sections'][0].update(name='\ud800'),lambda p:p['panel']['sections'].append(p['panel']['sections'][0])]:
            p=partial();mutate(p)
            with self.assertRaises(ValueError):review(p)
        p=partial();p['row']=40.0;self.assertEqual(review(p)['row'],40)
        with self.assertRaises(ValueError):review(partial(0))

    def test_python_js_complete_reports_json_and_markdown_agree(self):
        rows=[partial(1),partial(40)]
        for field,value in [('bars','1.5'),('energy','NaN'),('bars','１２８'),('energy','2.5'),('name',' 原文\r\n🎵 '),('texture','a\\b\t音色')]:
            p=partial(3);p['row']=2;p['panel']['sections'][1][field]=value;rows.append(p)
        code="const fs=require('fs'),S=require('./web/music-section-review.js');process.stdout.write(JSON.stringify(JSON.parse(fs.readFileSync(0,'utf8')).map(p=>{const d=S.report(p);return {data:d,json:JSON.stringify(d,null,2)+'\\n',markdown:S.markdown(d)};})));"
        p=subprocess.run(['node','-e',code],cwd=ROOT,input=json.dumps(rows,ensure_ascii=False),capture_output=True,text=True,encoding='utf-8',timeout=15)
        self.assertEqual(p.returncode,0,p.stderr);self.assertEqual(json.loads(p.stdout),[{'data':review(x),'json':json.dumps(review(x),ensure_ascii=False,indent=2)+'\n','markdown':markdown(review(x))} for x in rows])

    def test_discovery_adds_exact_readonly_schemas_with_no_paths_or_media(self):
        c=capabilities();self.assertEqual(len(c['operations']),22);self.assertEqual(len(tool_list()),22);self.assertTrue(c['music_section_review']['read_only'])
        with tempfile.TemporaryDirectory() as folder:self.assertEqual(len(capabilities(DraftLibrary(folder))['operations']),29)
        self.assertEqual(payload_schema('music_section_review')['required'],['panel','row'])
        schema=output_schema('music_section_review');self.assertFalse(schema['properties']['data']['additionalProperties']);self.assertTrue(schema['properties']['meta']['properties']['needs_review']['const'])
        t=next(t for t in tool_list() if t['name']=='music_section_review');self.assertTrue(t['annotations']['readOnlyHint']);self.assertFalse(t['annotations']['openWorldHint'])

    def test_complete_files_echo_original_source_and_the_shared_markdown(self):
        r=build('music_section_review',partial());self.assertEqual(set(r.files),{'music-section-review.json','music-section-review.md'})
        self.assertEqual(json.loads(r.files['music-section-review.json']),r.data);self.assertEqual(r.files['music-section-review.md'],markdown(r.data))

    def test_report_capacity_refuses_selected_text_without_dropping_input_and_allows_other_row_text(self):
        p=partial();p['panel']['sections'][39]['texture']='a'*(256*1024);before=copy.deepcopy(p)
        with self.assertRaises(ValueError):build('music_section_review',p)
        self.assertEqual(p,before);p['panel']['sections'][39]['texture']='';p['panel']['sections'][0]['texture']='a'*(256*1024)
        self.assertEqual(build('music_section_review',p).data['row'],40)
