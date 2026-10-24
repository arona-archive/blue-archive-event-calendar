import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';
import { NoticeType } from '../constants/index.js';
import { createPickUpNotice } from './createPickUpNotice.js';

const createDocument = (html: string): Document => new JSDOM(html).window.document;

describe('createPickUpNotice', () => {
	it('reads the date range from the paragraph after the heading', () => {
		const document = createDocument(
			'<p>ピックアップ募集紹介「A」</p><p>▼実施期間</p><p>2024年9月12日(木)11:00 ~ 2024年9月19日(木)10:59</p>',
		);

		expect(createPickUpNotice(document)).toStrictEqual({
			type: NoticeType.PICK_UPS,
			title: 'ピックアップ募集「A」',
			startsAt: '2024-09-12T11:00',
			endsAt: '2024-09-19T10:59',
		});
	});

	it('reads the date range from the heading paragraph itself', () => {
		const document = createDocument(
			'<p>ピックアップ募集紹介「A」</p><p>▼実施期間：2024年9月12日(木)11:00 ~ 2024年9月19日(木)10:59</p>',
		);

		expect(createPickUpNotice(document)).toStrictEqual({
			type: NoticeType.PICK_UPS,
			title: 'ピックアップ募集「A」',
			startsAt: '2024-09-12T11:00',
			endsAt: '2024-09-19T10:59',
		});
	});

	it('throws when the title paragraph is missing', () => {
		const document = createDocument('<p>▼実施期間</p><p>2024年9月12日(木)11:00 ~ 2024年9月19日(木)10:59</p>');

		expect(() => createPickUpNotice(document)).toThrow('cannot find title element');
	});
});
