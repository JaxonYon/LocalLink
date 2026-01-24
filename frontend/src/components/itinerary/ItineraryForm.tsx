import { useState } from 'react';
import type { FormEvent } from 'react';

import type { BudgetTier, ItineraryInput, ItineraryPace } from '@/types';
import { Button, Input, Select } from '@/components/ui';
import { cn } from '@/utils';

const interestOptions = [
	{ value: 'culture', label: 'Culture' },
	{ value: 'food', label: 'Food & Drink' },
	{ value: 'outdoors', label: 'Outdoors' },
	{ value: 'wellness', label: 'Wellness' },
	{ value: 'nightlife', label: 'Nightlife' },
	{ value: 'family', label: 'Family-friendly' }
];

const paceOptions: { value: ItineraryPace; label: string }[] = [
	{ value: 'relaxed', label: 'Relaxed' },
	{ value: 'balanced', label: 'Balanced' },
	{ value: 'fast', label: 'Fast' }
];

const budgetOptions: { value: BudgetTier; label: string }[] = [
	{ value: 'low', label: 'Low' },
	{ value: 'medium', label: 'Medium' },
	{ value: 'high', label: 'High' }
];

export interface ItineraryFormProps {
	onGenerate: (input: ItineraryInput) => Promise<void> | void;
	isSubmitting?: boolean;
}

export const ItineraryForm = ({
	onGenerate,
	isSubmitting = false
}: ItineraryFormProps): JSX.Element => {
	const [formData, setFormData] = useState<ItineraryInput>({
		destination: '',
		startDate: '',
		endDate: '',
		interests: [],
		pace: 'balanced',
		budget: 'medium',
		mustSees: ''
	});
	const [errors, setErrors] = useState<{ destination?: string; dates?: string }>({});

	const updateField = <K extends keyof ItineraryInput,>(
		key: K,
		value: ItineraryInput[K]
	): void => {
		setFormData((prev) => ({ ...prev, [key]: value }));
	};

	const toggleInterest = (value: string): void => {
		setFormData((prev) => {
			const next = prev.interests.includes(value)
				? prev.interests.filter((item) => item !== value)
				: [...prev.interests, value];
			return { ...prev, interests: next };
		});
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();
		const nextErrors: { destination?: string; dates?: string } = {};
		if (!formData.destination.trim()) {
			nextErrors.destination = 'Add a destination.';
		}
		if (!formData.startDate || !formData.endDate) {
			nextErrors.dates = 'Select both dates.';
		}
		setErrors(nextErrors);
		if (Object.keys(nextErrors).length > 0) {
			return;
		}
		await onGenerate(formData);
	};

	return (
		<form className="space-y-6" onSubmit={handleSubmit}>
			<Input
				label="Destination"
				placeholder="e.g. Lisbon, Portugal"
				value={formData.destination}
				onChange={(event) => updateField('destination', event.target.value)}
				error={errors.destination}
			/>
			<div className="grid gap-4 sm:grid-cols-2">
				<Input
					label="Start date"
					type="date"
					value={formData.startDate}
					onChange={(event) => updateField('startDate', event.target.value)}
					error={errors.dates}
				/>
				<Input
					label="End date"
					type="date"
					value={formData.endDate}
					onChange={(event) => updateField('endDate', event.target.value)}
					error={errors.dates}
				/>
			</div>
			<div className="space-y-2">
				<p className="text-sm font-medium text-text">Interests</p>
				<div className="flex flex-wrap gap-3">
					{interestOptions.map((option) => {
						const checked = formData.interests.includes(option.value);
						return (
							<label
								key={option.value}
								className={cn(
									'flex items-center gap-2 rounded-full border px-3 py-2 text-xs transition-colors',
									checked
										? 'border-brand-300 bg-brand-50 text-brand-700'
										: 'border-border text-text-subtle'
								)}
							>
								<input
									type="checkbox"
									className="sr-only"
									checked={checked}
									onChange={() => toggleInterest(option.value)}
								/>
								{option.label}
							</label>
						);
					})}
				</div>
			</div>
			<div className="grid gap-4 sm:grid-cols-2">
				<Select
					label="Pace"
					value={formData.pace}
					onChange={(event) => updateField('pace', event.target.value as ItineraryPace)}
					options={paceOptions}
				/>
				<Select
					label="Budget"
					value={formData.budget}
					onChange={(event) => updateField('budget', event.target.value as BudgetTier)}
					options={budgetOptions}
				/>
			</div>
			<div className="space-y-2">
				<label className="text-sm font-medium text-text" htmlFor="mustSees">
					Must-see places
				</label>
				<textarea
					id="mustSees"
					className="min-h-[100px] w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-subtle focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
					placeholder="List places separated by commas"
					value={formData.mustSees}
					onChange={(event) => updateField('mustSees', event.target.value)}
				/>
			</div>
			<Button type="submit" disabled={isSubmitting}>
				{isSubmitting ? 'Generating...' : 'Generate itinerary'}
			</Button>
		</form>
	);
};
