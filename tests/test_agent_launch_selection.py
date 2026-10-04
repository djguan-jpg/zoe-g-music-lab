# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import io,json,subprocess,sys,tempfile,unittest,wave
from pathlib import Path
from scripts.agent_launch import launch_config,codex_toml
from musiclab.delivery_package import prepare
from musiclab.application import build
from music_lab_mcp import MCP_VERSION
ROOT=Path(__file__).resolve().parents[1]
class LaunchSelectionTests(unittest.TestCase):
 def test_defaults_and_existing_positional_library_backup_are_compatible(self):
  original=launch_config();self.assertEqual(original['args'],[(ROOT/'music_lab_mcp.py').as_posix()]);self.assertEqual(original['startup_timeout_sec'],10);self.assertEqual(original['tool_timeout_sec'],60)
  c=launch_config('selected library','selected backup.zip');self.assertEqual(c['args'][1:],[ '--draft-library',Path('selected library').resolve().as_posix(),'--draft-backup',Path('selected backup.zip').resolve().as_posix()])
 def test_selected_paths_are_absolute_and_only_printed_without_read_or_write(self):
  with tempfile.TemporaryDirectory() as folder:
   d=Path(folder);zipfile=d/'不存在 "選擇".ZIP';audio=d/'尚未建立.wav';c=launch_config(audio=audio,delivery_zip=zipfile);self.assertEqual(c['args'][1:],['--audio',audio.as_posix(),'--delivery-zip',zipfile.as_posix()]);self.assertEqual(list(d.iterdir()),[])
   toml=codex_toml(c);decoded={line.split(' = ',1)[0]:json.loads(line.split(' = ',1)[1]) for line in toml.splitlines()[1:]};self.assertEqual(decoded,c)
 def test_invalid_extensions_refuse_and_backup_still_requires_library(self):
  for args in [{'audio':'file.mp3'},{'delivery_zip':'file.json'},{'audio':''},{'delivery_zip':''},{'draft_backup':'backup.zip'}]:
   with self.assertRaises(ValueError):launch_config(**args)
  p=subprocess.run([sys.executable,'-X','utf8',str(ROOT/'scripts/agent_launch.py'),'--delivery-zip','wrong.txt'],capture_output=True,text=True,encoding='utf-8',timeout=10);self.assertEqual(p.returncode,2);self.assertEqual(p.stdout,'')
 def test_generated_settings_really_start_selected_zip_and_audio_tools_from_other_directory(self):
  with tempfile.TemporaryDirectory() as folder:
   d=Path(folder);selected=d/'選定 ZIP.zip';source={'scope':'music','files':{'original.md':'原合成內容'}};selected.write_bytes(prepare(source).archive);audio=d/'選定 WAV.wav'
   with wave.open(str(audio),'wb') as stream:stream.setnchannels(1);stream.setsampwidth(2);stream.setframerate(48000);stream.writeframes(b'\x00\x00'*48000)
   payload={'baseline':{'scope':'music','files':{}},'include_report':True};before={p.name:p.read_bytes() for p in d.iterdir()}
   generated=subprocess.run([sys.executable,'-X','utf8',str(ROOT/'scripts/agent_launch.py'),'--delivery-zip',str(selected),'--audio',str(audio)],cwd=folder,capture_output=True,text=True,encoding='utf-8',timeout=10);self.assertEqual(generated.returncode,0,generated.stderr);config=json.loads(generated.stdout)
   messages=[{'jsonrpc':'2.0','id':1,'method':'initialize','params':{'protocolVersion':MCP_VERSION,'capabilities':{},'clientInfo':{'name':'synthetic launch','version':'1'}}},{'jsonrpc':'2.0','method':'notifications/initialized'},{'jsonrpc':'2.0','id':2,'method':'tools/call','params':{'name':'delivery_inspect','arguments':{'payload':payload}}},{'jsonrpc':'2.0','id':3,'method':'tools/call','params':{'name':'audio_report','arguments':{'payload':{'profile':'video'}}}}]
   p=subprocess.run([config['command'],*config['args']],cwd=folder,input='\n'.join(json.dumps(x) for x in messages)+'\n',capture_output=True,text=True,encoding='utf-8',timeout=20);self.assertEqual(p.returncode,0,p.stderr);replies=[json.loads(x) for x in p.stdout.splitlines()];self.assertEqual(replies[1]['result']['structuredContent'],build('delivery_inspect',payload,delivery_source=selected).wire());self.assertEqual(replies[2]['result']['structuredContent'],build('audio',{'profile':'video'},audio_source=audio).wire());self.assertEqual({p.name:p.read_bytes() for p in d.iterdir()},before)
