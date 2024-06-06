import { request } from 'gaxios';
import { News } from '../types';

export const fetchNews = async () => {
	const res = await request<{ data: { rows: News[] } }>({
		url: process.env.NOTICE_URL,
	});
	return res.data;
};
