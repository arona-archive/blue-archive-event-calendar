import { createEvents } from './scripts';
import notices from './_data/notices.json';

const main = async () => {
	await createEvents(Object.values(notices).flat());
};

(async () => {
	try {
		await main();
	} catch (error) {
		console.error(error);
	}
})();
