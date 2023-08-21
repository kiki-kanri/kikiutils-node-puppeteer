import { GhostCursor } from 'ghost-cursor';
import { Vector } from 'ghost-cursor/lib/math';
import { Page, PuppeteerLaunchOptions } from 'puppeteer';

import PuppeteerBrowser from './browser';

export interface ExtraOptions extends PuppeteerLaunchOptions {
	/**
	 * Default browser user agent, set null will not set.
	 * @defaultValue `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36`
	 */
	userAgent?: null | string;
}

export interface PuppeteerPage extends Page {
	b: PuppeteerBrowser;
	cursor: GhostCursor;
	createCursor: (start?: Vector) => Promise<void>;
	getViewHeight: () => Promise<number>;
	getViewWidth: () => Promise<number>;
}
