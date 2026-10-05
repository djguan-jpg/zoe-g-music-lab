# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import copy, datetime, hashlib, io, json, subprocess, tempfile, unittest, zipfile
from pathlib import Path
from musiclab.utc_timestamp import checked_utc_timestamp
from musiclab.library_contract import validate_record
from musiclab.application import build
from musiclab.draft_library import DraftLibrary
from musiclab.draft_backup import export_backup, read_backup, restore_backup
from test_draft_library import draft

ROOT = Path(__file__).resolve().parents[1]
VALID = ['0001-01-01T00:00:00+00:00','9999-12-31T23:59:59.999999-00:00',
         '2000-02-29T01:02:03Z','2026-10-05 01:02:03.123+00:00',
         '2026-10-05🎵01+00:00','2026-10-05t01:02-00:00:00.000000',
         '2026-10-05\n01:02:03+00:00:00.000']
INVALID = ['0000-01-01T00:00:00Z','1900-02-29T01:02:03Z','2026-02-30T01:02:03+00:00',
           '2026-04-31T01:02:03+00:00','2026-10-05T24:00:00+00:00','2026-10-05T01:60:00Z',
           '2026-10-05T01:02:60Z','2026-10-05T01:02:03.1Z','2026-10-05T01:02:03.1234567Z',
           '2026-10-05T01:02:03,123Z','2026-10-05T01:02:03+08:00','2026-10-05T01:02:03+00:00:01',
           '2026-10-05T01:02:03+00:00:00.000001','20261005T010203Z','2026-10-05','2026-10-05T01:02:03Z\n',
           '2026-10-05\ud80001:02:03Z','2026-10-05TT01:02:03Z','2026-10-05T01:02:03z','x'*129]

def bridge(values):
    code="const T=require('./musiclab/assets/utc-timestamp.js');let s='';process.stdin.on('data',v=>s+=v);process.stdin.on('end',()=>console.log(JSON.stringify(JSON.parse(s).map(v=>{try{return T.checked(v)}catch(e){return null}}))));"
    r=subprocess.run(['node','-e',code],cwd=ROOT,input=json.dumps(values),capture_output=True,text=True,encoding='utf-8',timeout=10)
    if r.returncode: raise AssertionError(r.stderr[-1000:])
    return json.loads(r.stdout)

def changed_backup(raw, *, record_time=None, created_at=None):
    with zipfile.ZipFile(io.BytesIO(raw)) as archive: entries={name:archive.read(name) for name in archive.namelist()}
    manifest=json.loads(entries['manifest.json'])
    if created_at is not None: manifest['created_at']=created_at
    if record_time is not None:
        item=manifest['revisions'][0];name=item['id']+'/record.json';record=json.loads(entries[name]);record['stored_at']=record_time
        entries[name]=json.dumps(record,ensure_ascii=False,indent=2).encode();item['record_sha256']=hashlib.sha256(entries[name]).hexdigest();item['record_bytes']=len(entries[name])
    entries['manifest.json']=json.dumps(manifest,ensure_ascii=False).encode();out=io.BytesIO()
    with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED) as archive:
        for name,value in entries.items():archive.writestr(name,value)
    return out.getvalue(),entries

