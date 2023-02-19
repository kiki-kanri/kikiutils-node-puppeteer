import { ElementHandle, Page } from 'puppeteer';

export const getElementAttribute = async (element: ElementHandle, attributeName: string) => {
	return await (await element?.getProperty(attributeName)).jsonValue() as string;
}

export const getSelectorAttribute = async (
	el: ElementHandle | Page,
	selector: string,
	attributeName: string
) => {
	const element = await el.$(selector);
	if (!element) return undefined;
	return await getElementAttribute(element, attributeName);
}
