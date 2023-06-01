import { createCursor, GhostCursor } from 'ghost-cursor';
import { Vector } from 'ghost-cursor/lib/math';
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

	createCursor(start?: Vector, setDefaultViewport: boolean = true) {
		let viewport = this.p.viewport();
		if (!viewport && setDefaultViewport) viewport = { height: 1080, width: 1920 };
		if (!start && viewport) {
			start = {
				x: Math.random() * viewport.width,
				y: Math.random() * viewport.height
			};
		}

		this.cursor = createCursor(this.p, start);
	}
}
