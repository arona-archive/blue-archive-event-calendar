import path from 'path';

export const srcPath = path.resolve(__dirname, '..');
export const rootPath = path.resolve(srcPath, '..');
export const dataPath = path.resolve(srcPath, '_data');

export const NOTICE_URL = 'https://bluearchive.jp/news/newsJump';

export const DATE_STR_REGEX = /(\d+)年(\d+)月(\d+)日[\(（].+[\)）](.+)/;
export const TITLE_REGEX = /\（\d+\）(.+)開催/;

export const TIME_THRESHOLD = 7 * 24 * 60 * 60 * 1000; // 7 days

export const NOTICE_TITLE_FILTER: { value: string; position: 'start' | 'end' }[] = [
	{
		value: 'イベント',
		position: 'start',
	},
	{
		value: '【復刻イベント】',
		position: 'start',
	},
	{
		value: 'キャリア決済',
		position: 'start',
	},
	{
		value: '」紹介',
		position: 'end',
	},
];
export const NOTICE_ID_FILTER: string[] = ['211', '231', '243', '276'];

export enum NoticeType {
	MAINTENANCES = 1,
	PICK_UPS,
	EVENTS,
	TOTAL_ASSULTS,
	JOINT_EXCERCISES,
	CAMPAIGNS,
	LIVE_STREAMS,
}

export const NoticeTitlePrefixTable: [string, NoticeType][] = [
	['総力戦', NoticeType.TOTAL_ASSULTS],
	['特殊作戦', NoticeType.EVENTS],
	['「キヴォトス合同火力演習」', NoticeType.JOINT_EXCERCISES],
	['キヴォトス合同火力演習', NoticeType.JOINT_EXCERCISES],
	['イベント', NoticeType.EVENTS],
	['【イベント】', NoticeType.EVENTS],
	['【復刻イベント】', NoticeType.EVENTS],
];

export enum NoticeCampaignType {
	A = '特別依頼',
	B = '指名手配',
	C1 = '任務(Normal)',
	C2 = '任務（Normal）',
	D1 = '任務(Hard)',
	D2 = '任務（Hard）',
	E = '学園交流会',
	F = 'スケジュール',
}

export const NoticeCampaignTable: Record<NoticeCampaignType, number> = {
	[NoticeCampaignType.A]: 1,
	[NoticeCampaignType.B]: 2,
	[NoticeCampaignType.C1]: 3,
	[NoticeCampaignType.C2]: 3,
	[NoticeCampaignType.D1]: 4,
	[NoticeCampaignType.D2]: 4,
	[NoticeCampaignType.E]: 5,
	[NoticeCampaignType.F]: 6,
};
