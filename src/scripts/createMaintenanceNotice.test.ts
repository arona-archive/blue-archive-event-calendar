import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';
import { NoticeType } from '../constants/index.js';
import { createMaintenanceNotices } from './createMaintenanceNotice.js';

const createDocument = (html: string): Document => new JSDOM(html).window.document;

describe('createMaintenanceNotices', () => {
	it('creates a maintenance notice from the maintenance time section', () => {
		const document = createDocument(
			'<p>メンテナンス</p><p>▼実施時間</p><p>2024年9月12日(木)11:00 ~ 2024年9月12日(木)16:00</p>',
		);

		expect(createMaintenanceNotices(1000, 'メンテナンスのお知らせ(9/12)', document)).toStrictEqual([
			{
				type: NoticeType.MAINTENANCES,
				title: 'メンテナンス',
				startsAt: '2024-09-12T11:00',
				endsAt: '2024-09-12T16:00',
			},
		]);
	});

	it('creates a notice per section split by horizontal rules', () => {
		const document = createDocument(
			[
				'<p>メンテナンス</p><p>▼実施時間</p><p>2024年9月12日(木)11:00 ~ 2024年9月12日(木)16:00</p>',
				'<hr>',
				'<p>(1)総力戦「A」開催</p><p>▼開催期間</p><p>2024年9月17日(火)11:00 ~ 2024年9月24日(火)03:59</p>',
			].join(''),
		);

		expect(createMaintenanceNotices(1000, 'メンテナンスのお知らせ', document)).toStrictEqual([
			{
				type: NoticeType.MAINTENANCES,
				title: 'メンテナンス',
				startsAt: '2024-09-12T11:00',
				endsAt: '2024-09-12T16:00',
			},
			{
				type: NoticeType.TOTAL_ASSULTS,
				title: '総力戦「A」',
				startsAt: '2024-09-17T11:00',
				endsAt: '2024-09-24T03:59',
			},
		]);
	});

	it('skips a section whose title is filtered out', () => {
		const document = createDocument(
			'<p>(1)ログインボーナス開催</p><p>▼開催期間</p><p>2024年9月12日(木)04:00 ~ 2024年9月26日(木)03:59</p>',
		);

		expect(createMaintenanceNotices(1000, 'メンテナンスのお知らせ', document)).toStrictEqual([]);
	});

	it('skips a section whose title is an event', () => {
		const document = createDocument(
			'<p>(1)【イベント】「A」開催</p><p>▼開催期間</p><p>2024年9月12日(木)11:00 ~ 2024年9月26日(木)10:59</p>',
		);

		expect(createMaintenanceNotices(1000, 'メンテナンスのお知らせ', document)).toStrictEqual([]);
	});

	it('creates a pick-up notice from a recollect section', () => {
		const document = createDocument(
			[
				'<p>(1)リコレクト募集開催</p>',
				'<p>▼開催期間</p><p>2024年9月12日(木)11:00 ~ 2024年9月19日(木)10:59</p>',
				'<p>▼選択募集対象</p><p>★3「A」</p><p>★3「B」</p>',
			].join(''),
		);

		expect(createMaintenanceNotices(1000, 'メンテナンスのお知らせ', document)).toStrictEqual([
			{
				type: NoticeType.PICK_UPS,
				title: 'リコレクト募集：★3「A」、★3「B」',
				startsAt: '2024-09-12T11:00',
				endsAt: '2024-09-19T10:59',
			},
		]);
	});

	it('creates a pick-up notice from an encore section', () => {
		const document = createDocument(
			'<p>(1)アンコール募集開催</p><p>▼開催期間</p><p>2024年9月12日(木)11:00 ~ 2024年9月19日(木)10:59</p>',
		);

		expect(createMaintenanceNotices(1000, 'メンテナンスのお知らせ', document)).toStrictEqual([
			{
				type: NoticeType.PICK_UPS,
				title: 'アンコール募集',
				startsAt: '2024-09-12T11:00',
				endsAt: '2024-09-19T10:59',
			},
		]);
	});

	it('creates a virtual aptitude test notice from a section whose title ends with New', () => {
		const document = createDocument(
			'<p>(1)新規戦闘コンテンツ「仮想適性試験BETA」New</p><p>▼開催期間</p><p>2026年10月28日(水)11:00 ~ 2026年12月23日(水)10:59</p>',
		);

		expect(createMaintenanceNotices(1000, 'メンテナンスのお知らせ', document)).toStrictEqual([
			{
				type: NoticeType.VIRTUAL_APTITUDE_TEST,
				title: '新規戦闘コンテンツ「仮想適性試験BETA」',
				startsAt: '2026-10-28T11:00',
				endsAt: '2026-12-23T10:59',
			},
		]);
	});

	it('throws when the title matches no type prefix', () => {
		const document = createDocument(
			'<p>(1)A開催</p><p>▼開催期間</p><p>2024年9月12日(木)11:00 ~ 2024年9月19日(木)10:59</p>',
		);

		expect(() => createMaintenanceNotices(1000, 'メンテナンスのお知らせ', document)).toThrow('cannot find type: A');
	});

	it('throws when the body is empty', () => {
		const document = createDocument('');

		expect(() => createMaintenanceNotices(1000, 'メンテナンスのお知らせ', document)).toThrow('cannot find elements');
	});
});
