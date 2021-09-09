const puppeteer = require('puppeteer');

/**
 * Go to url and return the page title
 * @param {string} url
 * @returns {string}
 */
async function getPageTitle(url) {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	await page.goto(url, { waitUntil: 'networkidle0' });
	const title = await page.evaluate(() => document.querySelector('head > title').innerText);

	await browser.close();

	return title;
}

async function getMovieDetails(url) {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	await page.goto(url, { waitUntil: 'networkidle0' });

	var allMovieDetails = [];

	const enlaces = await page.evaluate(() => {
		const elements = document.querySelectorAll('a.movie-box');
		const links = [];
		for (let element of elements) {
			links.push(element.href);
		}

		return links;
	});

	//	var responses = [];
	for (let enlace of enlaces) {
		// page.on("response", async (response) => {
		// 	if (response._request._resourceType == "xhr") {
		// 		if (response.data[0] == "id" && response.data[0] == "language_id") {
		// 			responses.push(response);
		// 		}
		// 	}
		// });

		await page.goto(enlace);
		await page.waitForSelector('#movie > div > div > div.col-xl-9.col-lg-8.col-md-7.col-sm-12');

		const movie = await page.evaluate(() => {
			const details = {};
			details.originalTitle = document.querySelector('#movie > div > div > div.col-xl-9.col-lg-8.col-md-7.col-sm-12 > div > div:nth-child(2) > table > tbody > tr:nth-child(2) > td').innerText;
			details.title = document.querySelector('#movie > div > div > div.col-xl-9.col-lg-8.col-md-7.col-sm-12 h2').innerText;
			var synopsis = '';
			synopsis = document.querySelector('p.synopsis').innerText;
			synopsis += document.querySelector('#movie > div > div > div.col-xl-9.col-lg-8.col-md-7.col-sm-12 > div > div:nth-child(2) > p > span:nth-child(2)').innerText;
			// if (synopsis.includes('... ver más')){
			// 	synopsis.replace('... ver más', '');
			// }
			details.synopsis = synopsis;
			details.starred = document.querySelector('#movie > div > div > div.col-xl-9.col-lg-8.col-md-7.col-sm-12 > div > div:nth-child(2) > table > tbody > tr:nth-child(3) > td').innerText;
			details.director = document.querySelector('#movie > div > div > div.col-xl-9.col-lg-8.col-md-7.col-sm-12 > div > div:nth-child(2) > table > tbody > tr:nth-child(4) > td').innerText;
			var photo = '';
			photo = document.querySelector('#movie > div > div > div.col-xl-3.col-lg-4.col-md-5.col-sm-12 > div > span').style.cssText;
			var primerI = photo.indexOf("\"");
			var ultimoI = photo.lastIndexOf("\"");
			photo.substring((primerI+1),ultimoI);
			details.posterPhoto = photo;

			return details;
		});
		allMovieDetails.push(movie);
	}

	await browser.close();

	return allMovieDetails;
}

module.exports = {
	getPageTitle,
	getMovieDetails,
};
