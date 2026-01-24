import type { Itinerary, ItineraryActivity, ItineraryInput } from '@/types';

const activityCatalog: ItineraryActivity[] = [
	{
		time: '09:00',
		title: 'Neighborhood Orientation Walk',
		description: 'Start with a guided walk and local history highlights.',
		location: 'City center',
		category: 'culture'
	},
	{
		time: '11:30',
		title: 'Market Tasting Stops',
		description: 'Sample regional favorites from trusted vendors.',
		location: 'Central market',
		category: 'food'
	},
	{
		time: '14:00',
		title: 'Panoramic Viewpoint',
		description: 'A relaxed stop for photos and skyline context.',
		location: 'Scenic lookout',
		category: 'outdoors'
	},
	{
		time: '16:30',
		title: 'Hands-on Creative Workshop',
		description: 'Meet local makers and try a short craft session.',
		location: 'Studio district',
		category: 'culture'
	},
	{
		time: '19:00',
		title: 'Evening Food Trail',
		description: 'A curated route through signature dishes.',
		location: 'Old town',
		category: 'food'
	},
	{
		time: '08:00',
		title: 'Sunrise Stretch & Coffee',
		description: 'Light movement and a slow coffee stop to start the day.',
		location: 'Riverside',
		category: 'wellness'
	}
];

const toDate = (value: string): Date => {
	const parsed = new Date(value);
	return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

const formatDate = (date: Date): string => date.toISOString().slice(0, 10);

const buildDateRange = (startDate: string, endDate: string): string[] => {
	const start = toDate(startDate);
	const end = toDate(endDate);
	const normalizedEnd = end < start ? start : end;
	const diffMs = normalizedEnd.getTime() - start.getTime();
	const diffDays = Math.max(0, Math.floor(diffMs / 86400000));
	const totalDays = diffDays + 1;
	return Array.from({ length: totalDays }, (_, index) => {
		const next = new Date(start);
		next.setDate(start.getDate() + index);
		return formatDate(next);
	});
};

const createItineraryId = (destination: string, startDate: string): string => {
	const slug = destination
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');
	const normalizedDate = startDate.replace(/-/g, '');
	return `itin-${slug || 'trip'}-${normalizedDate}`;
};

const buildActivitiesForDay = (
	dayIndex: number,
	interests: string[],
	mustSees: string[]
): ItineraryActivity[] => {
	const baseActivities = activityCatalog.filter((activity) => {
		return interests.length === 0 || interests.includes(activity.category);
	});
	const activityPool = baseActivities.length > 0 ? baseActivities : activityCatalog;
	const picks = activityPool.slice(dayIndex, dayIndex + 3);
	const activities = picks.length > 0 ? picks : activityPool.slice(0, 3);

	if (mustSees[dayIndex]) {
		activities.splice(1, 0, {
			time: '13:30',
			title: `Must-see: ${mustSees[dayIndex]}`,
			description: 'A focused stop to match your priority list.',
			location: 'Recommended stop',
			category: 'custom'
		});
	}

	return activities;
};

export const generateItinerary = async (input: ItineraryInput): Promise<Itinerary> => {
	// TODO: Replace with API call when backend is ready.
	const dates = buildDateRange(input.startDate, input.endDate);
	const interests = input.interests.length > 0 ? input.interests : ['culture', 'food', 'outdoors'];
	const mustSees = input.mustSees
		.split(',')
		.map((item) => item.trim())
		.filter((item) => item.length > 0);

	const days = dates.map((date, index) => ({
		day: index + 1,
		date,
		activities: buildActivitiesForDay(index, interests, mustSees)
	}));

	const summary = `A ${input.pace} itinerary for ${input.destination} focused on ${
		interests.length > 2 ? `${interests[0]}, ${interests[1]}, and ${interests[2]}` : interests.join(' and ')
	}.`;

	return Promise.resolve({
		id: createItineraryId(input.destination, dates[0] ?? formatDate(new Date())),
		destination: input.destination,
		createdAt: dates[0] ?? formatDate(new Date()),
		summary,
		days
	});
};
