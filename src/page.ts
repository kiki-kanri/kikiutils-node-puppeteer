import { createCursor } from 'ghost-cursor';
import { Vector } from 'ghost-cursor/lib/math';
import { Page } from 'puppeteer';

import PuppeteerBrowser from './browser';
import { PuppeteerPage } from './types';

export const newPuppeteerPage = async (browser: PuppeteerBrowser, page: Page) => {
	const funcs = {
		async createCursor(start?: Vector) {
			if (!start) {
				start = {
					x: Math.random() > 0.5 ? 0 : await this.getViewWidth(),
					y: Math.random() * (await this.getViewHeight())
				};
			}

			return createCursor(page, start);
		},
		async getViewHeight() {
			return page.viewport()?.height || ((await page.evaluate('window.innerHeight')) as number);
		},
		async getViewWidth() {
			return page.viewport()?.width || ((await page.evaluate('window.innerWidth')) as number);
		}
	};

	const puppeteerPage = page as PuppeteerPage;
	puppeteerPage.b = browser;
	puppeteerPage.cursor = await funcs.createCursor();
	Object.assign(puppeteerPage, funcs);
	return puppeteerPage;
};
