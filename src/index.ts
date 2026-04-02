import notices from './_data/notices.json' with { type: 'json' };
import { createEvents } from './scripts/index.js';

const main = async () => {
	await createEvents(Object.values(notices).flat());
};

void (async () => {
	await main();
})();
