import { ProtectedRoute } from '@/app/guards';
import { AppLayout, AuthLayout } from '@/components/layout';
import { Account, AuthResetPassword, AuthSignIn, AuthSignUp, Contact, Discover, Home, ListingDetail, NotFound, OnboardingPage, Plan, PrivacyPolicy, Saved, TermsOfService } from '@/pages';
import { Navigate, createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
	{
		path: '/',
		element: <AppLayout />,
		children: [
			{
				index: true,
				element: <Home />,
			},
			{
				path: 'discover',
				element: <Discover />,
			},
			{
				path: 'listing/:id',
				element: <ListingDetail />,
			},
			{
				path: 'saved',
				element: <Navigate to='/account/saved' replace />,
			},
			{
				path: 'plan',
				element: (
					<ProtectedRoute>
						<Plan />
					</ProtectedRoute>
				),
			},
			{
				path: 'account',
				element: (
					<ProtectedRoute>
						<Account />
					</ProtectedRoute>
				),
			},
			{
				path: 'account/saved',
				element: (
					<ProtectedRoute>
						<Saved />
					</ProtectedRoute>
				),
			},
			{
				path: 'contact',
				element: <Contact />,
			},
			{
				path: 'legal/terms',
				element: <TermsOfService />,
			},
			{
				path: 'legal/privacy',
				element: <PrivacyPolicy />,
			},
			{
				path: 'onboarding',
				element: (
					<ProtectedRoute>
						<OnboardingPage />
					</ProtectedRoute>
				),
			},
		],
	},
	{
		path: '/auth',
		element: <AuthLayout />,
		children: [
			{
				path: 'sign-in/*',
				element: <AuthSignIn />,
			},
			{
				path: 'sign-up/*',
				element: <AuthSignUp />,
			},
			{
				path: 'reset-password/*',
				element: <AuthResetPassword />,
			},
		],
	},
	{
		path: '*',
		element: <NotFound />,
	},
]);

export { router };
