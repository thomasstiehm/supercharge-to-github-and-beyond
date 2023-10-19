# Translated from javascript using the Copilot Labs translate tool
class WebScraper:
    def __init__(self, url):
        self.url = url

    async def scrape(self):
        response = await fetch(self.url)
        text = await response.text()
        parser = DOMParser()
        htmlDoc = parser.parseFromString(text, "text/html")
        links = htmlDoc.getElementsByTagName("a")
        results = []

        for i in range(0, len(links)):
            link = links[i].href
            title = links[i].textContent.trim()

            if link and link.startswith("http") and title:
                results.push({"pageTitle": title, "link": link})

        return results
