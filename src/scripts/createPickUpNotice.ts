import { NoticeType } from '../constants';
import { NoticeParams } from '../types';
import { convertDateRange, sanitizeText } from '../utils';

const convertTitle = (title: string): string => {
	return sanitizeText(title.replace('ピックアップ募集紹介', 'ピックアップ募集'), true);
};

export const createPickUpNotice = (document: Document): NoticeParams => {
	const elements = Array.from(document.querySelectorAll('body > p'));

	const getTitle = (): string => {
		const titleEl = elements[1];
		if (!titleEl) {
			throw new Error('cannot find title element');
		}

		const title = titleEl.textContent;
		if (!title) {
			throw new Error('cannot find title');
		}

		return convertTitle(title);
	};
	const title = getTitle();

	const getDateRange = (): [string, string] => {
		const index = elements.findIndex((el) => el.textContent?.trim().startsWith('▼実施'));
		const dateRangeEl = elements[index + 1];
		if (!dateRangeEl) {
			throw new Error('cannot find date range element');
		}

		const dateRangeStr = dateRangeEl.textContent?.trim();
		if (!dateRangeStr) {
			throw new Error('cannot find date range string');
		}

		return convertDateRange(sanitizeText(dateRangeStr));
	};
	const [startsAt, endsAt] = getDateRange();

	return {
		type: NoticeType.PICK_UPS,
		title,
		startsAt,
		endsAt,
	};
};
