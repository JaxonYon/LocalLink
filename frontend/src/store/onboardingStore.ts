import type { OnboardingData } from '@/types';
import { getLocalStorage, removeLocalStorage, setLocalStorage } from '@/store/localStorage';

const ONBOARDING_KEY = 'local_link_onboarding';
const ONBOARDING_COMPLETE_KEY = 'local_link_onboarding_complete';

export const getOnboardingData = (): OnboardingData | null => {
	return getLocalStorage<OnboardingData | null>(ONBOARDING_KEY, null);
};

export const setOnboardingData = (data: OnboardingData): void => {
	setLocalStorage(ONBOARDING_KEY, data);
};

export const isOnboardingComplete = (): boolean => {
	return getLocalStorage<boolean>(ONBOARDING_COMPLETE_KEY, false);
};

export const setOnboardingComplete = (complete: boolean): void => {
	setLocalStorage(ONBOARDING_COMPLETE_KEY, complete);
};

export const clearOnboarding = (): void => {
	removeLocalStorage(ONBOARDING_KEY);
	removeLocalStorage(ONBOARDING_COMPLETE_KEY);
};
