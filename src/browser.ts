import { Browser, Page, WaitForOptions } from 'puppeteer';
import { uuid } from 'short-uuid';

import PuppeteerPage from './page';

export default class PuppeteerBrowser {
	b: Browser;
	pages: {
		[name: string]: PuppeteerPage
	};

	constructor(browser: Browser) {
		this.b = browser;
		this.pages = {};
	}

	protected async addPage(page: Page, cookieFileName: string, name: string) {
		const puppeteerPage = new PuppeteerPage(page, cookieFileName, name, this);
		await puppeteerPage.createCursor();
		this.pages[name] = puppeteerPage;
		return puppeteerPage;
	}

	/**
	 * Get unique page name.
	 */
	protected getNewPageName() {
		let name = uuid();
		while (this.pages[name]) name = uuid();
		return name;
	}

	/**
	 * Close the browser.
	 */
	async close(saveCookies: boolean = false) {
		const tasks = Object.values(this.pages).map((page) => page.close(saveCookies));
		await Promise.all(tasks);
		await this.b.close();
	}

	/**
	 * Get page by name.
	 */
	getPage(name: string) {
		return this.pages[name];
	}

	/**
	 * Get page by pages index.
	 */
	async getPageByIndex(index: number, cookieFileName: string = '') {
		const page = (await this.b.pages())[index];
		for (const pageName in this.pages) if (this.pages[pageName].p.url() === page.url()) return this.pages[pageName];
		const newPageName = this.getNewPageName();
		return await this.addPage(page, cookieFileName, newPageName);
	}

	/**
	 * Get new page.
	 */
	async newPage(url: string = '', cookieFileName: string = '', name: string = '', gotoOptions: WaitForOptions = {}) {
		if (!name) {
			name = this.getNewPageName();
		} else if (this.pages[name]) {
			throw new Error(`Page name: ${name} already exists!`);
		}

		const page = await this.b.newPage();
		await page.setExtraHTTPHeaders({ 'Accept-Language': 'zh-TW' });
		if (url) await page.goto(url, gotoOptions);
		return await this.addPage(page, cookieFileName, name);
	}
}
