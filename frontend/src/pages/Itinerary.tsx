import { ItineraryView } from '@/components/itinerary';
import { Button, Card, Input, Select } from '@/components/ui';
import { api } from '@/lib/api';
import { saveItinerary } from '@/store';
import type { BudgetTier, ItineraryInput, ItineraryPace } from '@/types';
import type { FormEvent } from 'react';
import { useState } from 'react';

// ---------- UI OPTIONS ----------

const interestOptions = [
	{ value: 'culture', label: 'Culture' },
	{ value: 'food', label: 'Food & Drink' },
	{ value: 'outdoors', label: 'Outdoors' },
	{ value: 'wellness', label: 'Wellness' },
	{ value: 'nightlife', label: 'Nightlife' },
	{ value: 'family', label: 'Family-friendly' },
];

const paceOptions: { value: ItineraryPace; label: string }[] = [
	{ value: 'relaxed', label: 'Relaxed' },
	{ value: 'balanced', label: 'Balanced' },
	{ value: 'fast', label: 'Fast' },
];

const budgetOptions: { value: BudgetTier; label: string }[] = [
	{ value: 'low', label: 'Low' },
	{ value: 'medium', label: 'Medium' },
	{ value: 'high', label: 'High' },
];

// ---------- BACKEND RESPONSE TYPES ----------

export type GenerateItineraryRequest = {
	email: string | null;
	place: string;
	start_date: string;
	end_date: string;
	activity_budget: 'low' | 'medium' | 'high';
	travel_vibe: 'relaxed' | 'balanced' | 'fast' | string;
	interested_activities: string[];
	traveling_with: string[];
	group_size: string;
	transportation_options: string[];
};

export type BackendActivity = {
	name: string;
	location: string;
	location_coordinates: string; // "lat,lng"
	description: string;
	time_to_complete_hours: number;
};

export type BackendDay = {
	day_name: string;
	activities: BackendActivity[];
};

export type Trip = {
	place_name: string;
	days: BackendDay[];
};

export type SaveItineraryRequest = {
	email: string;
	itinerary: Trip;
};

// ---------- FRONTEND ITINERARY TYPE (WHAT THE UI USES) ----------

export type ItineraryType = {
	id: string;
	createdAt: string;
	destination: string;
	summary: string;
	days: {
		day: number;
		date: string;
		activities: {
			time: string;
			title: string;
			location: string;
			description: string;
			category: string;
		}[];
	}[];
};

// ---------- HELPERS ----------

export interface ItineraryFormProps {
	onGenerate: (input: ItineraryInput) => Promise<void> | void;
	isSubmitting?: boolean;
}

const formatItineraryForCopy = (itinerary: ItineraryType): string => {
	const lines: string[] = [];
	lines.push(`${itinerary.destination} Itinerary`);
	lines.push(itinerary.summary);
	lines.push('');
	itinerary.days.forEach((day) => {
		lines.push(`Day ${day.day} - ${day.date}`);
		day.activities.forEach((activity) => {
			lines.push(`- ${activity.time} ${activity.title} (${activity.location})`);
		});
		lines.push('');
	});
	return lines.join('\n');
};

const adaptTripToItinerary = (trip: Trip): ItineraryType => ({
	id: crypto.randomUUID(),
	createdAt: new Date().toISOString(),
	destination: trip.place_name ?? 'Unknown destination',
	summary: `Your personalized itinerary for ${trip.place_name ?? 'your trip'}.`,
	days: Array.isArray(trip.days)
		? trip.days.map((day, index) => ({
				day: index + 1,
				date: '',
				activities: Array.isArray(day.activities)
					? day.activities.map((a) => ({
							time: '',
							title: a.name ?? 'Activity',
							location: a.location ?? '',
							description: a.description ?? '',
							category: 'culture',
						}))
					: [],
			}))
		: [],
});

// ---------- COMPONENT ----------

