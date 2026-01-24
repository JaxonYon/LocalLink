import { useAuth } from '@clerk/clerk-react';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { Spinner } from '@/components/ui';
import { isOnboardingComplete } from '@/store';

export interface OnboardingGuardProps {
	children: ReactNode;
}

const excludedRoutes = ['/onboarding', '/auth'];

export const OnboardingGuard = ({ children }: OnboardingGuardProps): JSX.Element => {
	const { isLoaded, isSignedIn } = useAuth();
	const location = useLocation();

	if (!isLoaded) {
		return (
			<div className="flex items-center justify-center py-16">
				<Spinner label="Preparing your workspace" />
			</div>
		);
	}

	const needsOnboarding = isSignedIn && !isOnboardingComplete();
	const isExcluded = excludedRoutes.some((route) => location.pathname.startsWith(route));

	if (needsOnboarding && !isExcluded) {
		return <Navigate to="/onboarding" replace />;
	}

	return <>{children}</>;
};
