import { createCursor, GhostCursor } from 'ghost-cursor';
import { Vector } from 'ghost-cursor/lib/math';
import { Page } from 'puppeteer';

import PuppeteerBrowser from './browser';

export interface PuppeteerPage extends Page {
	b: PuppeteerBrowser;
	cursor: GhostCursor;
	createCursor: (start?: Vector) => Promise<void>;
	getInnerHeight: () => Promise<number>;
	getInnerWidth: () => Promise<number>;
}

export const newPuppeteerPage = async (browser: PuppeteerBrowser, page: Page) => {
	const funcs = {
		async createCursor(start?: Vector) {
			if (!start) {
				start = {
					x: Math.random() > 0.5 ? 0 : await this.getInnerWidth(),
					y: Math.random() * await this.getInnerHeight()
				};
			}

			return createCursor(page, start);
		},
		async getInnerHeight() {
			return await page.evaluate('window.innerHeight') as number;
		},
		async getInnerWidth() {
			return await page.evaluate('window.innerWidth') as number;
		}
	};

	const puppeteerPage = page as PuppeteerPage;
	puppeteerPage.b = browser;
	puppeteerPage.cursor = await funcs.createCursor();
	Object.assign(puppeteerPage, funcs);
	return puppeteerPage;
}
