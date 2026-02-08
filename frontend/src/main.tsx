import { AppProviders, router } from '@/app';
import '@/styles/globals.css';
import * as Sentry from '@sentry/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;

if (!CLERK_PUBLISHABLE_KEY) {
	throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in environment variables.');
}

const root = document.getElementById('root');

if (!root) {
	throw new Error('Root element not found.');
}

if (SENTRY_DSN) {
	Sentry.init({
		dsn: SENTRY_DSN,
		integrations: [Sentry.browserTracingIntegration()],
		sendDefaultPii: true,
		tracesSampleRate: 1.0,
	});
}

createRoot(root).render(
	<StrictMode>
		<AppProviders clerkPublishableKey={CLERK_PUBLISHABLE_KEY}>
			<RouterProvider router={router} />
		</AppProviders>
	</StrictMode>,
);
