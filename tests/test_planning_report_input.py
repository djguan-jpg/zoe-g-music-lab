# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import json,subprocess,sys,unittest,threading,http.client
from pathlib import Path
from musiclab.draft_contract import CONTRACT
from musiclab.application import build,capabilities
from musiclab.music_review import review as music_review
from musiclab.storyboard_review import review as storyboard_review
from music_lab_server import WorkbenchServer,WorkbenchHandler
ROOT=Path(__file__).resolve().parents[1]
MODELS={'music':music_review,'storyboard':storyboard_review}
def panel(operation):
 selected={'fields':{k:'' for k in CONTRACT['fields'][operation]}}
 if operation=='music':selected.update({'sections':[],'avoid':[],'deliverables':[' 原文\r\n🎵 ']});selected['fields']['music-bpm']='未填'
 else:selected.update({'motifs':[],'shots':[]});selected['fields']['mv-ratio']='16:9'
 return selected
def node(code,value):
 r=subprocess.run(['node','-e',code],cwd=ROOT,input=json.dumps(value,ensure_ascii=True),capture_output=True,text=True,encoding='utf-8',timeout=20)
 if r.returncode:raise AssertionError(r.stderr[-1500:])
 return json.loads(r.stdout)
class PlanningReportInputTests(unittest.TestCase):
 def test_cross_language_complete_report_sources_and_large_truncated_diagnostics(self):
  rows=[]
  for operation in MODELS:
   for raw in ['', ' 原文\r\n🎵 ', '1e999','０','1_20', '未填', '\t', '𝄞']:
    source=panel(operation);source['fields']['music-title' if operation=='music' else 'mv-title']=raw
    rows.append({'operation':operation,'document':MODELS[operation]({'panel':source})})
   source=panel(operation);key='sections' if operation=='music' else 'shots';source[key]=[{k:'' for k in CONTRACT['rows'][operation]['columns']} for _ in range(40 if operation=='music' else 1000)]
   rows.append({'operation':operation,'document':MODELS[operation]({'panel':source})})
  code="const fs=require('fs'),m=require('./web/planning-report-input.js');const rows=JSON.parse(fs.readFileSync(0,'utf8'));console.log(JSON.stringify(rows.map(r=>m.inspect(r.operation,r.document))));"
  out=node(code,rows);self.assertEqual(len(out),18)
  for item,result in zip(rows,out):self.assertEqual(result['panel'],item['document']['source']);self.assertEqual(result['issueCount'],item['document']['issue_count'])
 def test_actual_agent_output_files_are_accepted_without_expanding_payload_or_tool_count(self):
  for operation in MODELS:
   source=panel(operation);request={'protocol_version':1,'id':operation,'operation':operation+'_review','payload':{'panel':source}}
   r=subprocess.run([sys.executable,'-X','utf8','music_lab_agent.py'],cwd=ROOT,input=json.dumps(request)+'\n',capture_output=True,text=True,encoding='utf-8',timeout=15)
   self.assertEqual(r.returncode,0,r.stderr);reply=json.loads(r.stdout);self.assertTrue(reply['ok']);self.assertEqual(reply['result'],build(operation+'_review',{'panel':source}).wire())
   raw=reply['result']['files'][operation+'-review.json']
   result=node("const fs=require('fs'),m=require('./web/planning-report-input.js');const x=JSON.parse(fs.readFileSync(0,'utf8'));const b=new TextEncoder().encode(x.raw);console.log(JSON.stringify(m.decode(x.operation,b.buffer,b.length)));",{'operation':operation,'raw':raw})
   self.assertEqual(result['panel'],source)
  self.assertEqual(len(capabilities()['operations']),21)
 def test_fixed_browser_input_asset_matches_source_and_uses_existing_loopback_server(self):
  server=WorkbenchServer(('127.0.0.1',0),WorkbenchHandler);server.draft_library=None
  thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
  try:
   c=http.client.HTTPConnection('127.0.0.1',server.server_address[1],timeout=5);c.request('GET','/planning-report-input.js');r=c.getresponse()
   self.assertEqual(r.status,200);self.assertEqual(r.read(),(ROOT/'web/planning-report-input.js').read_bytes());c.close()
  finally:server.shutdown();server.server_close();thread.join(5);self.assertFalse(thread.is_alive())
