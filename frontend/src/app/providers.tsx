import { ClerkProvider } from '@clerk/clerk-react';
import type { FC, ReactNode } from 'react';

interface AppProvidersProps {
	children: ReactNode;
	clerkPublishableKey: string;
}

const AppProviders: FC<AppProvidersProps> = ({ children, clerkPublishableKey }): JSX.Element => {
	return <ClerkProvider publishableKey={clerkPublishableKey}>{children}</ClerkProvider>;
};

export { AppProviders };
