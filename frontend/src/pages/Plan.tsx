import { Container } from '@/components/layout';
import { SectionHero } from '@/components/section-hero';
import { Button, Card, Input, Select } from '@/components/ui';
import { api } from '@/lib/api';
import { useUser } from '@clerk/clerk-react';
import { Calendar, MapPin, Sparkles, Users, Wallet } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';

// ---------- BACKEND TYPES (matching schemas/itinerary.py) ----------

export type Activity = {
	name: string;
	location: string;
	location_coordinates: string;
	description: string;
	time_to_complete_hours: number;
};

export type Day = {
	day_name: string;
	activities: Activity[];
};

export type Trip = {
	place_name: string;
	days: Day[];
};

export type TripRequest = {
	email: string;
	place: string;
	start_date: string;
	end_date: string;
	activity_budget: 'low' | 'medium' | 'high';
	travel_vibe: 'relaxed' | 'balanced' | 'fast';
	interested_activities: string[];
	traveling_with: string[];
	group_size: string;
	transportation_options: string[];
};

// ---------- FORM OPTIONS ----------

const activityOptions = [
	{ value: 'culture', label: '🏛️ Culture & History' },
	{ value: 'food', label: '🍽️ Food & Dining' },
	{ value: 'outdoors', label: '🏞️ Outdoors & Nature' },
	{ value: 'wellness', label: '🧘 Wellness & Spa' },
	{ value: 'nightlife', label: '🌃 Nightlife & Entertainment' },
	{ value: 'shopping', label: '🛍️ Shopping' },
	{ value: 'adventure', label: '🏔️ Adventure Sports' },
	{ value: 'family', label: '👨‍👩‍👧‍👦 Family-friendly' },
];

const vibeOptions = [
	{ value: 'relaxed', label: '🌴 Relaxed (2-3 activities/day)' },
	{ value: 'balanced', label: '⚖️ Balanced (3-4 activities/day)' },
	{ value: 'fast', label: '⚡ Fast-paced (5+ activities/day)' },
];

const budgetOptions = [
	{ value: 'low', label: '💵 Budget-friendly' },
	{ value: 'medium', label: '💰 Moderate' },
	{ value: 'high', label: '💎 Luxury' },
];

const travelingWithOptions = [
	{ value: 'solo', label: '🧳 Solo' },
	{ value: 'partner', label: '💑 Partner' },
	{ value: 'friends', label: '👯 Friends' },
	{ value: 'family', label: '👨‍👩‍👧‍👦 Family' },
];

const groupSizeOptions = [
	{ value: '1', label: '1 person' },
	{ value: '2', label: '2 people' },
	{ value: '3-4', label: '3-4 people' },
	{ value: '5-8', label: '5-8 people' },
	{ value: '9+', label: '9+ people' },
];

const transportOptions = [
	{ value: 'walking', label: '🚶 Walking' },
	{ value: 'public', label: '🚇 Public Transit' },
	{ value: 'taxi', label: '🚕 Taxi/Rideshare' },
	{ value: 'rental', label: '🚗 Rental Car' },
];

// ---------- COMPONENT ----------

