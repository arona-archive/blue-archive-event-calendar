import fs from 'fs';
import { dataPath, NoticeType } from './constants';
import { createNotices, fetchNews } from './scripts';
import { News } from './types';
import { exportJson } from './utils';
import notices from './_data/notices.json';

const getNoticeKey = (type: NoticeType): keyof typeof notices => {
	switch (type) {
		case NoticeType.MAINTENANCES: {
			return 'maintenances';
		}
		case NoticeType.PICK_UPS: {
			return 'pickUps';
		}
		case NoticeType.EVENTS: {
			return 'events';
		}
		case NoticeType.TOTAL_ASSULTS: {
			return 'totalAssults';
		}
		case NoticeType.JOINT_EXCERCISES: {
			return 'jointExcercises';
		}
		case NoticeType.CAMPAIGNS: {
			return 'campaigns';
		}
		case NoticeType.LIVE_STREAMS: {
			return 'liveStreams';
		}
	}
};

const exportNotices = (news: News[]) => {
	for (const notice of news.flatMap((news) => createNotices(news))) {
		const key = getNoticeKey(notice.type);

		const index = notices[key].findIndex((x) => x.id === notice.id);
		if (index !== -1) {
			notices[key][index] = notice;
		} else {
			notices[key].push(notice);
			notices[key].sort((a, b) => a.id.localeCompare(b.id));
		}
	}

	const { maintenances } = notices;

	for (const notice of Object.values(notices).flat()) {
		if (notice.startsAt.endsWith('メンテナンス後')) {
			const date = notice.startsAt.split('T')[0];
			if (!date) {
				throw new Error(`invalid starts at: ${notice.startsAt}`);
			}

			const getStartsAt = () => {
				const maintenance = maintenances.find((x) => x.startsAt.startsWith(date));
				if (maintenance) {
					return maintenance.endsAt;
				}

				return `${date}T19:00:00`;
			};

			notice.startsAt = getStartsAt();
		}

		if (notice.endsAt.endsWith('メンテナンス前')) {
			const date = notice.endsAt.split('T')[0];
			if (!date) {
				throw new Error(`invalid ends at: ${notice.endsAt}`);
			}

			const maintenance = maintenances.find((x) => x.startsAt.startsWith(date));
			if (maintenance) {
				notice.endsAt = maintenance.startsAt;
			} else {
				const endsAt = new Date(`${notice.endsAt}:00+09:00`).getTime();
				const now = Date.now();

				const diff = now - endsAt;
				if (diff > 0) {
					throw new Error(`cannot find maintenance: ${notice.endsAt}`);
				}

				notice.endsAt = `${date}T11:00`;
			}
		}
	}

	return notices;
};

const main = async () => {
	await fs.promises.mkdir(dataPath, { recursive: true });

	const news = await fetchNews();

	const notices = exportNotices(news.data.items);
	await exportJson(notices, dataPath, 'notices.json');
};

(async () => {
	await main();
})();
