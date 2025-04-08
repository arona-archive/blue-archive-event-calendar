import { NoticeType } from '../constants';
import { NoticeParams } from '../types';
import { convertDateRange, sanitizeText } from '../utils';

const convertTitle = (title: string): string => {
	return sanitizeText(title.replace('紹介', ''), true);
};

export const createEventNotice = (document: Document): NoticeParams => {
	const elements = Array.from(document.querySelectorAll('p'));

	const getTitle = (): string => {
		const titleEl = elements.find((e) =>
			['【イベント】', '【復刻イベント】'].some((x) => e.textContent?.startsWith(x))
		);
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
		const index = elements.findIndex((el) => el.textContent?.trim().includes('▼開催期間'));
		if (index === -1) {
			throw new Error('cannot find date range element');
		}
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
		type: NoticeType.EVENTS,
		title,
		startsAt,
		endsAt,
	};
};
