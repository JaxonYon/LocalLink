import { useAuth } from '@clerk/clerk-react';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { Spinner } from '@/components/ui';

export interface ProtectedRouteProps {
	children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps): JSX.Element => {
	const { isLoaded, isSignedIn } = useAuth();
	const location = useLocation();

	if (!isLoaded) {
		return (
			<div className='fixed inset-0 flex items-center justify-center bg-gradient-to-br from-orange-dark via-orange-600 to-orange-700 z-50'>
				<Spinner />
			</div>
		);
	}

	if (!isSignedIn) {
		return <Navigate to='/auth/sign-in' replace state={{ from: location.pathname }} />;
	}

	return <>{children}</>;
};
