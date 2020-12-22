const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	let count = 1;
	while (count < 355) {
		await page.goto(
			`https://apps.cra-arc.gc.ca/ebci/hacc/cews/srch/pub/fllLstSrh?dsrdPg=${count}&q.ordrClmn=NAME&q.ordrRnk=ASC`
		);

		let data = await page.evaluate(() => {
			let tds = Array.from(document.querySelectorAll('table tr'));
			/**
			 * * Remove the first element of the page it is just the default column name for the table
			 */
			tds.shift();
			/**
			 * * Returns the inner text of the business name split by a '|' and the Operating Name
			 */
			return tds.map(
				(td) =>
					td.children[0].innerText + '|' + td.children[1].innerText
			);
		});
		let text = data.join('\n');
		await fs.appendFileSync('./CEWS.csv', text);
		count++;
	}
	browser.close();
})();
