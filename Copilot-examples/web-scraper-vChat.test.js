// Generated through Copilot Chat
describe("WebScraper", () => {
  it("should return an array of links", async () => {
    const scraper = new WebScraper("https://www.google.com");
    const links = await scraper.scrape();
    expect(Array.isArray(links)).toBe(true);
  });

  it("should return an array of JSON objects with pageTitle and link properties", async () => {
    const scraper = new WebScraper("https://www.google.com");
    const links = await scraper.scrape();
    expect(links.every((link) => "pageTitle" in link && "link" in link)).toBe(
      true
    );
  });

  it("should only return links that start with http", async () => {
    const scraper = new WebScraper("https://www.google.com");
    const links = await scraper.scrape();
    expect(links.every((link) => link.link.startsWith("http"))).toBe(true);
  });

  it("should only return links that have a title", async () => {
    const scraper = new WebScraper("https://www.google.com");
    const links = await scraper.scrape();
    expect(links.every((link) => link.pageTitle)).toBe(true);
  });
});

// Generated through Copilot Labs test generation tool
describe('test web_scraper_vChat', function() {
    it('test web-scraper-vChat.WebScraper.scrape', function(done) {
        let url = 'https://www.vChat.com';
        web_scraper_vChat.WebScraper.scrape(url)
            .then(function(results) {
                assert.isNotNull(results);
                assert.isArray(results);
                assert.isTrue(results.length > 0);
                let result = results[0];
                assert.isNotNull(result);
                assert.isString(result.pageTitle);
                assert.isTrue(result.pageTitle.length > 0);
                assert.isString(result.link);
                assert.isTrue(result.link.length > 0);
                done();
            })
            .catch(function(error) {
                assert.fail(error);
                done();
            });
    })
})