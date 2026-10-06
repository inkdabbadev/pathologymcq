import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location('content_import', Path(__file__).resolve().parents[1] / 'scripts/import-content.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class ContentImportTests(unittest.TestCase):
    def test_deduplicates_articles_and_preserves_categories_and_text(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            post = {'title': "O'Brien &amp; Pathology", 'url': 'https://example.com/article/', 'date': '2026-10-01T12:00:00', 'content_text': "Patient's text\nSecond line", 'images': ['https://example.com/wp-content/uploads/slide.png', 'https://example.com/wp-content/plugins/clock.png']}
            inputs = {'courses': [], 'mock_tests': [], 'practice_questions': [], 'posts_by_category': {'First': [post], 'Second': [post]}}
            for key, value in inputs.items():
                (root / f'{key}.json').write_text(json.dumps(value))
            sql, counts = module.build(root)
            self.assertEqual(counts['posts'], 1)
            self.assertEqual(counts['categories'], 2)
            self.assertEqual(sql.count('insert into public.posts'), 1)
            self.assertIn("O''Brien & Pathology", sql)
            self.assertIn("Patient''s text", sql)
            self.assertIn("slug in ('second')", sql)
            self.assertNotIn('plugins/clock', sql)
            self.assertIn('on conflict do nothing', sql)
            self.assertEqual(module.build(root)[0], sql)
            inputs['practice_questions'] = [{'question': 'Unsupported format'}]
            (root / 'practice_questions.json').write_text(json.dumps(inputs['practice_questions']))
            with self.assertRaises(ValueError):
                module.build(root)


if __name__ == '__main__':
    unittest.main()
