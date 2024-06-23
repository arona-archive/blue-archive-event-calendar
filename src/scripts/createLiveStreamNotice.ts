import { DATE_STR_REGEX, NoticeType } from '../constants';
import { NoticeParams } from '../types';
import { convertDateRange, sanitizeText } from '../utils';

const convertTitle = (title: string): string => {
	return title.replace(/、.+$/, '');
};

export const createLiveStreamNotice = (_title: string, document: Document): NoticeParams => {
	const elements = Array.from(document.querySelectorAll('body > p'));

	const getTitle = (title: string): string => {
		const titleEl = elements[1];
		if (!titleEl) {
			throw new Error('cannot find title element');
		}

		// if (title !== titleEl.textContent) {
		// 	throw new Error(`invalid title: ${title}, ${titleEl.textContent}`);
		// }

		return convertTitle(title);
	};
	const title = getTitle(_title);

	const getDateRange = (): [string, string] => {
		const texts = elements.flatMap((element) => element.innerHTML.split('<br>')).map((text) => text.trim());
		const index = texts.findIndex((text) => text.startsWith('▼配信') || text.includes('▼開催'));
		const getDateRangeStr = () => {
			const text = texts[index];
			if (text?.match(DATE_STR_REGEX)) {
				return texts[index];
			}
			return texts[index + 1];
		};
		const dateRangeStr = getDateRangeStr();
		if (!dateRangeStr) {
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
