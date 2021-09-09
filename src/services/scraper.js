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

async function getLinks(url) {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	await page.goto(url, { waitUntil: 'networkidle0' });
	await page.waitForSelector('[class=movie-box]');

	const enlaces = await page.evaluate(() => {
		const elements = document.querySelectorAll('a.movie-box');
		const links = [];
		for (let element of elements) {
			var id = '';
			id = element.href;
			id.toString();
			id = id.substr(46, 4);
			var link = 'https://royal-films.com/api/v1/movie/' + id + '/barranquilla?';
			links.push(link);
		}

		return links;
	});

	return enlaces;
}

async function getMovieDetails(url) {
	
	enlaces = await getLinks(url);

	var movieF;

	var allMovieDetails = [];

	for (let enlace of enlaces) {

		const movie = await fetch(enlace);
		movieF = movie.json();


		allMovieDetails.push({
			originalTitle: movieF.data['original'],
			title: movieF.data['title'],
			synopsis: movieF.data['synopsis'],
			starred: movieF.data['starred'],
			director: movieF.data['director'],
			posterPhoto: "/" + movieF.data['poster_photo'] + "/",
			trailer: "https://www.youtube.com/watch?v=" + movieF.data.youtube + "/",
		});
	}
	return allMovieDetails;
	// var allMovieDetails = [];

	// for (let enlace of enlaces) {
	// 	const movie = await page.evaluate(async (enlace) => {
	// 		var response = await fetch(enlace);
	// 		var responseJSON = await response.json();
	// 		return responseJSON;
	// 	});
	// 	movieDetails = responseJSON.data['original'];

	// 	allMovieDetails.push(movieDetails);
	// }

}

module.exports = {
	getPageTitle,
	getLinks,
	getMovieDetails,
};
