import { ProtectedRoute } from '@/app/guards';
import { AppLayout, AuthLayout } from '@/components/layout';
import { Account, AuthResetPassword, AuthSignIn, AuthSignUp, Discover, Home, Itinerary, NotFound, Onboarding, Saved } from '@/pages';
import { createBrowserRouter } from 'react-router-dom';

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
				path: 'saved',
				element: (
					<ProtectedRoute>
						<Saved />
					</ProtectedRoute>
				),
			},
			{
				path: 'itinerary',
				element: (
					<ProtectedRoute>
						<Itinerary />
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
				path: 'onboarding',
				element: (
					<ProtectedRoute>
						<Onboarding />
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
