const puppeteer = require('puppeteer');

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

	await browser.close();

	return enlaces;
}

async function getMovieDetails(url) {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	await page.goto(url);

	  const movieDetails = await page.evaluate(async (url) => {
		const movie = await fetch(url);
		return movie.json();
	  },url);

	await browser.close(); 
	
	objMovieDetails = {
		originalTitle: movieDetails.data['original'],
		title: movieDetails.data['title'],
		synopsis: movieDetails.data['synopsis'],
		starred: movieDetails.data['starred'],
		director: movieDetails.data['director'],
		posterPhoto: movieDetails.data['poster_photo'],
		trailer: "https://youtube.com/watch?v=" + movieDetails.data.youtube
	};

	return objMovieDetails;
}

async function getAllMovieDetails(url){

	enlaces = await getLinks(url);
	var allMovieDetails = [];

	for(let enlace of enlaces){
		var details = await getMovieDetails(enlace);
		allMovieDetails.push(details);
	}

	return allMovieDetails;
}

module.exports = {
	getPageTitle,
	getAllMovieDetails,
};