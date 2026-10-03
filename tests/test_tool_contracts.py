# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import hashlib
import json
import subprocess
import sys
import tempfile
import unittest
import wave
from pathlib import Path
from unittest.mock import patch
from musiclab.application import build
from musiclab.audio import analyze_wav
from music_lab_mcp import tool_list, Session, MCP_VERSION

ROOT=Path(__file__).resolve().parents[1]

class ToolContractTests(unittest.TestCase):
    def test_explicit_nonobject_arguments_are_protocol_errors(self):
        session = Session()
        session.response(json.dumps({'jsonrpc':'2.0','id':1,'method':'initialize','params':{
            'protocolVersion':MCP_VERSION,'capabilities':{},'clientInfo':{'name':'envelope-check','version':'1'}}}))
        session.response(json.dumps({'jsonrpc':'2.0','method':'notifications/initialized'}))
        for arguments in (None, [], True, "invalid", 0):
            with self.subTest(arguments=arguments):
                request = {'jsonrpc':'2.0','id':2,'method':'tools/call','params':{'name':'lyrics_validate','arguments':arguments}}
                self.assertEqual(session.response(json.dumps(request))['error']['code'], -32602)
    def test_ambiguous_lyric_sources_refuse_data_loss(self):
        cues=[{'start':0,'end':2,'text':'保留逐句'}]
        for other in [{'content':'[00:00.000]另一份原文'},{'suffix':'.srt'}]:
            with self.subTest(other=other),self.assertRaisesRegex(ValueError,'cues.*content|suffix'):
                build('lyrics',{'cues':cues,**other})
        result=build('lyrics',{'cues':cues,'duration':2})
        self.assertEqual(result.data['cues'],cues)
        self.assertEqual(build('lyrics',{'content':'[00:00.000]保留逐句','duration':2}).data['cues'],cues)

    def test_invalid_audio_limits_are_rejected_before_source_is_opened(self):
        with patch('pathlib.Path.open',side_effect=AssertionError('Invalid input reached media')) as opened:
            for field in ('rates','bits','channels'):
                for value in ([True],[1.5],['1'],[],[0],1):
                    with self.subTest(field=field,value=value),self.assertRaisesRegex(ValueError,field):
                        analyze_wav('not-opened.wav',**{field:value})
            with self.assertRaisesRegex(ValueError,'profile'):
                analyze_wav('not-opened.wav',profile='unknown')
            opened.assert_not_called()

    def test_discovery_describes_editable_fields_and_structured_results(self):
        tools={item['name']:item for item in tool_list()}
        for name in ['music_plan','storyboard_plan','lyrics_validate','audio_report']:
            self.assertEqual(tools[name]['inputSchema']['required'],['payload'])
            self.assertEqual(set(tools[name]['outputSchema']['required']),{'files','data','meta'})
            self.assertEqual(tools[name]['execution']['taskSupport'],'forbidden')
        music=tools['music_plan']['inputSchema']['properties']['payload']['properties']
        self.assertTrue({'language','avoid','deliverables','bpm','memory_hook','arrangement','duration_seconds','structure'}<=set(music))
        self.assertIn('focus',music['arrangement']['items']['properties'])
        shots=tools['storyboard_plan']['inputSchema']['properties']['payload']['properties']['shots']['items']['properties']
        self.assertEqual(shots['screen_direction']['enum'],['left','right','neutral'])
        self.assertIn('change_reason',shots)

    def test_real_stdio_malformed_envelope_recovers_and_valid_audio_is_preserved(self):
        with tempfile.TemporaryDirectory() as folder:
            source=Path(folder)/'synthetic.wav'
            with wave.open(str(source),'wb') as wav:
                wav.setnchannels(1);wav.setsampwidth(2);wav.setframerate(48000);wav.writeframes(b'\x00\x10'*480)
            before=hashlib.sha256(source.read_bytes()).hexdigest()
            def request(rid,method,params):
                return {'jsonrpc':'2.0','id':rid,'method':method,'params':params}
            requests=[request(1,'initialize',{'protocolVersion':'2025-11-25','capabilities':{},'clientInfo':{'name':'contract-check','version':'1'}}),
                      {'jsonrpc':'2.0','method':'notifications/initialized'},
                      request(2,'tools/call',{'name':'audio_report','arguments':[]}),
                      request(3,'tools/call',{'name':'audio_report','arguments':{'payload':{'channels':[True]}}}),
                      request(4,'tools/call',{'name':'audio_report','arguments':{'payload':{'rates':[48000.0],'bits':[16.0],'channels':[1.0]}}})]
            process=subprocess.run([sys.executable,'-X','utf8',str(ROOT/'music_lab_mcp.py'),'--audio',str(source)],
                input=''.join(json.dumps(item)+'\n' for item in requests),capture_output=True,text=True,encoding='utf-8',cwd=folder,timeout=10)
            self.assertEqual(process.returncode,0,process.stderr)
            replies={item['id']:item for item in map(json.loads,process.stdout.splitlines())}
            self.assertEqual(replies[2]['error']['code'],-32602)
            self.assertTrue(replies[3]['result']['isError'])
            self.assertIn('channels',replies[3]['result']['content'][0]['text'])
            self.assertFalse(replies[4]['result']['isError'])
            wire=replies[4]['result']['structuredContent']
            self.assertEqual(json.loads(replies[4]['result']['content'][0]['text']),wire)
            self.assertEqual(wire,build('audio',requests[-1]['params']['arguments']['payload'],audio_source=source).wire())
            self.assertEqual(hashlib.sha256(source.read_bytes()).hexdigest(),before)
            self.assertEqual([path.name for path in Path(folder).iterdir()],['synthetic.wav'])

if __name__=='__main__':
    unittest.main()
