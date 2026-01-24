import { useUser } from '@clerk/clerk-react';

import { Card } from '@/components/ui';
import { getOnboardingData } from '@/store';

export const Account = (): JSX.Element => {
	const { user } = useUser();
	const onboarding = getOnboardingData();

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold text-text">Account</h1>
				<p className="text-sm text-text-subtle">Profile details and onboarding summary.</p>
			</div>
			<div className="grid gap-6 lg:grid-cols-2">
				<Card className="space-y-3 p-6">
					<h2 className="text-lg font-semibold text-text">Profile</h2>
					<div>
						<p className="text-xs font-semibold uppercase tracking-widest text-text-subtle">Name</p>
						<p className="text-sm text-text">{user?.fullName ?? 'Local Link traveler'}</p>
					</div>
					<div>
						<p className="text-xs font-semibold uppercase tracking-widest text-text-subtle">Email</p>
						<p className="text-sm text-text">
							{user?.primaryEmailAddress?.emailAddress ?? 'Not provided'}
						</p>
					</div>
				</Card>
				<Card className="space-y-3 p-6">
					<h2 className="text-lg font-semibold text-text">Onboarding summary</h2>
					{onboarding ? (
						<div className="space-y-2 text-sm text-text">
							<p>Trip style: {onboarding.tripStyle}</p>
							<p>Budget: {onboarding.budget}</p>
							<p>Activities: {onboarding.activities.join(', ') || 'Not set'}</p>
							<p>Party size: {onboarding.partySize}</p>
							<p>Home location: {onboarding.homeLocation}</p>
							<p>Accessibility: {onboarding.accessibility.join(', ') || 'None'}</p>
						</div>
					) : (
						<p className="text-sm text-text-subtle">Onboarding details are not available.</p>
					)}
				</Card>
			</div>
		</div>
	);
};
