# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import io,json,subprocess,sys,tempfile,unittest,zipfile
from pathlib import Path
from musiclab import __version__
from musiclab.delivery_package import prepare,MANIFEST_NAME
from musiclab.common import json_text
from music_lab_mcp import MCP_VERSION

ROOT=Path(__file__).resolve().parents[1]
SOURCE={'scope':'music','label':'合成原文','files':{'source.txt':'原文\r\n🎵'}}

def unknown_archive():
    original=prepare(SOURCE).archive;output=io.BytesIO()
    with zipfile.ZipFile(io.BytesIO(original)) as old,zipfile.ZipFile(output,'w') as changed:
        for entry in old.infolist():
            content=old.read(entry)
            if entry.filename==MANIFEST_NAME:
                manifest=json.loads(content);manifest['tool_version']='99.0.0';content=json_text(manifest).encode()
            changed.writestr(entry,content)
    return output.getvalue()

class DeliveryFeedbackAdapterTests(unittest.TestCase):
    def invoke(self,script,requests):
        with tempfile.TemporaryDirectory() as folder:
            source=Path(folder)/'unknown.zip';raw=unknown_archive();source.write_bytes(raw)
            request_text=''.join(json.dumps(r,ensure_ascii=False)+'\n' for r in requests)
            p=subprocess.run([sys.executable,'-X','utf8',str(ROOT/script),'--delivery-zip',str(source)],cwd=folder,input=request_text,capture_output=True,text=True,encoding='utf-8',timeout=15)
            self.assertEqual(p.returncode,0,p.stderr);self.assertEqual(source.read_bytes(),raw);self.assertEqual([f.name for f in Path(folder).iterdir()],['unknown.zip'])
            return [json.loads(line) for line in p.stdout.splitlines()]
    def test_real_agent_bad_selected_zip_returns_reason_and_continues_other_operation(self):
        result=self.invoke('music_lab_agent.py',[{'protocol_version':1,'id':'bad','operation':'delivery_inspect','payload':{}},{'protocol_version':1,'id':'next','operation':'delivery_package','payload':SOURCE}])
        self.assertEqual(len(result),2);self.assertFalse(result[0]['ok']);self.assertEqual(result[0]['error']['code'],'invalid_input');self.assertEqual(result[0]['error']['message'],'交付清單版本不支援；沒有遷移')
        self.assertTrue(result[1]['ok']);self.assertEqual(result[1]['result']['meta']['version'],__version__);self.assertEqual(result[1]['result']['data']['manifest']['tool_version'],__version__)
    def test_real_mcp_bad_selected_zip_is_tool_error_and_next_package_continues(self):
        result=self.invoke('music_lab_mcp.py',[{'jsonrpc':'2.0','id':'init','method':'initialize','params':{'protocolVersion':MCP_VERSION,'capabilities':{},'clientInfo':{'name':'synthetic-feedback-check','version':'1'}}},{'jsonrpc':'2.0','method':'notifications/initialized'},
         {'jsonrpc':'2.0','id':'bad','method':'tools/call','params':{'name':'delivery_inspect','arguments':{'payload':{}}}},
         {'jsonrpc':'2.0','id':'next','method':'tools/call','params':{'name':'delivery_package','arguments':{'payload':SOURCE}}}])
        self.assertEqual(len(result),3);self.assertEqual(result[0]['result']['serverInfo']['version'],__version__)
        self.assertTrue(result[1]['result']['isError']);self.assertIn('交付清單版本不支援；沒有遷移',result[1]['result']['content'][0]['text'])
        self.assertFalse(result[2]['result']['isError']);self.assertEqual(result[2]['result']['structuredContent']['meta']['version'],__version__)

if __name__=='__main__':unittest.main()
