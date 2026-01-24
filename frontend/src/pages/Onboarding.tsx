import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Card, Input } from '@/components/ui';
import type { AccessibilityNeed, OnboardingData, OnboardingStep } from '@/types';
import { setOnboardingComplete, setOnboardingData } from '@/store';
import { cn } from '@/utils';

const steps: OnboardingStep[] = [
	{
		id: 'tripStyle',
		label: 'Trip style',
		description: 'Choose the vibe you want to travel with.'
	},
	{
		id: 'budget',
		label: 'Budget',
		description: 'Select the budget range that feels right.'
	},
	{
		id: 'activities',
		label: 'Activities',
		description: 'Pick a few activities you want to prioritize.'
	},
	{
		id: 'partySize',
		label: 'Travel party',
		description: 'Let us know how many people you are planning for.'
	},
	{
		id: 'homeLocation',
		label: 'Home base',
		description: 'Tell us where you are traveling from.'
	},
	{
		id: 'accessibility',
		label: 'Accessibility',
		description: 'We will tailor recommendations with these needs in mind.'
	}
];

const tripStyleOptions = [
	{ value: 'local-culture', label: 'Local culture' },
	{ value: 'adventure', label: 'Adventure' },
	{ value: 'relaxed', label: 'Relaxed' },
	{ value: 'foodie', label: 'Food-focused' },
	{ value: 'wellness', label: 'Wellness' }
] as const;

const budgetOptions = [
	{ value: 'budget', label: 'Budget-friendly' },
	{ value: 'mid', label: 'Mid-range' },
	{ value: 'premium', label: 'Premium' }
] as const;

const activityOptions = ['Markets', 'Museums', 'Nature', 'Food tours', 'Nightlife', 'Local crafts'];

const accessibilityOptions: { value: AccessibilityNeed; label: string }[] = [
	{ value: 'none', label: 'No additional needs' },
	{ value: 'mobility', label: 'Mobility support' },
	{ value: 'hearing', label: 'Hearing support' },
	{ value: 'vision', label: 'Vision support' },
	{ value: 'neurodiverse', label: 'Neurodiverse friendly' },
	{ value: 'other', label: 'Other accommodations' }
];

