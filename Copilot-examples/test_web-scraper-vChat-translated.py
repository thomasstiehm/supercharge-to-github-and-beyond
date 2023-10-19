# Generated using the inline Copilot Chat /tests command

import unittest
from web_scraper import WebScraper


class TestWebScraper(unittest.TestCase):
    def setUp(self):
        self.scraper = WebScraper("https://www.example.com")

    def test_scrape(self):
        results = self.scraper.scrape()
        self.assertIsInstance(results, list)
        self.assertGreater(len(results), 0)
        for result in results:
            self.assertIn("pageTitle", result)
            self.assertIsInstance(result["pageTitle"], str)
            self.assertIn("link", result)
            self.assertIsInstance(result["link"], str)
