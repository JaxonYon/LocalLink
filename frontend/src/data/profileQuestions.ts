// Profile questions and options for onboarding/profile setup
// Each question has a type, label, and options (if applicable)

export interface ProfileQuestion {
	id: string;
	label: string;
	type: 'single-select' | 'multi-select' | 'input' | 'date-range' | 'toggle';
	options?: Array<{ value: string; label: string; subprofiles?: string[] }>;
	allowCustom?: boolean;
	extra?: any;
}

const profileQuestions: ProfileQuestion[] = [
	{
		id: 'companions',
		label: 'Who Are You Traveling With?',
		type: 'single-select',
		options: [
			{ value: 'solo', label: 'Solo' },
			{ value: 'partner', label: 'Partner / Spouse' },
			{ value: 'family', label: 'Family', subprofiles: ['Adults', 'Children', 'Infants'] },
			{ value: 'extended-family', label: 'Extended Family', subprofiles: ['Grandparents', 'Cousins', 'Other'] },
			{ value: 'friends', label: 'Friends / Group' },
		],
	},
	{
		id: 'purpose',
		label: 'What Is The Purpose of Your Visit?',
		type: 'single-select',
		options: [
			{ value: 'leisure', label: 'Leisure' },
			{ value: 'business', label: 'Business' },
			{ value: 'special-occasion', label: 'Special Occasion' },
			{ value: 'adventure', label: 'Adventure / Experience' },
		],
	},
	{
		id: 'budget',
		label: 'What Is Your Approximate Budget For This Trip?',
		type: 'single-select',
		options: [
			{ value: '0-1000', label: '$0 – $1,000' },
			{ value: '1000-5000', label: '$1,000 – $5,000' },
			{ value: '5000-10000', label: '$5,000 – $10,000' },
			{ value: '10000+', label: '$10,000+' },
			{ value: 'custom', label: 'Custom (Enter Amount)' },
		],
		allowCustom: true,
	},
	{
		id: 'budget-allocation',
		label: 'How Would You Like To Allocate Your Budget?',
		type: 'single-select',
		options: [
			{ value: 'luxury', label: 'Luxury: High-end accommodations, private tours, fine dining' },
			{ value: 'mid-range', label: 'Mid-Range: Comfortable mix of luxury and budget options' },
			{ value: 'budget', label: 'Budget-Friendly: Cost-conscious choices, group tours, local experiences' },
		],
	},
	{
		id: 'accommodation',
		label: 'What Type of Accommodation Do You Prefer?',
		type: 'single-select',
		options: [
			{ value: 'hotel', label: 'Hotel' },
			{ value: 'resort', label: 'Resort' },
			{ value: 'airbnb', label: 'Airbnb' },
			{ value: 'hostel', label: 'Hostel' },
			{ value: 'vacation-rental', label: 'Vacation Rental' },
			{ value: 'other', label: 'Other (Enter Option)' },
			{ value: 'no-preference', label: 'No Preference' },
		],
		allowCustom: true,
	},
	{
		id: 'activities',
		label: 'What Type of Activities Are You Interested In?',
		type: 'multi-select',
		options: [
			{ value: 'sightseeing', label: 'Sightseeing' },
			{ value: 'outdoor', label: 'Outdoor Adventures (Hiking, Skiing, Surfing, etc.)' },
			{ value: 'cultural', label: 'Cultural Experiences (Museums, Galleries, Theatre)' },
			{ value: 'culinary', label: 'Culinary (Food Tours, Wine Tasting, Cooking Classes)' },
			{ value: 'local', label: 'Local Visits (Markets, Street Tours, Neighborhood Strolls)' },
		],
	},
	{
		id: 'dates',
		label: 'When Do You Plan to Travel?',
		type: 'date-range',
		extra: {
			flexibleToggle: true,
			showWeather: true,
			showTravelCosts: true,
		},
	},
	{
		id: 'experience',
		label: 'What Kind of Experience Are You Looking For?',
		type: 'multi-select',
		options: [
			{ value: 'relaxed', label: 'Relaxed / Chill' },
			{ value: 'active', label: 'Active / Adventure' },
			{ value: 'luxury', label: 'Luxury & Comfort' },
			{ value: 'cultural', label: 'Cultural Immersion' },
			{ value: 'family', label: 'Family-Friendly' },
			{ value: 'solo', label: 'Solo / Introspective Journey' },
		],
	},
	{
		id: 'transport',
		label: 'How Do You Prefer to Get Around?',
		type: 'multi-select',
		options: [
			{ value: 'rental-car', label: 'Rental Car' },
			{ value: 'public-transit', label: 'Public Transit' },
			{ value: 'rideshare', label: 'Rideshare (Uber, Lyft, etc.)' },
			{ value: 'walking', label: 'Walking / Biking' },
			{ value: 'flights-trains', label: 'Short Flights or Trains' },
		],
	},
	{
		id: 'priority',
		label: 'What’s Most Important to You When Traveling?',
		type: 'single-select',
		options: [
			{ value: 'comfort', label: 'Comfort' },
			{ value: 'authenticity', label: 'Authenticity' },
			{ value: 'adventure', label: 'Adventure' },
			{ value: 'affordability', label: 'Affordability' },
			{ value: 'convenience', label: 'Convenience' },
		],
	},
	{
		id: 'pace',
		label: 'What Pace Do You Want Your Trip To Be?',
		type: 'single-select',
		options: [
			{ value: 'fast', label: 'Fast-paced' },
			{ value: 'medium', label: 'Medium-pace' },
			{ value: 'slow', label: 'Slow-pace' },
			{ value: 'leisurely', label: 'Leisurely & Relaxed' },
			{ value: 'adventurous', label: 'Adventerous & Active' },
		],
	},
	{
		id: 'evenings',
		label: 'How Do You Usually Like to Spend Your Evenings While Traveling?',
		type: 'multi-select',
		options: [
			{ value: 'nightlife', label: 'Nightlife / Bars / Live Music' },
			{ value: 'dining', label: 'Relaxed Dining' },
			{ value: 'entertainment', label: 'Entertainment / Shows' },
			{ value: 'quiet', label: 'Quiet Nights In' },
		],
	},
	{
		id: 'social',
		label: 'Do You Enjoy Meeting New People When You Travel?',
		type: 'single-select',
		options: [
			{ value: 'yes', label: 'Yes, I love social experiences.' },
			{ value: 'sometimes', label: 'Sometimes, depending on the setting' },
			{ value: 'no', label: 'No, I prefer solo exploration.' },
		],
	},
];

export default profileQuestions;
