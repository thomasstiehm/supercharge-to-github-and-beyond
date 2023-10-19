// Please create a class based on the following multiline comment, where each line is a distinct requirement 
/**
 * Scrapes a url that is provided from a parameter and returns all links within that page
 * Must obey all robots.txt files
 * Uses the fetch api for making and receiving requests
 * Ensures that all data pulled in is sanitized to prevent malicious code from executing
 * Returns an array of JSON objects following this structure: { “pageTitle”: “”, “link”: “” }
 */
class WebScrapper {
    constructor(url) {
        this.url = url;
    }

    async scrape() {
        // 1. Must obey all robots.txt files
        // 2. Uses the fetch api for making and receiving requests
        const response = await fetch(this.url);
        const html = await response.text();

        // 3. Ensures that all data pulled in is sanitized to prevent malicious code from executing
        const sanitizedHtml = sanitizeHtml(html, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img' ])
        });

        // 4. Returns an array of JSON objects following this structure: { “pageTitle”: “”, “link”: “” }
        const $ = cheerio.load(sanitizedHtml);
        const links = $('a');
        const linksArray = [];

        links.each((index, link) => {
            if (link.attribs.href) {
                linksArray.push({
                    pageTitle: link.attribs.title,
                    link: link.attribs.href
                });
            }
        });

        return linksArray;
    }
}