export const Itinerary = (): JSX.Element => {
	const [itinerary, setItinerary] = useState<ItineraryType | null>(null);
	const [isGenerating, setIsGenerating] = useState<boolean>(false);
	const [copyLabel, setCopyLabel] = useState<string>('Copy to clipboard');
	const [saveLabel, setSaveLabel] = useState<string>('Save itinerary');

	const [formData, setFormData] = useState<ItineraryInput>({
		destination: '',
		startDate: '',
		endDate: '',
		interests: [],
		pace: 'balanced',
		budget: 'medium',
		mustSees: '',
	});

	const generate = async (input: ItineraryInput): Promise<Trip> => {
		const email = localStorage.getItem('email') ?? 'test@example.com';

		if (!email) {
			throw new Error('No email found in localStorage');
		}

		const result = await api.generateItinerary({
			email,
			place: input.destination,
			start_date: input.startDate,
			end_date: input.endDate,
			activity_budget: input.budget,
			travel_vibe: input.pace,
			interested_activities: input.interests,
			traveling_with: ['solo'],
			group_size: '1',
			transportation_options: ['walking'],
		});

		return result as Trip;
	};

	const handleGenerate = async (input: ItineraryInput): Promise<void> => {
		setIsGenerating(true);

		try {
			const result = await generate(input);
			console.log('Itinerary generation result:', result);

			if (!result || typeof result !== 'object') {
				console.error('Invalid itinerary response (not an object):', result);
				throw new Error('Invalid itinerary format from backend');
			}

			if (!('place_name' in result) || !('days' in result) || !Array.isArray(result.days)) {
				console.error('Invalid itinerary response shape:', result);
				throw new Error('Invalid itinerary format from backend');
			}

			const adapted = adaptTripToItinerary(result);
			setItinerary(adapted);
		} catch (err) {
			console.error('Generation failed:', err);
		} finally {
			setIsGenerating(false);
			setCopyLabel('Copy to clipboard');
			setSaveLabel('Save itinerary');
		}
	};

	const handleCopy = async (): Promise<void> => {
		if (!itinerary) return;

		const text = formatItineraryForCopy(itinerary);
		if (navigator.clipboard?.writeText) {
			await navigator.clipboard.writeText(text);
			setCopyLabel('Copied');
			setTimeout(() => setCopyLabel('Copy to clipboard'), 2000);
			return;
		}
		setCopyLabel('Copy not supported');
		setTimeout(() => setCopyLabel('Copy to clipboard'), 2000);
	};

	const handleSave = (): void => {
		if (!itinerary) return;
		saveItinerary(itinerary);
		setSaveLabel('Saved');
		setTimeout(() => setSaveLabel('Save itinerary'), 2000);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.currentTarget;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();
		if (isGenerating) return;
		await handleGenerate(formData);
	};

	return (
		<div className='space-y-8'>
			<div>
				<h1 className='text-2xl font-semibold text-text'>AI Trip Itinerary Builder</h1>
				<p className='text-sm text-text-subtle'>Create a tailored plan for your next trip with a guided template.</p>
			</div>
			<Card className='grid gap-8 p-6 lg:grid-cols-[1.1fr_1fr]'>
				<div className='space-y-4'>
					<h2 className='text-lg font-semibold text-text'>Trip details</h2>
					<form onSubmit={handleSubmit} className='itinerary-form'>
						<Input name='destination' value={formData.destination} onChange={handleChange} placeholder='Destination' required />
						<Input name='startDate' type='date' value={formData.startDate} onChange={handleChange} required />
						<Input name='endDate' type='date' value={formData.endDate} onChange={handleChange} required />
						<Select name='interests' options={interestOptions} onChange={handleChange} />
						<Select name='pace' options={paceOptions} onChange={handleChange} />
						<Select name='budget' options={budgetOptions} onChange={handleChange} />
						<Button type='submit' disabled={isGenerating}>
							{isGenerating ? 'Generating…' : 'Generate Itinerary'}
						</Button>
					</form>
				</div>
				<div className='space-y-4'>
					<h2 className='text-lg font-semibold text-text'>Preview</h2>
					{itinerary ? <ItineraryView itinerary={itinerary} onCopy={handleCopy} onSave={handleSave} copyLabel={copyLabel} saveLabel={saveLabel} /> : <p className='text-sm text-text-subtle'>Generate an itinerary to see your plan here.</p>}
				</div>
			</Card>
		</div>
	);
};
