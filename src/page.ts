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
	}

	async close(saveCookies: boolean = false) {
		await this.p.close();
		delete this.b.pages[this.name];
	}

	async createCursor(start?: Vector, setDefaultViewport: boolean = true) {
		const height = await this.p.evaluate('window.innerHeight') as number;
		const width = await this.p.evaluate('window.innerWidth') as number;
		if (!start) {
			start = {
				x: Math.random() > 0.5 ? 0 : width,
				y: Math.random() * height
			};
		}

		this.cursor = createCursor(this.p, start);
	}
}
