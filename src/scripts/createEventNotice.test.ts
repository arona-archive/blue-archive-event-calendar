import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';
import { NoticeType } from '../constants/index.js';
import { createEventNotice } from './createEventNotice.js';

const createDocument = (html: string): Document => new JSDOM(html).window.document;

describe('createEventNotice', () => {
	it('reads the date range from the paragraph after the heading', () => {
		const document = createDocument(
			'<p>【イベント】「A」紹介</p><p>▼開催期間</p><p>2024年9月12日(木)11:00 ～ 2024年9月26日(木)10:59</p>',
		);

		expect(createEventNotice(document)).toStrictEqual({
			type: NoticeType.EVENTS,
			title: '【イベント】「A」',
			startsAt: '2024-09-12T11:00',
			endsAt: '2024-09-26T10:59',
		});
	});

	it('reads the date range from the same paragraph as the heading', () => {
		const document = createDocument(
			'<p>【復刻イベント】「A」紹介</p><p>▼開催期間<br>・2024年9月12日(木)11:00 ~ 2024年9月26日(木)10:59</p>',
		);

		expect(createEventNotice(document)).toStrictEqual({
			type: NoticeType.EVENTS,
			title: '【復刻イベント】「A」',
			startsAt: '2024-09-12T11:00',
			endsAt: '2024-09-26T10:59',
		});
	});

	it('throws when the title paragraph is missing', () => {
		const document = createDocument('<p>▼開催期間</p><p>2024年9月12日(木)11:00 ~ 2024年9月26日(木)10:59</p>');

		expect(() => createEventNotice(document)).toThrow('cannot find title element');
	});

	it('throws when the date range heading is missing', () => {
		const document = createDocument('<p>【イベント】「A」紹介</p>');

		expect(() => createEventNotice(document)).toThrow('cannot find date range element');
	});
});
