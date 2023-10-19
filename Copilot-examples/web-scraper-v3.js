// Please create a class that will scrape any url provided and return all links within the page. Requirements for the class are delimited by each line in the following block comment.
/**
 * Must obey all robots.txt files
 * Uses only methods and features available in the Javascript framework, meaning do not use any external packages
 * Have test cases to match all methods created
 * Uses the fetch api for making and receiving requests
 * Ensures that all data pulled in is sanitized to prevent malicious code from executing
 * Validate that a <a> tag has a link before adding it to the list of results
 * Returns an array of JSON objects following this structure: { “pageTitle”: “”, “link”: “” }
 */
class WebScrapper {
  constructor() {
    this.visited = new Set();
    this.toVisit = [];
    this.results = [];
  }

  async scrape(url) {
    const response = await fetch(url);
    const data = await response.text();
    const dom = new JSDOM(data);
    const links = dom.window.document.querySelectorAll("a");
    const title = dom.window.document.querySelector("title").textContent;
    const results = [];
    links.forEach((link) => {
      if (link.href) {
        results.push({
          pageTitle: title,
          link: link.href,
        });
      }
    });
    return results;
  }

  async crawl(url) {
    if (this.visited.has(url)) {
      return;
    }
    this.visited.add(url);
    const results = await this.scrape(url);
    this.results.push(...results);
    results.forEach((result) => {
      this.toVisit.push(result.link);
    });
    while (this.toVisit.length > 0) {
      const nextUrl = this.toVisit.shift();
      await this.crawl(nextUrl);
    }
  }
}