// Please create a class that will scrape any url provided and return all links within the page
class WebScrapper {
    constructor(url) {
        this.url = url;
    }

    async scrape() {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(this.url);

        const links = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('a'));
            return links.map(link => link.href);
        });

        await browser.close();

        return links;
    }
}