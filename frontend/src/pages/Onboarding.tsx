import { Container } from '@/components/layout';
import { SectionHero } from '@/components/section-hero';
import { Button, Card, Input } from '@/components/ui';
import { setOnboardingComplete, setOnboardingData } from '@/store';
import type { AccessibilityNeed, OnboardingData, OnboardingStep } from '@/types';
import { cn } from '@/utils';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const steps: OnboardingStep[] = [
	{
		id: 'tripStyle',
		label: 'Trip style',
		description: 'Choose the vibe you want to travel with.',
	},
	{
		id: 'budget',
		label: 'Budget',
		description: 'Select the budget range that feels right.',
	},
	{
		id: 'activities',
		label: 'Activities',
		description: 'Pick a few activities you want to prioritize.',
	},
	{
		id: 'partySize',
		label: 'Travel party',
		description: 'Let us know how many people you are planning for.',
	},
	{
		id: 'homeLocation',
		label: 'Home base',
		description: 'Tell us where you are traveling from.',
	},
	{
		id: 'accessibility',
		label: 'Accessibility',
		description: 'We will tailor recommendations with these needs in mind.',
	},
];

const tripStyleOptions = [
	{ value: 'local-culture', label: 'Local culture' },
	{ value: 'adventure', label: 'Adventure' },
	{ value: 'relaxed', label: 'Relaxed' },
	{ value: 'foodie', label: 'Food-focused' },
	{ value: 'wellness', label: 'Wellness' },
] as const;

const budgetOptions = [
	{ value: 'budget', label: 'Budget-friendly' },
	{ value: 'mid', label: 'Mid-range' },
	{ value: 'premium', label: 'Premium' },
] as const;

const activityOptions = ['Markets', 'Museums', 'Nature', 'Food tours', 'Nightlife', 'Local crafts'];

const accessibilityOptions: { value: AccessibilityNeed; label: string }[] = [
	{ value: 'none', label: 'No additional needs' },
	{ value: 'mobility', label: 'Mobility support' },
	{ value: 'hearing', label: 'Hearing support' },
	{ value: 'vision', label: 'Vision support' },
	{ value: 'neurodiverse', label: 'Neurodiverse friendly' },
	{ value: 'other', label: 'Other accommodations' },
];

