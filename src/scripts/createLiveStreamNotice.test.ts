import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';
import { NoticeType } from '../constants/index.js';
import { createLiveStreamNotice } from './createLiveStreamNotice.js';

const createDocument = (html: string): Document => new JSDOM(html).window.document;

describe('createLiveStreamNotice', () => {
	it('reads the date range from the line after the heading', () => {
		const document = createDocument('<p>A</p><p>B</p><p>▼配信日時<br>2024年9月12日(木)19:00 ~ 20:00(予定)</p>');

		expect(createLiveStreamNotice('ブルアカらいぶ！「A」、配信決定', document)).toStrictEqual({
			type: NoticeType.LIVE_STREAMS,
			title: 'ブルアカらいぶ！「A」',
			startsAt: '2024-09-12T19:00',
			endsAt: '2024-09-12T20:00',
		});
	});

	it('reads the date range from the heading line itself', () => {
		const document = createDocument('<p>A</p><p>B</p><p>▼開催日時：2024年9月12日(木)19:00 ~ 予定</p>');

		expect(createLiveStreamNotice('ブルアカらいぶ！「A」', document)).toStrictEqual({
			type: NoticeType.LIVE_STREAMS,
			title: 'ブルアカらいぶ！「A」',
			startsAt: '2024-09-12T19:00',
			endsAt: '2024-09-12T21:00',
		});
	});

	it('throws when the second paragraph is missing', () => {
		const document = createDocument('<p>A</p>');

		expect(() => createLiveStreamNotice('ブルアカらいぶ！「A」', document)).toThrow('cannot find title element');
	});
});
