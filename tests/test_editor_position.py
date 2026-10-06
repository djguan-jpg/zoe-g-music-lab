# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import test_editor_copy as copy_assets
import unittest
ROOT=copy_assets.ROOT
class EditorPositionAssetsTests(unittest.TestCase):
    setUp=copy_assets.EditorCopyAssetsTests.setUp
    tearDown=copy_assets.EditorCopyAssetsTests.tearDown
    get=copy_assets.EditorCopyAssetsTests.get
    def test_position_assets_and_transient_controls_load_after_shared_order_metadata(self):
        page=self.get('/')[2].decode()
        names=['entry-order.js','editor-selection.js','editor-position.js','editor-position-dom.js','app.js']
        self.assertEqual([page.index('src="/'+n+'"') for n in names],sorted(page.index('src="/'+n+'"') for n in names))
        for name in names[2:4]:
            status,headers,raw=self.get('/'+name);self.assertEqual(status,200);self.assertEqual(raw,(ROOT/'web'/name).read_bytes());self.assertEqual(headers['Cache-Control'],'no-store');self.assertIn("script-src 'self'",headers['Content-Security-Policy'])
        for prefix in ['section','shots','cues']:
            self.assertIn('id="'+prefix+'-position" type="text" inputmode="numeric" maxlength="32" data-view-control="true"',page)
            self.assertIn('aria-describedby="'+prefix+'-position-note"',page)
            self.assertIn('id="'+prefix+'-position-move"',page)
    def test_position_assets_keep_host_origin_and_no_external_operation_authority(self):
        for route in ['/editor-position.js','/editor-position-dom.js']:
            for headers in [{'Host':'foreign.example'},{'Origin':'https://foreign.example'}]:self.assertEqual(self.get(route,headers)[0],403)
            self.assertEqual(self.get(route+'/outside')[0],404)
        self.assertEqual(self.get('/api/editor-position')[0],404)
if __name__=='__main__':unittest.main()
