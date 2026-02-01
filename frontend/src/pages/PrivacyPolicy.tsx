import { Card } from '@/components/ui';

export const PrivacyPolicy = (): JSX.Element => {
	return (
		<div className='max-w-4xl mx-auto px-4 py-12 space-y-8'>
			<div>
				<h1 className='text-3xl font-bold text-text'>Privacy Policy</h1>
				<p className='text-text-subtle mt-2'>Last updated: February 1, 2026</p>
			</div>

			<Card className='p-8 space-y-6'>
				<section className='space-y-3'>
					<h2 className='text-xl font-semibold text-text'>1. Information We Collect</h2>
					<p className='text-text-subtle'>We collect information that you provide directly to us, including:</p>
					<ul className='list-disc list-inside text-text-subtle space-y-1 ml-4'>
						<li>Name and email address (via Clerk authentication)</li>
						<li>Travel preferences and onboarding data</li>
						<li>Saved itineraries and trip information</li>
						<li>Usage data and analytics</li>
					</ul>
				</section>

				<section className='space-y-3'>
					<h2 className='text-xl font-semibold text-text'>2. How We Use Your Information</h2>
					<p className='text-text-subtle'>We use the information we collect to:</p>
					<ul className='list-disc list-inside text-text-subtle space-y-1 ml-4'>
						<li>Provide and improve our travel planning services</li>
						<li>Generate personalized AI-powered itineraries</li>
						<li>Communicate with you about your account and services</li>
						<li>Analyze usage patterns to enhance user experience</li>
					</ul>
				</section>

				<section className='space-y-3'>
					<h2 className='text-xl font-semibold text-text'>3. Data Storage</h2>
					<p className='text-text-subtle'>Your data is stored securely using industry-standard encryption. We use PostgreSQL on Railway for database storage and Redis for caching. All connections are encrypted and secured.</p>
				</section>

				<section className='space-y-3'>
					<h2 className='text-xl font-semibold text-text'>4. Third-Party Services</h2>
					<p className='text-text-subtle'>We use the following third-party services:</p>
					<ul className='list-disc list-inside text-text-subtle space-y-1 ml-4'>
						<li>
							<strong>Clerk:</strong> Authentication and user management
						</li>
						<li>
							<strong>Google Gemini AI:</strong> AI-powered itinerary generation
						</li>
						<li>
							<strong>Railway:</strong> Database and application hosting
						</li>
					</ul>
				</section>

				<section className='space-y-3'>
					<h2 className='text-xl font-semibold text-text'>5. Your Rights</h2>
					<p className='text-text-subtle'>You have the right to:</p>
					<ul className='list-disc list-inside text-text-subtle space-y-1 ml-4'>
						<li>Access and update your personal information</li>
						<li>Delete your account and associated data</li>
						<li>Export your saved itineraries</li>
						<li>Opt out of marketing communications</li>
					</ul>
				</section>

				<section className='space-y-3'>
					<h2 className='text-xl font-semibold text-text'>6. Cookies and Tracking</h2>
					<p className='text-text-subtle'>We use cookies and similar tracking technologies to track activity on our service and store certain information. You can instruct your browser to refuse all cookies or indicate when a cookie is being sent.</p>
				</section>

				<section className='space-y-3'>
					<h2 className='text-xl font-semibold text-text'>7. Data Retention</h2>
					<p className='text-text-subtle'>We retain your personal information only for as long as necessary to provide you with our services and as described in this Privacy Policy. When you delete your account, we permanently delete all associated data.</p>
				</section>

				<section className='space-y-3'>
					<h2 className='text-xl font-semibold text-text'>8. Security</h2>
					<p className='text-text-subtle'>We implement appropriate technical and organizational measures to protect your personal data. However, no method of transmission over the internet is 100% secure.</p>
				</section>

				<section className='space-y-3'>
					<h2 className='text-xl font-semibold text-text'>9. Changes to This Policy</h2>
					<p className='text-text-subtle'>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.</p>
				</section>

				<section className='space-y-3'>
					<h2 className='text-xl font-semibold text-text'>10. Contact Us</h2>
					<p className='text-text-subtle'>
						If you have any questions about this Privacy Policy, please contact us at{' '}
						<a href='mailto:privacy@locallink.com' className='text-blue-600 hover:underline'>
							privacy@locallink.com
						</a>
					</p>
				</section>
			</Card>
		</div>
	);
};
