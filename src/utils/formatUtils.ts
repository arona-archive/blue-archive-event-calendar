export const sanitizeText = (text: string, isTitle = false): string => {
	text = text.replaceAll('〜', '~');
	text = text.replaceAll('　', ' ');
	text = text.replaceAll('、 ', '、');
	text = text.replaceAll(/ +/g, ' ');

	if (!isTitle) {
		text = text.replaceAll('～', '~');
		text = text.replaceAll('：', ':');
	}

	text = text.trim();

	return text;
};

import { DATE_STR_REGEX, NOTICE_URL, NoticeType } from '../constants';

export const getId = (type: NoticeType, startsAt: string, subId: number = 1): string => {
	const date = startsAt.split('T')[0]?.replaceAll('-', '').replace(/^20/, '');
	if (!date) {
		throw new Error(`invalid starts at: ${startsAt}`);
	}
	return `10${type}${date}${`${subId}`.padStart(2, '0')}`;
};

export const convertUrl = (id: string): string => {
	return `${NOTICE_URL}/${id}`;
};

const convertDate = (dateStr: string): string | null => {
	const match = dateStr.match(DATE_STR_REGEX);
	if (!match) {
		return null;
	}

	const [, yearStr, monthStr, dayStr, timeStr] = match.map((x) => x.trim());
	if (!yearStr || !monthStr || !dayStr || !timeStr) {
		return null;
	}

	const getDate = () => {
		return `${yearStr}-${monthStr.padStart(2, '0')}-${dayStr.padStart(2, '0')}`;
	};
	const date = getDate();

	const getTime = () => {
		if (timeStr.endsWith('前後')) {
			return timeStr.replace('前後', '');
		}
		return timeStr;
	};
	const time = getTime().padStart(5, '0');

	return `${date}T${time}`;
};

const getTempEndsAt = (startsAt: string): string | null => {
	const [dateStr, timeStr] = startsAt.split('T');
	if (!dateStr || !timeStr) {
		return null;
	}

	const getDate = () => {
		return dateStr;
	};
	const date = getDate();

	const getTime = (): string | null => {
		const [hoursStr, minutesStr] = timeStr.split(':');
		if (!hoursStr || !minutesStr) {
			return null;
		}

		const hours = parseInt(hoursStr, 10);
		if (isNaN(hours)) {
			return null;
		}

		return `${`${hours + 2}`.padStart(2, '0')}:${minutesStr}`;
	};
	const time = getTime();

	return `${date}T${time}`;
};

export const convertDateRange = (dateRangeStr: string): [string, string] => {
	const [startsAtStr, endsAtStr] = dateRangeStr.split('~').map((x) => x.trim());
	if (!startsAtStr) {
		throw new Error('cannot find starts at string');
	}
	if (!endsAtStr) {
		throw new Error('cannot find ends at string');
	}

	const startsAt = convertDate(startsAtStr);
	if (!startsAt) {
		throw new Error(`cannot find starts at: ${startsAtStr}`);
	}

	const getEndsAt = () => {
		if (endsAtStr === '予定') {
			return getTempEndsAt(startsAt);
		}
		if (endsAtStr.endsWith('(予定)')) {
			const date = startsAt.split('T')[0];
			const time = endsAtStr.split('(')[0];
			return `${date}T${time}`;
		}
		return convertDate(endsAtStr);
	};
	const endsAt = getEndsAt();
	if (!endsAt) {
		throw new Error(`cannot find ends at: ${endsAtStr}`);
	}

	return [startsAt, endsAt];
};