export const Onboarding = (): JSX.Element => {
	const navigate = useNavigate();
	const [stepIndex, setStepIndex] = useState<number>(0);
	const [formData, setFormData] = useState<OnboardingData>({
		tripStyle: 'local-culture',
		budget: 'mid',
		activities: [],
		partySize: 2,
		homeLocation: '',
		accessibility: ['none']
	});
	const [error, setError] = useState<string | null>(null);

	const currentStep = steps[stepIndex];
	const isLastStep = stepIndex === steps.length - 1;

	const stepCompletion = useMemo(() => {
		return steps.map((step) => {
			switch (step.id) {
				case 'activities':
					return formData.activities.length > 0;
				case 'partySize':
					return formData.partySize > 0;
				case 'homeLocation':
					return formData.homeLocation.trim().length > 0;
				case 'accessibility':
					return formData.accessibility.length > 0;
				default:
					return true;
			}
		});
	}, [formData]);

	const updateField = <K extends keyof OnboardingData,>(
		key: K,
		value: OnboardingData[K]
	): void => {
		setFormData((prev) => ({ ...prev, [key]: value }));
	};

	const toggleActivity = (activity: string): void => {
		setFormData((prev) => {
			const next = prev.activities.includes(activity)
				? prev.activities.filter((item) => item !== activity)
				: [...prev.activities, activity];
			return { ...prev, activities: next };
		});
	};

	const toggleAccessibility = (need: AccessibilityNeed): void => {
		setFormData((prev) => {
			if (need === 'none') {
				return { ...prev, accessibility: ['none'] };
			}
			const withoutNone = prev.accessibility.filter((item) => item !== 'none');
			const next = withoutNone.includes(need)
				? withoutNone.filter((item) => item !== need)
				: [...withoutNone, need];
			return { ...prev, accessibility: next.length === 0 ? ['none'] : next };
		});
	};

	const validateStep = (): boolean => {
		switch (currentStep.id) {
			case 'activities':
				if (formData.activities.length === 0) {
					setError('Select at least one activity.');
					return false;
				}
				break;
			case 'partySize':
				if (formData.partySize <= 0) {
					setError('Party size must be at least 1.');
					return false;
				}
				break;
			case 'homeLocation':
				if (!formData.homeLocation.trim()) {
					setError('Add your home location.');
					return false;
				}
				break;
			default:
				break;
		}
		setError(null);
		return true;
	};

	const handleNext = (): void => {
		if (!validateStep()) {
			return;
		}
		if (isLastStep) {
			setOnboardingData(formData);
			setOnboardingComplete(true);
			navigate('/');
			return;
		}
		setStepIndex((prev) => prev + 1);
	};

	const handleBack = (): void => {
		setError(null);
		setStepIndex((prev) => Math.max(0, prev - 1));
	};

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-2xl font-semibold text-text">Complete your profile</h1>
				<p className="text-sm text-text-subtle">
					We will personalize recommendations based on your preferences.
				</p>
			</div>
			<Card className="space-y-6 p-6">
				<div className="space-y-3">
					<div className="flex flex-wrap gap-2">
						{steps.map((step, index) => (
							<div
								key={step.id}
								className={cn(
									'flex items-center gap-2 rounded-full border px-3 py-1 text-xs',
									index === stepIndex
										? 'border-brand-300 bg-brand-50 text-brand-700'
										: stepCompletion[index]
											? 'border-border text-text'
											: 'border-border text-text-subtle'
								)}
							>
								<span className="text-[10px] font-semibold">{index + 1}</span>
								<span>{step.label}</span>
							</div>
						))}
					</div>
					<div>
						<h2 className="text-lg font-semibold text-text">{currentStep.label}</h2>
						<p className="text-sm text-text-subtle">{currentStep.description}</p>
					</div>
				</div>

				<div className="space-y-4">
					{currentStep.id === 'tripStyle' ? (
						<div className="flex flex-wrap gap-3">
							{tripStyleOptions.map((option) => (
								<button
									key={option.value}
									type="button"
									className={cn(
										'rounded-full border px-4 py-2 text-sm',
										formData.tripStyle === option.value
											? 'border-brand-300 bg-brand-50 text-brand-700'
											: 'border-border text-text-subtle'
									)}
									onClick={() => updateField('tripStyle', option.value)}
								>
									{option.label}
								</button>
							))}
						</div>
					) : null}

					{currentStep.id === 'budget' ? (
						<div className="flex flex-wrap gap-3">
							{budgetOptions.map((option) => (
								<button
									key={option.value}
									type="button"
									className={cn(
										'rounded-full border px-4 py-2 text-sm',
										formData.budget === option.value
											? 'border-brand-300 bg-brand-50 text-brand-700'
											: 'border-border text-text-subtle'
									)}
									onClick={() => updateField('budget', option.value)}
								>
									{option.label}
								</button>
							))}
						</div>
					) : null}

					{currentStep.id === 'activities' ? (
						<div className="flex flex-wrap gap-3">
							{activityOptions.map((option) => (
								<button
									key={option}
									type="button"
									className={cn(
										'rounded-full border px-4 py-2 text-sm',
										formData.activities.includes(option)
											? 'border-brand-300 bg-brand-50 text-brand-700'
											: 'border-border text-text-subtle'
									)}
									onClick={() => toggleActivity(option)}
								>
									{option}
								</button>
							))}
						</div>
					) : null}

					{currentStep.id === 'partySize' ? (
						<Input
							label="Travel party size"
							type="number"
							min={1}
							value={formData.partySize}
							onChange={(event) =>
								updateField('partySize', Number(event.target.value) || 0)
							}
						/>
					) : null}

					{currentStep.id === 'homeLocation' ? (
						<Input
							label="Home location"
							placeholder="City, country"
							value={formData.homeLocation}
							onChange={(event) => updateField('homeLocation', event.target.value)}
						/>
					) : null}

					{currentStep.id === 'accessibility' ? (
						<div className="space-y-3">
							{accessibilityOptions.map((option) => (
								<label
									key={option.value}
									className="flex items-center gap-3 rounded-md border border-border px-4 py-3 text-sm"
								>
									<input
										type="checkbox"
										checked={formData.accessibility.includes(option.value)}
										onChange={() => toggleAccessibility(option.value)}
										className="h-4 w-4 rounded border-border"
									/>
									{option.label}
								</label>
							))}
						</div>
					) : null}
				</div>

				{error ? <p className="text-sm text-red-600">{error}</p> : null}
				<div className="flex justify-between">
					<Button variant="ghost" onClick={handleBack} disabled={stepIndex === 0}>
						Back
					</Button>
					<Button onClick={handleNext}>{isLastStep ? 'Finish' : 'Next'}</Button>
				</div>
			</Card>
		</div>
	);
};
