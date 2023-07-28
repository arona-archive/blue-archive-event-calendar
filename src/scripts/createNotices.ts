import { JSDOM } from 'jsdom';
import { NOTICE_ID_FILTER, NOTICE_TITLE_FILTER } from '../constants';
import { News, Notice } from '../types';
import { convertUrl, getId, sanitizeText } from '../utils';
import { createEventNotice } from './createEventNotice';
import { createLiveEventNotice } from './createLiveEventNotice';
import { createLiveStreamNotice } from './createLiveStreamNotice';
import { createMaintanenceNotices } from './createMaintanenceNotice';
import { createPickUpNotice } from './createPickUpNotice';

export const createNotices = (news: News): Notice[] => {
	const title = sanitizeText(news.ext1);

	if (NOTICE_ID_FILTER.includes(news.id)) {
		return [];
	}
	if (NOTICE_TITLE_FILTER.some((x) => (x.position === 'start' ? title.startsWith(x.value) : title.endsWith(x.value)))) {
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

	if (title.includes('イベント】')) {
		const { subId, ...notice } = createEventNotice(document);
		return [
			{
				id: getId(notice.type, notice.startsAt, subId),
				...notice,
				url,
			},
		];
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

	if (title.includes('ブルアカふぇす')) {
		const notices = createLiveEventNotice(news.id);
		return notices.map(({ subId, ...notice }) => ({
			id: getId(notice.type, notice.startsAt, subId),
			...notice,
			url,
		}));
	}

	if (title.includes('大決戦正式版開催予告')) {
		return [
			{
				id: '10923081601',
				type: 9,
				title: '大決戦 「屋外戦・ペロロジラ」',
				startsAt: '2023-08-16T19:00',
				endsAt: '2023-08-23T03:59',
				url: 'https://bluearchive.jp/news/newsJump/347',
			},
		];
	}

	throw new Error(`invalid title: ${news.id} ${title}`);
};
