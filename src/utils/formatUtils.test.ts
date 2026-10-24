import { describe, expect, it } from 'vitest';
import { NoticeType } from '../constants/index.js';
import { convertDateRange, convertUrl, getId, sanitizeText } from './formatUtils.js';

describe('sanitizeText', () => {
	it('normalizes wave dashes, spaces and colons in body text', () => {
		expect(sanitizeText(' 〜A　B、 C  D：E ')).toBe('~A B、C D:E');
	});

	it('keeps full-width tildes and colons in titles', () => {
		expect(sanitizeText('A～B：C', true)).toBe('A～B：C');
	});
});

describe('getId', () => {
	it('builds an id from the type, the start date and the sub id', () => {
		expect(getId(NoticeType.EVENTS, '2024-09-12T11:00')).toBe('10324091201');
		expect(getId(NoticeType.EVENTS, '2024-09-12T11:00', 2)).toBe('10324091202');
	});

	it('throws when the start date is empty', () => {
		expect(() => getId(NoticeType.EVENTS, '')).toThrow('invalid starts at: ');
	});
});

describe('convertUrl', () => {
	it('builds the news url from the id', () => {
		expect(convertUrl(1000)).toBe('https://bluearchive.jp/news/newsJump/1000');
	});
});

describe('convertDateRange', () => {
	it('converts a range with full dates on both sides', () => {
		expect(convertDateRange('2024年9月12日(木)11:00 ~ 2024年9月26日(木)10:59')).toStrictEqual([
			'2024-09-12T11:00',
			'2024-09-26T10:59',
		]);
	});

	it('fills the year of the end from the start', () => {
		expect(convertDateRange('2024年9月12日(木)11:00 ~ 9月26日(木)10:59')).toStrictEqual([
			'2024-09-12T11:00',
			'2024-09-26T10:59',
		]);
	});

	it('fills the year and the month of the end from the start', () => {
		expect(convertDateRange('2024年9月12日(木)11:00 ~ 26日(木)10:59')).toStrictEqual([
			'2024-09-12T11:00',
			'2024-09-26T10:59',
		]);
	});

	it('drops an approximate marker from the start time', () => {
		expect(convertDateRange('2024年9月12日(木)11:00前後 ~ 予定')).toStrictEqual([
			'2024-09-12T11:00',
			'2024-09-12T13:00',
		]);
	});

	it('pads a single-digit start hour', () => {
		expect(convertDateRange('2024年9月12日(木)9:00 ~ 2024年9月26日(木)10:59')).toStrictEqual([
			'2024-09-12T09:00',
			'2024-09-26T10:59',
		]);
	});

	it('ends two hours after the start when the end is tentative', () => {
		expect(convertDateRange('2024年9月12日(木)11:00 ~ 予定')).toStrictEqual(['2024-09-12T11:00', '2024-09-12T13:00']);
	});

	it('ends on the start date when only a tentative end time is given', () => {
		expect(convertDateRange('2024年9月12日(木)11:00 ~ 14:00(予定)')).toStrictEqual([
			'2024-09-12T11:00',
			'2024-09-12T14:00',
		]);
	});

	it('ends on the start date when a tentative end time carries full-width parentheses', () => {
		expect(convertDateRange('2024年9月12日(木)11:00 ~ 14:00（予定）')).toStrictEqual([
			'2024-09-12T11:00',
			'2024-09-12T14:00',
		]);
	});

	it('throws when the range has no end', () => {
		expect(() => convertDateRange('2024年9月12日(木)11:00')).toThrow('cannot find ends at string');
	});
});
