export type TripStyle = 'local-culture' | 'adventure' | 'relaxed' | 'foodie' | 'wellness';

export type BudgetRange = 'budget' | 'mid' | 'premium';

export type AccessibilityNeed = 'none' | 'mobility' | 'hearing' | 'vision' | 'neurodiverse' | 'other';

export type OnboardingStepId =
	| 'tripStyle'
	| 'budget'
	| 'activities'
	| 'partySize'
	| 'homeLocation'
	| 'accessibility';

export interface OnboardingStep {
	id: OnboardingStepId;
	label: string;
	description: string;
}

export interface OnboardingData {
	tripStyle: TripStyle;
	budget: BudgetRange;
	activities: string[];
	partySize: number;
	homeLocation: string;
	accessibility: AccessibilityNeed[];
}
