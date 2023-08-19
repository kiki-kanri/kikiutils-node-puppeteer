import { Browser, WaitForOptions } from 'puppeteer';

import { newPuppeteerPage } from './page';

export class PuppeteerBrowser {
	b: Browser;

	constructor(browser: Browser) {
		this.b = browser;
	}

	/**
	 * Close the browser.
	 */
	async close() {
		await this.b.close();
	}

	/**
	 * Get new page.
	 */
	async newPage(url: string = '', gotoOptions: WaitForOptions = {}) {
		const page = await this.b.newPage();
		await page.setExtraHTTPHeaders({ 'Accept-Language': 'zh-TW' });
		if (url) await page.goto(url, gotoOptions);
		return await newPuppeteerPage(this, page);
	}
}

export default PuppeteerBrowser;
