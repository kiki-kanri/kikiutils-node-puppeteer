import { createCursor, GhostCursor } from 'ghost-cursor';
import { Page } from 'puppeteer';

import PuppeteerBrowser from './browser';

export default class PuppeteerBrowserPage {
	b: PuppeteerBrowser;
	cookieFileName: string;
	cursor!: GhostCursor;
	name: string;
	p: Page;

	constructor(page: Page, cookieFileName: string, name: string, browser: PuppeteerBrowser) {
		this.b = browser;
		this.cookieFileName = cookieFileName;
		this.name = name;
		this.p = page;
		this.createCursor();
	}

	async close(saveCookies: boolean = false) {
		await this.p.close();
		delete this.b.pages[this.name];
	}

	createCursor() {
		this.cursor = createCursor(this.p);
	}
}
