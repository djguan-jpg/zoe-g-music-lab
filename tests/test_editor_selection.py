# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import test_editor_copy as copy_assets
import unittest
ROOT=copy_assets.ROOT
class EditorSelectionAssetsTests(unittest.TestCase):
    setUp=copy_assets.EditorCopyAssetsTests.setUp
    tearDown=copy_assets.EditorCopyAssetsTests.tearDown
    get=copy_assets.EditorCopyAssetsTests.get
    def test_fixed_assets_match_and_load_after_metadata_models(self):
        page=self.get('/')[2].decode();names=['editor-focus.js','entry-order.js','editor-selection.js','editor-selection-dom.js','app.js']
        self.assertEqual([page.index('src="/'+n+'"') for n in names],sorted(page.index('src="/'+n+'"') for n in names))
        for name in names[2:4]:
            status,headers,raw=self.get('/'+name);self.assertEqual(status,200);self.assertEqual(raw,(ROOT/'web'/name).read_bytes());self.assertEqual(headers['Cache-Control'],'no-store');self.assertIn("script-src 'self'",headers['Content-Security-Policy'])
    def test_host_origin_and_fixed_paths_preserve_original_authority(self):
        for route in ['/editor-selection.js','/editor-selection-dom.js']:
            for headers in [{'Host':'foreign.example'},{'Origin':'https://foreign.example'}]:self.assertEqual(self.get(route,headers)[0],403)
            self.assertEqual(self.get(route+'/extra')[0],404);self.assertEqual(self.get(route+'?path=outside')[2],(ROOT/'web'/route[1:]).read_bytes())
        self.assertEqual(self.get('/api/editor-selection')[0],404)
if __name__=='__main__':unittest.main()
