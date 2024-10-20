import { NoticeType } from '../constants';
import { NoticeParams } from '../types';

export const createLiveEventNotice = (id: number): NoticeParams[] => {
	switch (id) {
		case 276: {
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

		case 378: {
			return [
				{
					type: NoticeType.LIVE_EVENTS,
					title: '「ブルアカふぇす！～3きゅーべりーまっち、先生♪～」',
					startsAt: '2024-01-20T09:00',
					endsAt: '2024-01-20T18:00',
				},
				{
					type: NoticeType.LIVE_STREAMS,
					title: '「ブルアカふぇす！すたーと！」',
					startsAt: '2024-01-20T10:00',
					endsAt: '2024-01-20T11:00',
					subId: 1,
				},
				{
					type: NoticeType.LIVE_STREAMS,
					title: '「みんなで振り返ろう！ブルアカすとーりー！」',
					startsAt: '2024-01-20T11:30',
					endsAt: '2024-01-20T13:00',
					subId: 2,
				},
				{
					type: NoticeType.LIVE_STREAMS,
					title: '「ブルアカふぇす！スペシャルDJステージ！Day1」',
					startsAt: '2024-01-20T13:45',
					endsAt: '2024-01-20T15:15',
					subId: 3,
				},
				{
					type: NoticeType.LIVE_STREAMS,
					title: '「ブルアカらいぶ！さーどあにばSP！Day1」',
					startsAt: '2024-01-20T16:00',
					endsAt: '2024-01-20T18:00',
					subId: 4,
				},
				{
					type: NoticeType.LIVE_EVENTS,
					title: '「ブルアカふぇす！～3きゅーべりーまっち、先生♪～」',
					startsAt: '2024-01-21T09:00',
					endsAt: '2024-01-21T18:00',
				},
				{
					type: NoticeType.LIVE_STREAMS,
					title: '「計算通り完璧ー♪数字から見るブルーアーカイブ！」',
					startsAt: '2024-01-21T10:00',
					endsAt: '2024-01-21T11:30',
					subId: 1,
				},
				{
					type: NoticeType.LIVE_STREAMS,
					title: '「先生、僕たちにもお時間いただけますか？＆ブルアカ開発潜入レポート！」',
					startsAt: '2024-01-21T11:50',
					endsAt: '2024-01-21T13:00',
					subId: 2,
				},
				{
					type: NoticeType.LIVE_STREAMS,
					title: '「ブルアカふぇす！スペシャルDJステージ！Day2」',
					startsAt: '2024-01-21T13:45',
					endsAt: '2024-01-21T15:15',
					subId: 3,
				},
				{
					type: NoticeType.LIVE_STREAMS,
					title: '「ブルアカらいぶ！さーどあにばSP！Day2」',
					startsAt: '2024-01-21T16:00',
					endsAt: '2024-01-21T18:00',
					subId: 4,
				},
			];
		}

		case 495: {
			return [
				{
					type: NoticeType.LIVE_EVENTS,
					title: '「ブルアカふぇす！～4えばーちゃれんじ♪～」',
					startsAt: '2025-01-17T09:00',
					endsAt: '2025-01-17T18:00',
				},
				{
					type: NoticeType.LIVE_STREAMS,
					title: '「ブルアカふぇす！すたーと！」',
					startsAt: '2025-01-17T10:00',
					endsAt: '2025-01-17T11:15',
					subId: 1,
				},
				{
					type: NoticeType.LIVE_STREAMS,
					title: '「みんなで振り返ろう！ブルアカひすとりー！」',
					startsAt: '2025-01-17T11:45',
					endsAt: '2025-01-17T14:00',
					subId: 2,
				},
				{
					type: NoticeType.LIVE_STREAMS,
					title: '「ブルアカふぇす！スペシャルDJステージ！Day1」',
					startsAt: '2025-01-17T15:00',
					endsAt: '2025-01-17T18:00',
					subId: 3,
				},
				{
					type: NoticeType.LIVE_EVENTS,
					title: '「ブルアカふぇす！～4えばーちゃれんじ♪～」',
					startsAt: '2025-01-18T09:00',
					endsAt: '2025-01-18T18:00',
				},
				{
					type: NoticeType.LIVE_STREAMS,
					title: '「先生、僕たちにもお時間いただけますか？2025」',
					startsAt: '2025-01-18T10:00',
					endsAt: '2025-01-18T12:00',
					subId: 1,
				},
				{
					type: NoticeType.LIVE_STREAMS,
					title: '「ブルアカふぇす！スペシャルDJステージ！Day2」',
					startsAt: '2025-01-18T13:00',
					endsAt: '2025-01-18T14:30',
					subId: 2,
				},
				{
					type: NoticeType.LIVE_STREAMS,
					title: '「ブルアカらいぶ！ふぉーすあにばSP！Part1」',
					startsAt: '2025-01-18T15:30',
					endsAt: '2025-01-18T18:00',
					subId: 3,
				},
				{
					type: NoticeType.LIVE_EVENTS,
					title: '「ブルアカふぇす！～4えばーちゃれんじ♪～」',
					startsAt: '2025-01-19T09:00',
					endsAt: '2025-01-19T18:00',
				},
				{
					type: NoticeType.LIVE_STREAMS,
					title: '「計算通り完璧ー♪数字から見るブルーアーカイブ！」',
					startsAt: '2025-01-19T10:00',
					endsAt: '2025-01-19T12:00',
					subId: 1,
				},
				{
					type: NoticeType.LIVE_STREAMS,
					title: '「ブルアカふぇす！スペシャルDJステージ！Day3」',
					startsAt: '2025-01-19T12:45',
					endsAt: '2025-01-19T14:15',
					subId: 2,
				},
				{
					type: NoticeType.LIVE_STREAMS,
					title: '「ブルアカらいぶ！ふぉーすあにばSP！Part2」',
					startsAt: '2025-01-19T15:00',
					endsAt: '2025-01-19T18:00',
					subId: 3,
				},
			];
		}
	}

	throw new Error('live event is not defined');
};
