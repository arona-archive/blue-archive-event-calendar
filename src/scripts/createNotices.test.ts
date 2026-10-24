import { describe, expect, it, vi } from 'vitest';
import { NoticeType } from '../constants/index.js';
import type { News, NoticeParams } from '../types/index.js';
import { createNotices } from './createNotices.js';

const {
	createEventNotice,
	createLiveEventNotice,
	createLiveStreamNotice,
	createMaintenanceNotices,
	createPickUpNotice,
} = vi.hoisted(() => ({
	createEventNotice: vi.fn<(document: Document) => NoticeParams>(),
	createLiveEventNotice: vi.fn<(id: number) => NoticeParams[]>(),
	createLiveStreamNotice: vi.fn<(title: string, document: Document) => NoticeParams>(),
	createMaintenanceNotices: vi.fn<(id: number, title: string, document: Document) => NoticeParams[]>(),
	createPickUpNotice: vi.fn<(document: Document) => NoticeParams>(),
}));

vi.mock('./createEventNotice.js', () => ({ createEventNotice }));
vi.mock('./createLiveEventNotice.js', () => ({ createLiveEventNotice }));
vi.mock('./createLiveStreamNotice.js', () => ({ createLiveStreamNotice }));
vi.mock('./createMaintenanceNotice.js', () => ({ createMaintenanceNotices }));
vi.mock('./createPickUpNotice.js', () => ({ createPickUpNotice }));

const NEWS_URL = 'https://bluearchive.jp/news/newsJump/1000';

const createNews = (summary: string, overrides: Partial<News> = {}): News => ({
	id: 1000,
	title: summary,
	summary,
	content: '<p>A</p>',
	typeId: 1,
	publishedTime: '2024-09-12T11:00',
	...overrides,
});

describe('createNotices', () => {
	it('skips a news whose id is filtered out', () => {
		expect(createNotices(createNews('ピックアップ募集紹介', { id: 211 }))).toStrictEqual([]);
		expect(createPickUpNotice).not.toHaveBeenCalled();
	});

	it('skips a news whose title is filtered out', () => {
		expect(createNotices(createNews('キャリア決済のお知らせ'))).toStrictEqual([]);
	});

	it('throws when the title is empty', () => {
		expect(() => createNotices(createNews(''))).toThrow('cannot find title');
	});

	it('throws when the content is empty', () => {
		expect(() => createNotices(createNews('ピックアップ募集紹介', { content: '' }))).toThrow('cannot find content');
	});

	it('creates a pick-up notice', () => {
		createPickUpNotice.mockReturnValue({
			subId: 2,
			type: NoticeType.PICK_UPS,
			title: 'A',
			startsAt: '2024-09-12T11:00',
			endsAt: '2024-09-19T10:59',
		});

		expect(createNotices(createNews('ピックアップ募集紹介'))).toStrictEqual([
			{
				id: '10224091202',
				type: NoticeType.PICK_UPS,
				title: 'A',
				startsAt: '2024-09-12T11:00',
				endsAt: '2024-09-19T10:59',
				url: NEWS_URL,
			},
		]);
	});

	it.each(['メンテナンスのお知らせ', '臨時メンテナンス'])('creates maintenance notices from %s', (title) => {
		createMaintenanceNotices.mockReturnValue([
			{
				type: NoticeType.MAINTENANCES,
				title: 'A',
				startsAt: '2024-09-12T11:00',
				endsAt: '2024-09-12T16:00',
			},
			{
				subId: 3,
				type: NoticeType.TOTAL_ASSULTS,
				title: 'B',
				startsAt: '2024-09-17T11:00',
				endsAt: '2024-09-24T03:59',
			},
		]);

		expect(createNotices(createNews(title))).toStrictEqual([
			{
				id: '10124091201',
				type: NoticeType.MAINTENANCES,
				title: 'A',
				startsAt: '2024-09-12T11:00',
				endsAt: '2024-09-12T16:00',
				url: NEWS_URL,
			},
			{
				id: '10424091703',
				type: NoticeType.TOTAL_ASSULTS,
				title: 'B',
				startsAt: '2024-09-17T11:00',
				endsAt: '2024-09-24T03:59',
				url: NEWS_URL,
			},
		]);
		expect(createMaintenanceNotices).toHaveBeenCalledWith(1000, title, expect.anything());
	});

	it('creates an event notice', () => {
		createEventNotice.mockReturnValue({
			type: NoticeType.EVENTS,
			title: 'A',
			startsAt: '2024-09-12T11:00',
			endsAt: '2024-09-26T10:59',
		});

		expect(createNotices(createNews('【イベント】「A」紹介'))).toStrictEqual([
			{
				id: '10324091201',
				type: NoticeType.EVENTS,
				title: 'A',
				startsAt: '2024-09-12T11:00',
				endsAt: '2024-09-26T10:59',
				url: NEWS_URL,
			},
		]);
	});

	it.each(['ブルアカらいぶ！配信決定', '生放送のお知らせ'])('creates a live stream notice from %s', (title) => {
		createLiveStreamNotice.mockReturnValue({
			type: NoticeType.LIVE_STREAMS,
			title: 'A',
			startsAt: '2024-09-12T19:00',
			endsAt: '2024-09-12T20:00',
		});

		expect(createNotices(createNews(title))).toStrictEqual([
			{
				id: '10724091201',
				type: NoticeType.LIVE_STREAMS,
				title: 'A',
				startsAt: '2024-09-12T19:00',
				endsAt: '2024-09-12T20:00',
				url: NEWS_URL,
			},
		]);
		expect(createLiveStreamNotice).toHaveBeenCalledWith(title, expect.anything());
	});

	it('creates live event notices', () => {
		createLiveEventNotice.mockReturnValue([
			{
				type: NoticeType.LIVE_EVENTS,
				title: 'A',
				startsAt: '2024-09-12T09:00',
				endsAt: '2024-09-12T18:00',
			},
			{
				subId: 1,
				type: NoticeType.LIVE_STREAMS,
				title: 'B',
				startsAt: '2024-09-12T10:00',
				endsAt: '2024-09-12T11:00',
			},
		]);

		expect(createNotices(createNews('ブルアカふぇす！開催決定'))).toStrictEqual([
			{
				id: '10824091201',
				type: NoticeType.LIVE_EVENTS,
				title: 'A',
				startsAt: '2024-09-12T09:00',
				endsAt: '2024-09-12T18:00',
				url: NEWS_URL,
			},
			{
				id: '10724091201',
				type: NoticeType.LIVE_STREAMS,
				title: 'B',
				startsAt: '2024-09-12T10:00',
				endsAt: '2024-09-12T11:00',
				url: NEWS_URL,
			},
		]);
		expect(createLiveEventNotice).toHaveBeenCalledWith(1000);
	});

	it('creates the fixed notice for the eliminate raid preview', () => {
		expect(createNotices(createNews('大決戦正式版開催予告'))).toStrictEqual([
			{
				id: '10923081601',
				type: NoticeType.ELIMINATE_RAID,
				title: '大決戦 「屋外戦・ペロロジラ」',
				startsAt: '2023-08-16T19:00',
				endsAt: '2023-08-23T03:59',
				url: 'https://bluearchive.jp/news/newsJump/347',
			},
		]);
	});

	it('throws when the title matches no parser', () => {
		expect(() => createNotices(createNews('A'))).toThrow('invalid title: 1000 A');
	});
});
