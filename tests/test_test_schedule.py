# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import unittest
from musiclab.test_schedule import partition
from musiclab.test_run_summary import MAX_TESTS


class TestScheduleTests(unittest.TestCase):
    def test_one_large_module_is_spread_without_missing_or_duplicate_methods(self):
        source = ['large.Synthetic.test_'+str(i) for i in range(999)]
        groups = partition(source)
        self.assertEqual([len(group) for group in groups], [500, 499])
        self.assertEqual(set(groups[0]) | set(groups[1]), set(source))
        self.assertFalse(set(groups[0]) & set(groups[1]))

    def test_each_worker_preserves_independent_discovery_order(self):
        source = ['z.C.test_b', 'a.C.test_z', 'z.C.test_a', 'a.C.test_b', 'b.C.test_c']
        positions = {identifier: index for index, identifier in enumerate(source)}
        for group in partition(source):
            self.assertEqual(group, sorted(group, key=positions.__getitem__))
        self.assertEqual(set(sum(partition(source), [])), set(source))

    def test_returned_groups_are_isolated_and_repeatable(self):
        source = ['s.C.test_a', 's.C.test_b', 's.C.test_c']
        expected = partition(source)
        first = partition(source)
        first[0].clear(); first[1].append('changed')
        self.assertEqual(partition(source), expected)
        self.assertEqual(len(source), 3)
        source.clear()
        self.assertEqual(sum(map(len, expected)), 3)

    def test_single_method_allows_one_empty_worker(self):
        groups = partition(['s.C.test_only'])
        self.assertEqual(groups, [['s.C.test_only'], []])
        self.assertEqual(partition(['s.C.test_a', 's.C.test_b']), [['s.C.test_a'], ['s.C.test_b']])

    def test_invalid_or_duplicate_discovery_cannot_create_a_partial_plan(self):
        for source in ([], ['same', 'same'], None, ('a', 'b'), [None], [''], ['a\n'], ['a\0'], ['\ud800'], ['x'*513]):
            with self.subTest(source=repr(source)), self.assertRaises(ValueError):
                partition(source)

    def test_existing_discovery_count_and_utf8_limits_are_not_expanded(self):
        source = ['s.C.test_'+str(i) for i in range(MAX_TESTS)]
        self.assertEqual(sum(map(len, partition(source))), MAX_TESTS)
        with self.assertRaises(ValueError): partition(source+['extra'])
        self.assertEqual(partition(['💡'*128]), [['💡'*128], []])
        with self.assertRaises(ValueError): partition(['💡'*129])


if __name__ == '__main__': unittest.main()
