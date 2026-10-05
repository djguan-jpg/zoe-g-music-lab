# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import test_editor_copy as copy_assets
import unittest
ROOT=copy_assets.ROOT
class EditorOrderAssetsTests(unittest.TestCase):
    setUp=copy_assets.EditorCopyAssetsTests.setUp
    tearDown=copy_assets.EditorCopyAssetsTests.tearDown
    get=copy_assets.EditorCopyAssetsTests.get
    def test_fixed_order_assets_match_and_load_in_dependency_order(self):
        page=self.get('/')[2].decode()
        scripts=['editor-copy.js','entry-order.js','editor-order.js','editor-order-dom.js','music-arrangement.js','app.js']
        self.assertEqual([page.index('src="/'+n+'"') for n in scripts],sorted(page.index('src="/'+n+'"') for n in scripts))
        for name in scripts[1:4]:
            status,headers,raw=self.get('/'+name)
            self.assertEqual(status,200);self.assertEqual(raw,(ROOT/'web'/name).read_bytes())
            self.assertEqual(headers['Cache-Control'],'no-store');self.assertIn("script-src 'self'",headers['Content-Security-Policy'])
        for name in ['shots-order','cues-order','shots-order-undo','cues-order-show']:self.assertIn('id="'+name+'"',page)
    def test_order_fixed_routes_preserve_gates_and_no_user_path_authority(self):
        for route in ['/entry-order.js','/editor-order.js','/editor-order-dom.js']:
            for headers in [{'Host':'foreign.example'},{'Origin':'https://foreign.example'}]:self.assertEqual(self.get(route,headers)[0],403)
            self.assertEqual(self.get(route+'/extra')[0],404)
            self.assertEqual(self.get(route+'?path=outside')[2],(ROOT/'web'/route[1:]).read_bytes())
        self.assertEqual(self.get('/api/editor-order')[0],404)
if __name__=='__main__':unittest.main()
