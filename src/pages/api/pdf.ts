// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import puppeteer from 'puppeteer-core'

const saveAsPdf = async (url: string) => {
	 const browser = await puppeteer.connect({
    browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BLESS_TOKEN}`,
  })
	const page = await browser.newPage();

	await page.goto(url, {
		waitUntil: 'networkidle0'
	});

	const result = await page.pdf({
		format: 'a4',
		printBackground: true,
		scale: 1.3,
	});
	await browser.close();

	return result;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { url } = req.query; // pass the page to create PDF from as param

	res.setHeader(
		'Content-Disposition',
		`attachment; filename="file.pdf"`
	);
	res.setHeader('Content-Type', 'application/pdf');

	const pdf = await saveAsPdf(url as string);

	return res.send(pdf);
};
