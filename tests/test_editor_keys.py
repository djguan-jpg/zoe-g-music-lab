# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import test_editor_copy as copy_assets
import unittest
ROOT=copy_assets.ROOT
class EditorKeysAssetsTests(unittest.TestCase):
    setUp=copy_assets.EditorCopyAssetsTests.setUp
    tearDown=copy_assets.EditorCopyAssetsTests.tearDown
    get=copy_assets.EditorCopyAssetsTests.get
    def test_fixed_assets_and_literal_keyboard_help(self):
        page=self.get('/')[2].decode();names=['editor-selection.js','editor-keys.js','editor-keys-dom.js','app.js']
        self.assertEqual([page.index('src="/'+n+'"') for n in names],sorted(page.index('src="/'+n+'"') for n in names))
        for name in names[1:3]:
            status,headers,raw=self.get('/'+name);self.assertEqual(status,200);self.assertEqual(raw,(ROOT/'web'/name).read_bytes());self.assertEqual(headers['Cache-Control'],'no-store');self.assertIn("script-src 'self'",headers['Content-Security-Policy'])
        self.assertEqual(page.count('在文字或時間欄按 Alt＋↑／↓ 移動目前列'),3)
    def test_keyboard_assets_do_not_expand_paths_or_operation_authority(self):
        for route in ['/editor-keys.js','/editor-keys-dom.js']:
            for headers in [{'Host':'foreign.example'},{'Origin':'https://foreign.example'}]:self.assertEqual(self.get(route,headers)[0],403)
            self.assertEqual(self.get(route+'/extra')[0],404);self.assertEqual(self.get(route+'?path=outside')[2],(ROOT/'web'/route[1:]).read_bytes())
        self.assertEqual(self.get('/api/editor-keys')[0],404)
if __name__=='__main__':unittest.main()
