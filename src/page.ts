import { Page } from 'puppeteer';

import PuppeteerBrowser from './browser';

export default class PuppeteerBrowserPage {
	b: PuppeteerBrowser;
	cookieFileName: string;
	name: string;
	p: Page;

	constructor(page: Page, cookieFileName: string, name: string, browser: PuppeteerBrowser) {
		this.b = browser;
		this.cookieFileName = cookieFileName;
		this.name = name;
		this.p = page;
	}

	async close(saveCookies: boolean = false) {
		await this.p.close();
		delete this.b.pages[this.name];
	}
}