const OnboardingPage = (): JSX.Element => {
	const navigate = useNavigate();
	const [stepIndex, setStepIndex] = useState<number>(0);
	const [formData, setFormData] = useState<OnboardingData>({
		tripStyle: 'local-culture',
		budget: 'mid',
		activities: [],
		partySize: 2,
		homeLocation: '',
		accessibility: ['none'],
	});
	const [error, setError] = useState<string | null>(null);

	const currentStep = steps[stepIndex];
	const isLastStep = stepIndex === steps.length - 1;
	const progressPercent = Math.round(((stepIndex + 1) / steps.length) * 100);

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

	const updateField = <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]): void => {
		setFormData((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	const toggleActivity = (activity: string): void => {
		setFormData((prev) => {
			const next = prev.activities.includes(activity) ? prev.activities.filter((item) => item !== activity) : [...prev.activities, activity];

			return {
				...prev,
				activities: next,
			};
		});
	};

	const toggleAccessibility = (need: AccessibilityNeed): void => {
		setFormData((prev) => {
			if (need === 'none') {
				return {
					...prev,
					accessibility: ['none'],
				};
			}

			const withoutNone = prev.accessibility.filter((item) => item !== 'none');
			const next = withoutNone.includes(need) ? withoutNone.filter((item) => item !== need) : [...withoutNone, need];

			return {
				...prev,
				accessibility: next.length === 0 ? ['none'] : next,
			};
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
		<main className='bg-surface-subtle'>
			<SectionHero title='Build your travel profile' subTitle='Tell us how you like to travel so we can recommend the best Local Link experiences.' />

			<Container className='py-10'>
				<Card className='space-y-6 p-6'>
					<div className='select-none space-y-3'>
						<div className='flex items-center justify-between text-xs font-medium text-text-subtle'>
							<span>
								Step {stepIndex + 1} of {steps.length}
							</span>

							<span>{progressPercent}% complete</span>
						</div>

						<div className='h-2 w-full rounded-full bg-orange-100'>
							<div className='h-2 rounded-full bg-orange-500 transition-all' style={{ width: `${progressPercent}%` }} />
						</div>
					</div>

					<div className='space-y-3'>
						<div className='select-none flex flex-wrap gap-2'>
							{steps.map((step, index) => (
								<div key={step.id} className={cn('px-3 py-1 flex items-center gap-2 rounded-full border text-xs', index === stepIndex ? 'border-orange-300 bg-orange-50 text-orange-700' : stepCompletion[index] ? 'border-border text-text' : 'border-border text-text-subtle')}>
									<span className='font-semibold text-[10px]'>{index + 1}</span>
									<span>{step.label}</span>
								</div>
							))}
						</div>

						<div>
							<h2 className='font-semibold text-lg text-text'>{currentStep.label}</h2>
							<p className='text-sm text-text-subtle'>{currentStep.description}</p>
						</div>
					</div>

					<div className='select-none space-y-4'>
						{currentStep.id === 'tripStyle' ? (
							<div className='flex flex-wrap gap-3'>
								{tripStyleOptions.map((option) => (
									<Button key={option.value} type='button' variant='outline' size='sm' className={cn('px-4', formData.tripStyle === option.value ? 'border-orange-300 bg-orange-50 text-orange-700' : 'border-border text-text-subtle')} onClick={() => updateField('tripStyle', option.value)}>
										{option.label}
									</Button>
								))}
							</div>
						) : null}

						{currentStep.id === 'budget' ? (
							<div className='flex flex-wrap gap-3'>
								{budgetOptions.map((option) => (
									<Button key={option.value} type='button' variant='outline' size='sm' className={cn('px-4', formData.budget === option.value ? 'border-orange-300 bg-orange-50 text-orange-700' : 'border-border text-text-subtle')} onClick={() => updateField('budget', option.value)}>
										{option.label}
									</Button>
								))}
							</div>
						) : null}

						{currentStep.id === 'activities' ? (
							<div className='flex flex-wrap gap-3'>
								{activityOptions.map((option) => (
									<Button key={option} type='button' variant='outline' size='sm' className={cn('px-4', formData.activities.includes(option) ? 'border-orange-300 bg-orange-50 text-orange-700' : 'border-border text-text-subtle')} onClick={() => toggleActivity(option)}>
										{option}
									</Button>
								))}
							</div>
						) : null}

						{currentStep.id === 'partySize' ? <Input label='Travel party size' type='number' min={1} value={formData.partySize} onChange={(event) => updateField('partySize', Number(event.target.value) || 0)} /> : null}

						{currentStep.id === 'homeLocation' ? <Input label='Home location' placeholder='City, country' value={formData.homeLocation} onChange={(event) => updateField('homeLocation', event.target.value)} /> : null}

						{currentStep.id === 'accessibility' ? (
							<div className='flex flex-wrap gap-3'>
								{accessibilityOptions.map((option) => (
									<Button key={option.value} type='button' variant='outline' size='sm' fullWidth aria-pressed={formData.accessibility.includes(option.value)} className={cn('px-4 md:w-auto', formData.accessibility.includes(option.value) ? 'border-orange-300 bg-orange-50 text-orange-700' : 'border-border text-text-subtle')} onClick={() => toggleAccessibility(option.value)}>
										{option.label}
									</Button>
								))}
							</div>
						) : null}
					</div>

					{error ? <p className='text-sm text-red-600'>{error}</p> : null}

					<div className='flex items-center justify-between gap-2'>
						{stepIndex > 0 ? (
							<Button variant='ghost' onClick={handleBack}>
								Back
							</Button>
						) : (
							<span />
						)}

						<Button onClick={handleNext}>{isLastStep ? 'Finish' : 'Next'}</Button>
					</div>
				</Card>
			</Container>
		</main>
	);
};

export { OnboardingPage };
