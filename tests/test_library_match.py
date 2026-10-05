# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import copy, json, subprocess, tempfile, unittest
from pathlib import Path
from musiclab.application import build
from musiclab.draft_library import DraftLibrary
from musiclab.library_match import checked_query, has_match, matched_fields
from test_draft_library import draft

ROOT = Path(__file__).resolve().parents[1]


class LibraryMatchTests(unittest.TestCase):
    def test_actual_saved_names_and_unicode_spans_match_browser_without_mutation(self):
        with tempfile.TemporaryDirectory() as folder:
            library = DraftLibrary(folder)
            source = draft()
            values = {'music': '🎵aa🎵aa e\u0301 é <script>x</script>',
                      'storyboard': 'aaaaa\r\n aa🎵', 'lyrics': ' aa\taa🎵'}
            for panel, key in [('music', 'music-title'), ('storyboard', 'mv-title'), ('lyrics', 'lyrics-title')]:
                source['panels'][panel]['fields'][key] = values[panel]
            saved = library.save(source, '🎵aa🎵aa <img src=x> e\u0301 é', 'draft-'+'1'*32)
            record = saved['entry']
            original = copy.deepcopy(record)
            before = {p.relative_to(library.root).as_posix(): p.read_bytes() for p in library.root.rglob('*') if p.is_file()}
            cases = []
            for query in ['aa', '🎵', 'e\u0301', 'é', 'AA', ' aa', '\r\n', '<script>', '不存在']:
                result = matched_fields(record, query)
                self.assertEqual(has_match(record, query), bool(result))
                reply = build('draft_search', {'query': query}, draft_library=library)
                self.assertEqual(reply.data['match_count'], int(bool(result)))
                for field in result:
                    last = 0
                    for start, end in field['spans']:
                        self.assertGreaterEqual(start, last)
                        self.assertEqual(field['text'][start:end], query)
                        last = end
                cases.append({'record': record, 'query': query, 'matches': result})
            code = "const M=require('./web/library-match.js');let s='';process.stdin.on('data',v=>s+=v);process.stdin.on('end',()=>console.log(JSON.stringify(JSON.parse(s).map(v=>({matches:M.matchedFields(v.record,v.query),found:M.hasMatch(v.record,v.query)})))));"
            r = subprocess.run(['node', '-e', code], cwd=ROOT, input=json.dumps(cases, ensure_ascii=False), capture_output=True, text=True, encoding='utf-8', timeout=10)
            self.assertEqual(r.returncode, 0, r.stderr[-1000:])
            for case, received in zip(cases, json.loads(r.stdout)):
                self.assertEqual(received['matches'], case['matches'])
                self.assertEqual(received['found'], bool(case['matches']))
            self.assertEqual(matched_fields(record, 'aa')[0]['spans'], [[1, 3], [4, 6]])
            self.assertEqual(record, original)
            self.assertEqual(before, {p.relative_to(library.root).as_posix(): p.read_bytes() for p in library.root.rglob('*') if p.is_file()})

    def test_bounded_queries_full_metadata_and_returned_spans_are_isolated(self):
        record = {'library_schema_version': 1, 'id': 'draft-'+'1'*32, 'label': '🎵'*200,
                  'stored_at': '2026-10-05T01:02:03+00:00', 'sha256': 'a'*64, 'bytes': 2048,
                  'draft_schema_version': 3, 'created_with': '0.76.0', 'titles': dict.fromkeys(['music','storyboard','lyrics'], '🎵'*120)}
        self.assertEqual(checked_query('🎵'*200), '🎵'*200)
        result = matched_fields(record, '🎵')
        self.assertEqual(len(result), 4)
        self.assertEqual(sum(len(row['spans']) for row in result), 560)
        result[0]['text'] = 'changed'; result[0]['spans'][0][0] = 99
        self.assertEqual(matched_fields(record, '🎵')[0]['spans'][0], [0, 1])
        for query in ['', '🎵'*201, '\ud800', None, True]:
            with self.assertRaises(ValueError): matched_fields(record, query)
        for change in [lambda r: r.update(path='x'), lambda r: r.update(library_schema_version=2),
                       lambda r: r.update(bytes=True), lambda r: r['titles'].update(music='\udfff'),
                       lambda r: r.update(created_with='\ud800')]:
            bad = copy.deepcopy(record); change(bad)
            with self.assertRaises(ValueError): matched_fields(bad, 'no match')


if __name__ == '__main__': unittest.main()
