import { JSDOM } from 'jsdom';
import { NOTICE_ID_FILTER, NOTICE_TITLE_FILTER } from '../constants';
import { News, Notice } from '../types';
import { convertUrl, getId, sanitizeText } from '../utils';
import { createLiveStreamNotice } from './createLiveStreamNotice';
import { createMaintanenceNotices } from './createMaintanenceNotice';
import { createPickUpNotice } from './createPickUpNotice';

export const createNotices = (news: News): Notice[] => {
	const title = sanitizeText(news.ext1);

	if (NOTICE_ID_FILTER.includes(news.id)) {
		return [];
	}
	if (NOTICE_TITLE_FILTER.some((x) => title.startsWith(x))) {
		return [];
	}

	if (!title) {
		throw new Error('cannot find title');
	}

	console.log('title', news.id, title);

	const content = news.content[0];
	if (!content) {
		throw new Error('cannot find content');
	}

	const document = new JSDOM(content.value).window.document;

	const url = convertUrl(news.id);

	if (title.includes('ピックアップ募集')) {
		const { subId, ...notice } = createPickUpNotice(document);
		return [
			{
				id: getId(notice.type, notice.startsAt, subId),
				...notice,
				url,
			},
		];
	}

	if (title.includes('メンテナンスのお知らせ')) {
		const notices = createMaintanenceNotices(title, document);
		return notices.map(({ subId, ...notice }) => ({
			id: getId(notice.type, notice.startsAt, subId),
			...notice,
			url,
		}));
	}

	if (title.includes('ブルアカらいぶ')) {
		const { subId, ...notice } = createLiveStreamNotice(title, document);
		return [
			{
				id: getId(notice.type, notice.startsAt, subId),
				...notice,
				url,
			},
		];
	}

	throw new Error(`invalid title: ${news.id} ${title}`);
};
