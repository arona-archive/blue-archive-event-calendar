import { NoticeCampaignTable, NoticeCampaignType, NoticeTitlePrefixTable, NoticeType, TITLE_REGEX } from '../constants';
import { NoticeParams } from '../types';
import { convertDateRange, sanitizeText } from '../utils';

const getDateRange = (elements: Element[], index: number): [string, string] => {
	const dateRangeEl = elements[index + 1];
	if (!dateRangeEl) {
		throw new Error('cannot find date range element');
	}

	const dateRangeStr = dateRangeEl.textContent?.trim();
	if (!dateRangeStr) {
		throw new Error('cannot find date range string');
	}

	return convertDateRange(sanitizeText(dateRangeStr));
};

const getCampaignTitle = (type: NoticeCampaignType, multiplier: number): string => {
	return `育成キャンペーン「${type}ドロップ量${multiplier}倍」`;
};

const createCampaignNotice = (elements: Element[], multiplier: number): NoticeParams => {
	const titleEl = elements[0];
	if (!titleEl || !titleEl.textContent) {
		throw new Error(`cannot find title element`);
	}

	const getCampaignType = (title: string): NoticeCampaignType | null => {
		const types = Object.values(NoticeCampaignType);
		for (const type of types) {
			if (title.endsWith(type)) {
				return type;
			}
		}
		return null;
	};
	const campaignType = getCampaignType(titleEl.textContent);
	if (!campaignType) {
		throw new Error(`cannot find campaign type: ${titleEl.textContent}`);
	}

	const index = elements.findIndex((el) => el.textContent?.trim().startsWith('▼開催'));
	const [startsAt, endsAt] = getDateRange(elements, index);

	const title = getCampaignTitle(campaignType, multiplier);

	return {
		subId: NoticeCampaignTable[campaignType],
		type: NoticeType.CAMPAIGNS,
		title,
		startsAt,
		endsAt,
	};
};

const createCampaignNotices = (elements: Element[], multiplier: number): NoticeParams[] => {
	const types = Object.values(NoticeCampaignType);

	let sectionIndex = -1;
	const sections: Element[][] = [];

	while (elements.length > 0) {
		const element = elements.shift();
		if (!element) {
			throw new Error('cannot find element');
		}
		if (!element.textContent) {
			continue;
		}

		const text = sanitizeText(element.textContent);
		if (types.some((x) => text.endsWith(x))) {
			sectionIndex += 1;
			sections[sectionIndex] = [];
		}

		if (sectionIndex !== -1) {
			sections[sectionIndex]?.push(element);
		}
	}

	return sections.map((section) => createCampaignNotice(section, multiplier));
};

const createNotice = (id: number, title: string, elements: Element[]): NoticeParams[] => {
	{
		const index = elements.findIndex((el) => el.textContent?.trim().startsWith('▼実施時間'));
		if (index !== -1) {
			const [startsAt, endsAt] = getDateRange(elements, index);

			return [
				{
					type: NoticeType.MAINTENANCES,
					title: title.replace(/のお知らせ.*/, ''),
					startsAt,
					endsAt,
				},
			];
		}
	}

	{
		const titleEl = elements.find((el) => el.textContent?.match(TITLE_REGEX));
		if (titleEl && titleEl.textContent) {
			const match = titleEl.textContent.match(TITLE_REGEX);
			if (!match || !match[1]) {
				throw new Error(`invalid title: ${titleEl.textContent}`);
			}

			const title = sanitizeText(match[1], true);
			if (title) {
				if (title.includes('ガイドミッション')) {
					return [];
				}
				if (title.includes('ログインボーナス')) {
					return [];
				}
				if (title.includes('「Merry Christmas! アロナの特別プレゼント！」')) {
					return [];
				}
				if (title.includes('募集キャンペーン')) {
					return [];
				}
				if (title.startsWith('各種育成コンテンツ')) {
					return [];

					// const getCampaignMultiplier = (title: string): number | null => {
					// 	if (title.includes('2倍')) {
					// 		return 2;
					// 	}
					// 	if (title.includes('3倍')) {
					// 		return 3;
					// 	}
					// 	return null;
					// };
					// const multiplier = getCampaignMultiplier(title);
					// if (!multiplier) {
					// 	throw new Error(`cannot find campaign multiplier: ${title}`);
					// }

					// return createCampaignNotices(elements, multiplier);
				}
				if (title.includes('【イベント】「？？？」')) {
					return [];
				}
				if (title.includes('シャーレの総決算with連邦生徒会')) {
					return [];
				}

				const getType = (): NoticeType | null => {
					for (const [prefix, type] of NoticeTitlePrefixTable) {
						if (title.startsWith(prefix)) {
							return type;
						}
					}
					return null;
				};
				const type = getType();
				if (!type) {
					throw new Error(`cannot find type: ${title}`);
				}
				if (type === NoticeType.EVENTS) {
					return [];
				}

				const index = elements.findIndex((el) => {
					const text = el.textContent?.trim();
					return text?.startsWith('▼開催') || text?.startsWith('▼第1回開催');
				});
				const [startsAt, endsAt] = getDateRange(elements, index);

				if (id === 384 && type === NoticeType.TOTAL_ASSULTS) {
					return [
						{
							type,
							title: title.replace('？？？', 'クロカゲ'),
							startsAt,
							endsAt,
						},
					];
				}

				return [
					{
						type,
						title,
						startsAt,
						endsAt,
					},
				];
			}
		}
	}

	return [];
};

export const createMaintenanceNotices = (id: number, title: string, document: Document): NoticeParams[] => {
	const elements = Array.from(document.querySelectorAll('body > *'));

	if (elements.length === 0) {
		throw new Error('cannot find elements');
	}

	let sectionIndex = 0;
	const sections: Element[][] = [[]];

	while (elements.length > 0) {
		const element = elements.shift();
		if (!element) {
			throw new Error('cannot find element');
		}

		if (element.tagName === 'HR') {
			sectionIndex += 1;
			sections[sectionIndex] = [];
			continue;
		}

		sections[sectionIndex]?.push(element);
	}

	return sections.flatMap((section) => createNotice(id, title, section));
};
