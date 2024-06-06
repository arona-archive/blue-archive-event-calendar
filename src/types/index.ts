import { NoticeType } from '../constants';

export interface News {
	id: number;
	title: string;
	summary: string;
	content: string;
	typeId: number;
	publishedTime: string;
}

export interface NewsContent {
	key: string;
	value: string;
	bannerUrl: string;
	bannerUrlMobile: string;
	digest: string;
	imgCount: number;
	imgInfo: string[];
	ext_0: string;
	ext_1: string;
	ext_2: string;
	ext_3: string;
	ext_4: string;
	ext_5: string;
	ext_6: string;
	ext_7: string;
	ext_8: string;
	ext_9: string;
}

export interface Notice {
	id: string;
	type: NoticeType;
	title: string;
	startsAt: string;
	endsAt: string;
	url: string;
}

export type NoticeParams = Omit<Notice, 'id' | 'url'> & {
	subId?: number;
};