class UtcTimestampTests(unittest.TestCase):
    def test_actual_library_unicode_raw_order_and_search_continuation_match_browser(self):
        with tempfile.TemporaryDirectory() as folder:
            library=DraftLibrary(folder)
            for n,separator in enumerate(['🎵','\ue000'],1):
                entry=library.save(draft(),'Unicode 保存 '+str(n),'draft-'+f'{n:032x}')['entry'];path=library.root/entry['id']/'record.json';entry['stored_at']='2026-10-05'+separator+'01+00:00';path.write_text(json.dumps(entry,ensure_ascii=False),encoding='utf-8')
            listing=build('draft_list',{},draft_library=library).wire();p={'query':'Unicode','limit':1,'cursor':None};first=build('draft_search',p,draft_library=library).wire();next_payload={**p,'cursor':first['data']['next_cursor']};second=build('draft_search',next_payload,draft_library=library).wire()
            self.assertEqual([r['stored_at'] for r in listing['data']['entries']],['2026-10-05🎵01+00:00','2026-10-05\ue00001+00:00'])
            code="const L=require('./web/library-result.js'),S=require('./web/library-search.js');let s='';process.stdin.on('data',v=>s+=v);process.stdin.on('end',()=>{const v=JSON.parse(s),f=S.checkedResult(v.p,v.first);console.log(JSON.stringify({list:L.checkedList({limit:20,cursor:null},v.listing),next:S.checkedResult(v.next,v.second,f)}))});"
            r=subprocess.run(['node','-e',code],cwd=ROOT,input=json.dumps({'listing':listing['data'],'p':p,'first':first,'next':next_payload,'second':second}),capture_output=True,text=True,encoding='utf-8',timeout=10);self.assertEqual(r.returncode,0,r.stderr[-1000:]);value=json.loads(r.stdout);self.assertEqual(value['list'],listing['data']);self.assertEqual(value['next'],second['data'])

    def test_calendar_matrix_runtime_independent_unicode_and_exact_source_bridge(self):
        cases=VALID+INVALID+[None,True,42]
        for year in [1,4,100,400,1900,2000,2024,2026,2100,2400,9999]:
            for month in range(1,13):
                for day in [1,28,29,30,31,32]:
                    value=f'{year:04d}-{month:02d}-{day:02d}T23:59:59.123456+00:00'
                    cases.append(value)
        expected=[]
        for value in cases:
            try: expected.append(checked_utc_timestamp(value))
            except ValueError:expected.append(None)
        self.assertEqual(expected[:len(VALID)],VALID);self.assertTrue(all(v is None for v in expected[len(VALID):len(VALID)+len(INVALID)+3]))
        self.assertEqual(bridge(cases),expected)
        for value,result in zip(cases[len(VALID)+len(INVALID)+3:],expected[len(VALID)+len(INVALID)+3:]):
            try: datetime.datetime.fromisoformat(value);oracle=value
            except ValueError:oracle=None
            self.assertEqual(result,oracle)

    def test_actual_revision_search_backup_and_restore_keep_zero_offset_alias_bytes(self):
        with tempfile.TemporaryDirectory() as folder:
            source=DraftLibrary(Path(folder)/'source');entry=source.save(draft(),'合成 UTC 原文','draft-'+'1'*32)['entry'];record_path=source.root/entry['id']/'record.json'
            record=json.loads(record_path.read_text(encoding='utf-8'));record['stored_at']=VALID[2];record_path.write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
            before={p.relative_to(source.root).as_posix():p.read_bytes() for p in source.root.rglob('*') if p.is_file()}
            listing=build('draft_list',{},draft_library=source).wire();self.assertEqual(listing['data']['entries'][0]['stored_at'],VALID[2]);searched=build('draft_search',{'query':'UTC'},draft_library=source).wire();self.assertEqual(searched['data']['entries'][0],listing['data']['entries'][0])
            raw,_=export_backup(source);raw,expected=changed_backup(raw,created_at=VALID[2]);target=DraftLibrary(Path(folder)/'target')
            proof={'bytes':len(raw),'sha256':hashlib.sha256(raw).hexdigest()};plan=build('draft_backup_inspect',{},draft_library=target,backup_source=io.BytesIO(raw)).wire()
            code="const L=require('./web/library-result.js'),B=require('./web/backup-result.js');let s='';process.stdin.on('data',v=>s+=v);process.stdin.on('end',()=>{const v=JSON.parse(s);console.log(JSON.stringify({list:L.checkedList({cursor:null,limit:20},v.listing).entries,plan:B.checkedInspect(v.plan,v.proof)}))});"
            r=subprocess.run(['node','-e',code],cwd=ROOT,input=json.dumps({'listing':listing['data'],'plan':plan,'proof':proof}),capture_output=True,text=True,encoding='utf-8',timeout=10);self.assertEqual(r.returncode,0,r.stderr[-1000:]);parsed=json.loads(r.stdout);self.assertEqual(parsed['list'],listing['data']['entries']);self.assertEqual(parsed['plan'],plan['data'])
            restored=restore_backup(target,io.BytesIO(raw),proof['sha256']);self.assertEqual(restored['added_count'],1)
            for name,value in expected.items():
                if name!='manifest.json':self.assertEqual((target.root/name).read_bytes(),value)
            self.assertEqual(before,{p.relative_to(source.root).as_posix():p.read_bytes() for p in source.root.rglob('*') if p.is_file()})

    def test_invalid_record_or_backup_creation_clock_refuses_before_restore_writes(self):
        with tempfile.TemporaryDirectory() as folder:
            source=DraftLibrary(Path(folder)/'source');entry=source.save(draft(),'合成 UTC','draft-'+'1'*32)['entry'];original=copy.deepcopy(entry)
            raw,_=export_backup(source);target=DraftLibrary(Path(folder)/'target')
            for value in INVALID[:13]:
                bad={**entry,'stored_at':value}
                with self.assertRaises(ValueError):validate_record(bad,bad['id'])
                for changed in [changed_backup(raw,record_time=value)[0],changed_backup(raw,created_at=value)[0]]:
                    with self.assertRaises(ValueError):read_backup(io.BytesIO(changed))
                    with self.assertRaises(ValueError):restore_backup(target,io.BytesIO(changed),hashlib.sha256(changed).hexdigest())
                    self.assertEqual(target.directories(),[])
            self.assertEqual(entry,original)

if __name__=='__main__':unittest.main()
