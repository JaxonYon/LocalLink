import type { FormEvent } from 'react';
import { useState } from 'react';

import { Button, Input, Select } from '@/components/ui';
import type { BudgetTier, ItineraryInput, ItineraryPace } from '@/types';

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

export interface ItineraryFormProps {
	onGenerate: (input: ItineraryInput) => Promise<void> | void;
	isSubmitting?: boolean;
}

export const ItineraryForm = ({ onGenerate, isSubmitting = false }: ItineraryFormProps): JSX.Element => {
	const [formData, setFormData] = useState<ItineraryInput>({
		destination: '',
		startDate: '',
		endDate: '',
		interests: [],
		pace: 'balanced',
		budget: 'medium',
		mustSees: '',
	});
	const toggleInterest = (value: string): void => {
		setFormData((prev) => {
			const next = prev.interests.includes(value) ? prev.interests.filter((item) => item !== value) : [...prev.interests, value];
			return { ...prev, interests: next };
		});
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
		if (isSubmitting) return;
		await onGenerate(formData);
	};

	return (
		<form onSubmit={handleSubmit} className='itinerary-form'>
			<Input name='destination' value={formData.destination} onChange={handleChange} placeholder='Destination' required />
			<Input name='startDate' type='date' value={formData.startDate} onChange={handleChange} required />
			<Input name='endDate' type='date' value={formData.endDate} onChange={handleChange} required />
			<div className='flex flex-wrap gap-2'>
				{interestOptions.map((option) => (
					<Button key={option.value} type='button' variant='outline' size='sm' className={formData.interests.includes(option.value) ? 'border-orange-300 bg-orange-50 text-orange-700' : 'border-border text-text-subtle'} onClick={() => toggleInterest(option.value)}>
						{option.label}
					</Button>
				))}
			</div>
			<Select name='pace' options={paceOptions} onChange={handleChange} />
			<Select name='budget' options={budgetOptions} onChange={handleChange} />
			<Button type='submit' disabled={isSubmitting}>
				Generate Itinerary
			</Button>
		</form>
	);
};
