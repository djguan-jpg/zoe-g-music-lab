# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import copy, http.client, json, subprocess, sys, threading, unittest
from dataclasses import FrozenInstanceError
from pathlib import Path
from musiclab import __version__
from musiclab.delivery_versions import POLICY, CURRENT_VERSION, SUPPORTED_TOOL_VERSIONS, create_policy, decode_policy, contract_script
from musiclab.delivery_inspect import descriptor
from musiclab.delivery_package import prepare
from music_lab_server import WorkbenchServer, WorkbenchHandler

ROOT=Path(__file__).resolve().parents[1]


class DeliveryVersionTests(unittest.TestCase):
    def test_explicit_historical_oracle_product_and_discovery_agree(self):
        expected=tuple('0.'+str(v)+'.0' for v in range(38,63))
        self.assertEqual(SUPPORTED_TOOL_VERSIONS,expected)
        self.assertEqual(__version__,CURRENT_VERSION)
        self.assertEqual(CURRENT_VERSION,expected[-1])
        metadata=json.loads((ROOT/'projects.json').read_text(encoding='utf-8'))
        self.assertEqual(metadata['version'],CURRENT_VERSION)
        self.assertEqual(metadata['delivery_versions_schema_version'],1)
        self.assertEqual(descriptor()['supported_tool_versions'],list(expected))
        description=descriptor();description['supported_tool_versions'].clear()
        self.assertEqual(POLICY.supported,expected)

    def test_sparse_explicit_policy_is_immutable_and_does_not_infer_gaps(self):
        data={'format':'zoe-delivery-versions','schema_version':1,'current':'0.59.0','supported':['0.38.0','0.59.0']}
        before=copy.deepcopy(data);policy=create_policy(data)
        self.assertEqual(data,before)
        self.assertTrue(policy.supports_version('0.38.0'))
        self.assertFalse(policy.supports_version('0.54.0'))
        for value in [None,True,[],{},59,'0.59.0\n','0.059.0','0.60.0']:
            self.assertFalse(policy.supports_version(value))
        data['supported'].clear();data['current']='1.0.0'
        self.assertEqual(policy.current,'0.59.0')
        self.assertTrue(policy.supports_version('0.59.0'))
        with self.assertRaises(FrozenInstanceError):policy.current='1.0.0'

    def test_unknown_shapes_versions_order_and_budgets_fail_without_input_mutation(self):
        good=POLICY.descriptor();cases=[None,[],{},dict(good,extra=True),dict(good,schema_version=True),dict(good,schema_version=2),dict(good,format='other'),dict(good,current='0.58.0'),dict(good,supported=[]),dict(good,supported=tuple(good['supported'])),dict(good,supported=['0.59.0','0.59.0']),dict(good,supported=['0.59.0','0.38.0']),dict(good,supported=['0.1.0']*129)]
        for value in ['0.59','0.59.0-beta','0.059.0','０.59.0','+0.59.0','0.59.0\n','0.59.0\r','0.59.0\u2028','0.59.0\x00','2147483648.0.0','0.99999999999.0',1,None]:
            cases.append(dict(good,current=value,supported=[value]))
        for data in cases:
            before=copy.deepcopy(data)
            with self.subTest(data=data),self.assertRaises(ValueError):create_policy(data)
            self.assertEqual(data,before)
        upper=create_policy(dict(good,current='2147483647.2147483647.2147483647',supported=['2147483647.2147483647.2147483647']))
        self.assertTrue(upper.supports_version(upper.current))

    def test_strict_decoding_refuses_duplicate_bom_nonfinite_and_oversized_contract(self):
        good=json.dumps(POLICY.descriptor())
        for raw in [good.replace('"schema_version": 1','"schema_version": 1,"schema_version": 1'), '\ufeff'+good, good.replace('"schema_version": 1','"schema_version": NaN'), ' '*8193, b'\xff', good.replace('0.59.0','0.59.0\\ud800')]:
            with self.subTest(raw=repr(raw)[:100]),self.assertRaises(ValueError):decode_policy(raw)
        self.assertEqual(decode_policy(good.encode()).descriptor(),POLICY.descriptor())
        self.assertEqual(contract_script(),'globalThis.MusicDeliveryVersionsContract='+json.dumps(POLICY.descriptor(),ensure_ascii=True,separators=(',',':'))+';\n')

    def test_real_agent_current_version_and_shared_package_policy(self):
        p=subprocess.run([sys.executable,'-X','utf8',str(ROOT/'music_lab_agent.py'),'--describe'],cwd=ROOT,capture_output=True,text=True,encoding='utf-8',timeout=10)
        self.assertEqual(p.returncode,0,p.stderr);data=json.loads(p.stdout)
        self.assertEqual(data['version'],CURRENT_VERSION)
        self.assertEqual(data['delivery_inspection']['supported_tool_versions'],list(SUPPORTED_TOOL_VERSIONS))
        self.assertEqual(data['protocol_version'],1);self.assertEqual(len(data['operations']),13)
        source={'scope':'music','files':{'source.txt':'原文🎵'}}
        self.assertEqual(prepare(source).manifest['tool_version'],CURRENT_VERSION)
        for version in [True,[],{},'0.63.0','0.37.0','0.59.0\n']:
            with self.subTest(version=version),self.assertRaises(ValueError):prepare(source,tool_version=version)


class DeliveryVersionHTTPTests(unittest.TestCase):
    def setUp(self):
        self.server=WorkbenchServer(('127.0.0.1',0),WorkbenchHandler)
        self.thread=threading.Thread(target=self.server.serve_forever);self.thread.start()
    def tearDown(self):
        self.server.shutdown();self.thread.join(5);self.server.server_close()
    def get(self,path,headers=None):
        connection=http.client.HTTPConnection('127.0.0.1',self.server.server_port,timeout=5)
        try:
            connection.request('GET',path,headers=headers or {});reply=connection.getresponse()
            return reply.status,dict(reply.getheaders()),reply.read()
        finally:connection.close()
    def test_fixed_script_matches_policy_no_store_csp_and_browser_load_order(self):
        status,headers,raw=self.get('/delivery-versions-contract.js')
        self.assertEqual(status,200);self.assertEqual(raw,contract_script().encode())
        self.assertEqual(headers['Cache-Control'],'no-store');self.assertIn("script-src 'self'",headers['Content-Security-Policy'])
        self.assertEqual(headers['X-Content-Type-Options'],'nosniff');self.assertIn('text/javascript',headers['Content-Type'])
        self.assertEqual(self.get('/delivery-versions.js')[2],(ROOT/'musiclab/assets/delivery-versions.js').read_bytes())
        page=self.get('/')[2].decode();scripts=['/json-document.js','/delivery-versions-contract.js','/delivery-versions.js','/delivery-package.js','/app.js']
        self.assertEqual([page.index('src="'+s+'"') for s in scripts],sorted(page.index('src="'+s+'"') for s in scripts))
        self.assertFalse(hasattr(self.server,'delivery_downloads'))
    def test_existing_host_origin_gate_and_fixed_routes_do_not_open_paths(self):
        for route in ['/delivery-versions-contract.js','/delivery-versions.js']:
            self.assertEqual(self.get(route,{'Origin':'https://foreign.example'})[0],403)
            self.assertEqual(self.get(route,{'Host':'foreign.example'})[0],403)
        for route in ['/delivery-versions.json','/musiclab/assets/delivery-versions.json','/delivery-versions-contract.js/extra']:
            self.assertEqual(self.get(route)[0],404)
        self.assertEqual(self.get('/delivery-versions-contract.js?path=outside')[2],contract_script().encode())


if __name__=='__main__':unittest.main()
