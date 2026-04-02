import { DATE_STR_REGEX, NoticeType } from '../constants/index.js';
import type { NoticeParams } from '../types/index.js';
import { convertDateRange, sanitizeText } from '../utils/index.js';

const convertTitle = (title: string): string => title.replace(/、.+$/, '');

export const createLiveStreamNotice = (_title: string, document: Document): NoticeParams => {
	const elements = Array.from(document.querySelectorAll('body > p'));

	const getTitle = (title: string): string => {
		const titleEl = elements.at(1);
		if (titleEl === undefined) {
			throw new Error('cannot find title element');
		}

		// if (title !== titleEl.textContent) {
		// 	throw new Error(`invalid title: ${title}, ${titleEl.textContent}`);
		// }

		return convertTitle(title);
	};
	const title = getTitle(_title);

	const getDateRange = (): [string, string] => {
		const texts = elements.flatMap((element) => element.innerHTML.split('<br>')).map((t) => t.trim());
		const index = texts.findIndex((t) => t.startsWith('▼配信') || t.includes('▼開催'));
		const getDateRangeStr = () => {
			const text = texts.at(index);
			if (text !== undefined && DATE_STR_REGEX.test(text)) {
				return text;
			}
			return texts.at(index + 1);
		};
		const dateRangeStr = getDateRangeStr();
		if (dateRangeStr === undefined || dateRangeStr === '') {
			throw new Error('cannot find date range string');
		}

		return convertDateRange(sanitizeText(dateRangeStr));
	};
	const [startsAt, endsAt] = getDateRange();

	return {
		type: NoticeType.LIVE_STREAMS,
		title,
		startsAt,
		endsAt,
	};
};
