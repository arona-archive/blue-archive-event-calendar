import { NoticeType } from '../constants/index.js';
import type { NoticeParams } from '../types/index.js';
import { convertDateRange, sanitizeText } from '../utils/index.js';

const convertTitle = (title: string): string => sanitizeText(title.replace('紹介', ''), true);

export const createEventNotice = (document: Document): NoticeParams => {
	const elements = Array.from(document.querySelectorAll('p'));

	const getTitle = (): string => {
		const titleEl = elements.find((e) => ['【イベント】', '【復刻イベント】'].some((x) => e.textContent.startsWith(x)));
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
		const index = elements.findIndex((el) => el.textContent.trim().includes('▼開催期間'));
		if (index === -1) {
			throw new Error('cannot find date range element');
		}

		const getDateRangeStr = (): string => {
			const inlineMatch = elements[index]?.textContent.match(/▼開催期間[\s\S]*?(・[\s\S]+?)(?=▼|$)/);
			const inlineStr = inlineMatch?.[1]?.trim();
			if (inlineStr !== undefined && inlineStr !== '') {
				return inlineStr;
			}

			const dateRangeEl = elements.at(index + 1);
			if (dateRangeEl === undefined) {
				throw new Error('cannot find date range element');
			}

			const dateRangeStr = dateRangeEl.textContent.trim();
			if (!dateRangeStr) {
				throw new Error('cannot find date range string');
			}
			return dateRangeStr;
		};

		return convertDateRange(sanitizeText(getDateRangeStr()));
	};
	const [startsAt, endsAt] = getDateRange();

	return {
		type: NoticeType.EVENTS,
		title,
		startsAt,
		endsAt,
	};
};
