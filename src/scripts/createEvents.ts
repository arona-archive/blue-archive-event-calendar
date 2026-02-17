import { sleep } from '@sapphire-sh/utils';
import GoogleApis, { google } from 'googleapis';
import { TIME_THRESHOLD } from '../constants';
import { Notice } from '../types';
import { authorize } from '../utils';

type Calendar = GoogleApis.calendar_v3.Calendar;
type CalendarEvent = GoogleApis.calendar_v3.Schema$Event;

const areCalendarEventsEqual = (p: CalendarEvent, q: CalendarEvent): boolean => {
	if (p.id !== q.id) {
		throw new Error(`invalid calendar events compare: ${p.id}, ${q.id}`);
	}

	let areEqual = true;

	if (q.status === 'cancelled') {
		console.log('cancelled');
		areEqual = false;
	}

	if (p.summary !== q.summary) {
		console.log('summary', p.summary, q.summary);
		areEqual = false;
	}
	if (p.description !== q.description) {
		console.log('description', p.description, q.description);
		areEqual = false;
	}
	if (p.start?.dateTime !== q.start?.dateTime) {
		console.log('start.dateTime', p.start?.dateTime, q.start?.dateTime);
		areEqual = false;
	}
	if (p.end?.dateTime !== q.end?.dateTime) {
		console.log('end.dateTime', p.end?.dateTime, q.end?.dateTime);
		areEqual = false;
	}

	return areEqual;
};

const getEvent = async (calendar: GoogleApis.calendar_v3.Calendar, eventId: string): Promise<CalendarEvent | null> => {
	try {
		const res = await calendar.events.get({
			calendarId: process.env.GOOGLE_CALENDAR_ID,
			eventId,
		});
		return res.data;
	} catch (error) {
		if ((error as any).code === 404) {
			return null;
		}
		throw error;
	}
};

const createEvent = async (calendar: Calendar, eventId: string, event: CalendarEvent) => {
	console.log('createEvent', event.id);

	const prevEvent = await getEvent(calendar, eventId);
	if (prevEvent) {
		return await updateEvent(calendar, eventId, event);
	}

	await calendar.events.insert({
		calendarId: process.env.GOOGLE_CALENDAR_ID,
		requestBody: event,
	});
};

const updateEvent = async (calendar: Calendar, eventId: string, event: CalendarEvent) => {
	console.log('updateEvent', eventId);

	const prevEvent = await getEvent(calendar, eventId);
	if (!prevEvent) {
		throw new Error(`cannot find prev calendar event: ${eventId}`);
	}

	if (areCalendarEventsEqual(event, prevEvent)) {
		return;
	}

	console.log('update', eventId, event);

	await calendar.events.update({
		calendarId: process.env.GOOGLE_CALENDAR_ID,
		eventId: eventId,
		requestBody: {
			...event,
			status: 'confirmed',
		},
	});
};

const convertCalendarEvent = (notice: Notice): CalendarEvent => {
	return {
		id: notice.id,
		summary: notice.title,
		start: {
			dateTime: `${notice.startsAt}:00+09:00`,
			timeZone: 'Asia/Tokyo',
		},
		end: {
			dateTime: `${notice.endsAt}:00+09:00`,
			timeZone: 'Asia/Tokyo',
		},
		description: notice.url,
	};
};

export const createEvents = async (notices: Notice[]) => {
	console.log('create events');

	const auth = await authorize();
	const calendar = google.calendar({ version: 'v3', auth });

	for (const notice of notices) {
		const endsAt = new Date(`${notice.endsAt}:00+09:00`).getTime();
		const now = Date.now();

		const diff = now - endsAt;
		if (diff > TIME_THRESHOLD) {
			continue;
		}

		const event = convertCalendarEvent(notice);
		await createEvent(calendar, notice.id, event);

		await sleep(100);
	}
};
