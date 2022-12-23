import { NoticeType } from '../constants';
import { NoticeParams } from '../types';

export const createLiveEventNotice = (id: string): NoticeParams[] => {
	if (id === '276') {
		return [
			{
				type: NoticeType.LIVE_EVENTS,
				title: '「ブルアカふぇす！」',
				startsAt: '2023-01-22T10:00',
				endsAt: '2023-01-22T19:00',
			},
			{
				type: NoticeType.LIVE_STREAMS,
				title: '「ブルアカらいぶ！ ふぁーすとあにばSP！ 直前集会 ぱーと１」',
				startsAt: '2023-01-22T12:00',
				endsAt: '2023-01-22T13:15',
				subId: 1,
			},
			{
				type: NoticeType.LIVE_STREAMS,
				title: '「ブルアカらいぶ！ ふぁーすとあにばSP！ 直前集会 ぱーと２」',
				startsAt: '2023-01-22T14:00',
				endsAt: '2023-01-22T15:00',
				subId: 2,
			},
			{
				type: NoticeType.LIVE_STREAMS,
				title: '「ブルアカらいぶ！ ふぁーすとあにばSP！～ぴーすぴーすでにっ！ですよ、先生！～」',
				startsAt: '2023-01-22T16:00',
				endsAt: '2023-01-22T19:00',
				subId: 3,
			},
		];
	}

	throw new Error('live event is not defined');
};
