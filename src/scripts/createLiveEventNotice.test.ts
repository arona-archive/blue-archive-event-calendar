import { describe, expect, it } from 'vitest';
import { NoticeType } from '../constants/index.js';
import { createLiveEventNotice } from './createLiveEventNotice.js';

describe('createLiveEventNotice', () => {
	it('returns the live event followed by its live streams', () => {
		expect(createLiveEventNotice(276).map(({ type, subId }) => ({ type, subId }))).toStrictEqual([
			{ type: NoticeType.LIVE_EVENTS, subId: undefined },
			{ type: NoticeType.LIVE_STREAMS, subId: 1 },
			{ type: NoticeType.LIVE_STREAMS, subId: 2 },
			{ type: NoticeType.LIVE_STREAMS, subId: 3 },
		]);
	});

	it('throws for an id with no live event', () => {
		expect(() => createLiveEventNotice(1000)).toThrow('live event is not defined');
	});
});
