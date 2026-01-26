import { AppProviders, router } from '@/app';
import '@/styles/globals.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
	throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in environment variables.');
}

const root = document.getElementById('root');

if (!root) {
	throw new Error('Root element not found.');
}

createRoot(root).render(
	<StrictMode>
		<AppProviders clerkPublishableKey={CLERK_PUBLISHABLE_KEY}>
			<RouterProvider router={router} />
		</AppProviders>
	</StrictMode>
);
