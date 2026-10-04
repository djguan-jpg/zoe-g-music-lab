# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import http.client,json,subprocess,threading,unittest
from pathlib import Path
from music_lab_server import WorkbenchServer,WorkbenchHandler
ROOT=Path(__file__).resolve().parents[1]

class LyricsResultHttpTests(unittest.TestCase):
    def test_actual_http_asset_order_and_checked_literal_build(self):
        with WorkbenchServer(('127.0.0.1',0),WorkbenchHandler) as server:
            server.draft_library=None
            thread=threading.Thread(target=server.serve_forever);thread.start()
            try:
                connection=http.client.HTTPConnection('127.0.0.1',server.server_port,timeout=10)
                connection.request('GET','/');response=connection.getresponse();self.assertEqual(response.status,200);page=response.read().decode()
                self.assertLess(page.index('/lyrics-package.js'),page.index('/lyrics-result.js'))
                self.assertLess(page.index('/lyrics-result.js'),page.index('/lyrics-import.js'))
                self.assertLess(page.index('/lyrics-result.js'),page.index('/app.js'))
                connection.request('GET','/lyrics-result.js');response=connection.getresponse();self.assertEqual(response.status,200)
                self.assertEqual(response.read(),(ROOT/'web/lyrics-result.js').read_bytes())
                for duration in [None,10]:
                    payload={'title':'原名 <b>','cues':[{'start':1.125,'end':2.5,'text':'  原文\t \u2028尾  '}],'duration':duration}
                    connection.request('POST','/api/lyrics',json.dumps(payload).encode(),{'Content-Type':'application/json'})
                    response=connection.getresponse();self.assertEqual(response.status,200);reply=json.loads(response.read())
                    code="const G=require('./web/lyrics-result.js'),fs=require('node:fs'),x=JSON.parse(fs.readFileSync(0,'utf8'));console.log(JSON.stringify(G.checkedResult(G.expectedBuild(x.payload),x.reply).data));"
                    result=subprocess.run(['node','-e',code],cwd=ROOT,input=json.dumps({'payload':payload,'reply':reply}),capture_output=True,text=True,encoding='utf-8',timeout=10)
                    self.assertEqual(result.returncode,0,result.stderr[-1000:]);self.assertEqual(json.loads(result.stdout),reply['data'])
                connection.close()
            finally:
                server.shutdown();thread.join(10);self.assertFalse(thread.is_alive())
