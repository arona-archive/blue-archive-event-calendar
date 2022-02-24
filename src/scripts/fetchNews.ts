import axios from 'axios';

export const fetchNews = async () => {
	const res = await axios.request({
		url: process.env.NOTICE_URL,
	});
	return res.data;
};