export const Plan = (): JSX.Element => {
	const { user } = useUser();
	const [generatedTrip, setGeneratedTrip] = useState<Trip | null>(null);
	const [isGenerating, setIsGenerating] = useState(false);
	const [error, setError] = useState<string>('');

	// Form state matching TripRequest
	const [formData, setFormData] = useState({
		destination: '',
		startDate: '',
		endDate: '',
		budget: 'medium' as 'low' | 'medium' | 'high',
		vibe: 'balanced' as 'relaxed' | 'balanced' | 'fast',
		activities: [] as string[],
		travelingWith: ['solo'] as string[],
		groupSize: '1',
		transport: ['walking', 'public'] as string[],
	});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { name, options } = e.target;
		const selected = Array.from(options)
			.filter((opt) => opt.selected)
			.map((opt) => opt.value);
		setFormData((prev) => ({ ...prev, [name]: selected }));
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError('');
		setIsGenerating(true);

		try {
			// Validate dates
			const start = new Date(formData.startDate);
			const end = new Date(formData.endDate);
			if (end <= start) {
				throw new Error('End date must be after start date');
			}

			// Build request payload
			const payload: TripRequest = {
				email: user?.primaryEmailAddress?.emailAddress || '',
				place: formData.destination,
				start_date: formData.startDate,
				end_date: formData.endDate,
				activity_budget: formData.budget,
				travel_vibe: formData.vibe,
				interested_activities: formData.activities.length > 0 ? formData.activities : ['culture', 'food'],
				traveling_with: formData.travelingWith,
				group_size: formData.groupSize,
				transportation_options: formData.transport,
			};

			console.log('Sending trip request:', payload);

			const result = await api.generateItinerary(payload);

			console.log('Received trip:', result);

			if (!result || !result.place_name || !result.days) {
				throw new Error('Invalid response from server');
			}

			setGeneratedTrip(result);
		} catch (err: unknown) {
			console.error('Generation error:', err);
			const errorMessage = err instanceof Error ? err.message : 'Failed to generate itinerary. Please try again.';
			setError(errorMessage);
		} finally {
			setIsGenerating(false);
		}
	};

	const handleSave = async () => {
		if (!generatedTrip || !user?.primaryEmailAddress?.emailAddress) return;

		try {
			await api.saveItinerary(user.primaryEmailAddress.emailAddress, generatedTrip);
			alert('Itinerary saved successfully!');
		} catch (err) {
			console.error('Save error:', err);
			alert('Failed to save itinerary');
		}
	};

	return (
		<>
			<SectionHero title='AI Trip Planner' subTitle='Share your travel details and let Local Link craft a personalized itinerary.' />
			<div className='bg-surface-subtle'>
				<Container className='py-10'>
					<div className='grid gap-8 lg:grid-cols-2'>
						{/* Form Card */}
						<Card className='h-fit p-8 shadow-xl'>
							<h2 className='mb-6 text-2xl font-semibold text-gray-800 flex items-center gap-2'>
								<MapPin className='h-6 w-6 text-orange-500' />
								Trip Details
							</h2>

							<form onSubmit={handleSubmit} className='space-y-6'>
								{/* Destination */}
								<div>
									<label className='mb-2 block text-sm font-medium text-gray-700'>
										Destination <span className='text-red-500'>*</span>
									</label>
									<Input name='destination' value={formData.destination} onChange={handleInputChange} placeholder='e.g., Tokyo, Japan' required className='text-base' />
								</div>

								{/* Dates */}
								<div className='grid gap-4 md:grid-cols-2'>
									<div>
										<label className='mb-2 text-sm font-medium text-gray-700 flex items-center gap-2'>
											<Calendar className='h-4 w-4 text-orange-500' />
											Start Date <span className='text-red-500'>*</span>
										</label>
										<Input type='date' name='startDate' value={formData.startDate} onChange={handleInputChange} required className='text-base' />
									</div>
									<div>
										<label className='mb-2 text-sm font-medium text-gray-700 flex items-center gap-2'>
											<Calendar className='h-4 w-4 text-orange-500' />
											End Date <span className='text-red-500'>*</span>
										</label>
										<Input type='date' name='endDate' value={formData.endDate} onChange={handleInputChange} required className='text-base' />
									</div>
								</div>

								{/* Activities */}
								<div>
									<label className='mb-2 block text-sm font-medium text-gray-700'>Interested Activities</label>
									<select name='activities' multiple value={formData.activities} onChange={handleMultiSelectChange} className='w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200' style={{ minHeight: '120px' }}>
										{activityOptions.map((opt) => (
											<option key={opt.value} value={opt.value}>
												{opt.label}
											</option>
										))}
									</select>
									<p className='mt-1 text-xs text-gray-500'>Hold Cmd/Ctrl to select multiple</p>
								</div>

								{/* Travel Vibe */}
								<div>
									<label className='mb-2 block text-sm font-medium text-gray-700'>Travel Pace</label>
									<Select name='vibe' value={formData.vibe} onChange={handleSelectChange} options={vibeOptions} />
								</div>

								{/* Budget */}
								<div>
									<label className='mb-2 text-sm font-medium text-gray-700 flex items-center gap-2'>
										<Wallet className='h-4 w-4 text-orange-500' />
										Budget Level
									</label>
									<Select name='budget' value={formData.budget} onChange={handleSelectChange} options={budgetOptions} />
								</div>

								{/* Traveling With */}
								<div className='grid gap-4 md:grid-cols-2'>
									<div>
										<label className='mb-2 text-sm font-medium text-gray-700 flex items-center gap-2'>
											<Users className='h-4 w-4 text-orange-500' />
											Traveling With
										</label>
										<Select name='travelingWith' value={formData.travelingWith[0]} onChange={(e) => setFormData((prev) => ({ ...prev, travelingWith: [e.target.value] }))} options={travelingWithOptions} />
									</div>
									<div>
										<label className='mb-2 block text-sm font-medium text-gray-700'>Group Size</label>
										<Select name='groupSize' value={formData.groupSize} onChange={handleSelectChange} options={groupSizeOptions} />
									</div>
								</div>

								{/* Transportation */}
								<div>
									<label className='mb-2 block text-sm font-medium text-gray-700'>Transportation Preferences</label>
									<select name='transport' multiple value={formData.transport} onChange={handleMultiSelectChange} className='w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200' style={{ minHeight: '100px' }}>
										{transportOptions.map((opt) => (
											<option key={opt.value} value={opt.value}>
												{opt.label}
											</option>
										))}
									</select>
									<p className='mt-1 text-xs text-gray-500'>Hold Cmd/Ctrl to select multiple</p>
								</div>

								{/* Error Message */}
								{error && (
									<div className='rounded-lg bg-red-50 border border-red-200 p-4'>
										<p className='text-sm text-red-600'>{error}</p>
									</div>
								)}

								{/* Submit Button */}
								<Button type='submit' disabled={isGenerating} fullWidth size='lg' className='text-base font-semibold'>
									{isGenerating ? (
										<span className='flex items-center justify-center gap-2'>
											<span className='h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent' />
											Generating Your Perfect Trip...
										</span>
									) : (
										<span className='flex items-center justify-center gap-2'>
											<Sparkles className='h-5 w-5' />
											Generate Itinerary
										</span>
									)}
								</Button>
							</form>
						</Card>

						{/* Results Card */}
						<div className='h-fit'>
							<Card className='p-8 shadow-xl'>
								<h2 className='mb-6 text-2xl font-semibold text-gray-800'>Your Itinerary</h2>

								{!generatedTrip && !isGenerating && (
									<div className='flex flex-col items-center justify-center py-16 text-center'>
										<div className='mb-4 rounded-full bg-orange-100 p-6'>
											<Sparkles className='h-12 w-12 text-orange-500' />
										</div>
										<p className='text-gray-600'>Fill out the form and click Generate to create your personalized itinerary</p>
									</div>
								)}

								{isGenerating && (
									<div className='flex flex-col items-center justify-center py-16'>
										<div className='mb-4 h-16 w-16 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600' />
										<p className='text-lg font-medium text-gray-700'>Creating your perfect trip...</p>
										<p className='mt-2 text-sm text-gray-500'>This may take 10-20 seconds</p>
									</div>
								)}

								{generatedTrip && (
									<div className='space-y-6'>
										{/* Trip Header */}
										<div className='rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white'>
											<h3 className='text-2xl font-bold'>{generatedTrip.place_name}</h3>
											<p className='mt-1 text-orange-100'>{generatedTrip.days.length} day trip</p>
										</div>

										{/* Days */}
										<div className='space-y-6'>
											{generatedTrip.days.map((day, dayIndex) => (
												<div key={dayIndex} className='rounded-lg border border-gray-200 p-5'>
													<h4 className='mb-4 text-lg font-semibold text-orange-600'>{day.day_name}</h4>

													<div className='space-y-4'>
														{day.activities.map((activity, actIndex) => (
															<div key={actIndex} className='rounded-lg bg-gray-50 p-4 hover:bg-orange-50 transition-colors'>
																<div className='mb-2 flex items-start justify-between'>
																	<h5 className='font-semibold text-gray-800'>{activity.name}</h5>
																	<span className='rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700'>{activity.time_to_complete_hours}h</span>
																</div>
																<p className='mb-2 text-sm text-gray-600 flex items-start gap-2'>
																	<MapPin className='h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0' />
																	<span>{activity.location}</span>
																</p>
																<p className='text-sm text-gray-700'>{activity.description}</p>
															</div>
														))}
													</div>
												</div>
											))}
										</div>

										{/* Action Buttons */}
										<div className='flex gap-3 pt-4'>
											<Button onClick={handleSave} variant='success' className='flex-1'>
												Save Itinerary
											</Button>
											<Button
												onClick={() => {
													setGeneratedTrip(null);
													setFormData({
														destination: '',
														startDate: '',
														endDate: '',
														budget: 'medium',
														vibe: 'balanced',
														activities: [],
														travelingWith: ['solo'],
														groupSize: '1',
														transport: ['walking', 'public'],
													});
												}}
												variant='outline'
												className='flex-1 border-orange-500 text-orange-600 hover:bg-orange-50'>
												Start New Plan
											</Button>
										</div>
									</div>
								)}
							</Card>
						</div>
					</div>
				</Container>
			</div>
		</>
	);
};
