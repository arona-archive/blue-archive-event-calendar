import notices from './_data/notices.json';
import { createEvents } from './scripts';

const main = async () => {
	await createEvents(Object.values(notices).flat());
};

(async () => {
	await main();
})();
