class WebScraper {
    constructor(url) {
        this.url = url;
    }

    async scrape() {
        const response = await fetch(this.url);
        const text = await response.text();
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(text, "text/html");
        const links = htmlDoc.getElementsByTagName("a");
        const results = [];

        for (let i = 0; i < links.length; i++) {
            const link = links[i].href;
            const title = links[i].textContent.trim();

            if (link && link.startsWith("http") && title) {
                results.push({ pageTitle: title, link: link });
            }
        }

        return results;
    }
}