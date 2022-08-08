import { createEvents } from './scripts';
import notices from './_data/notices.json';

const main = async () => {
	await createEvents(Object.values(notices).flat());
};

(async () => {
	await main();
})();
