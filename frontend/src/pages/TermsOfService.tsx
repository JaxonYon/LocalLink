import { Card } from '@/components/ui';

export const TermsOfService = (): JSX.Element => {
	return (
		<div className='max-w-4xl mx-auto px-4 py-12 space-y-8'>
			<div>
				<h1 className='text-3xl font-bold text-text'>Terms of Service</h1>
				<p className='text-text-subtle mt-2'>Last updated: February 1, 2026</p>
			</div>

			<Card className='p-8 space-y-6'>
				<section className='space-y-3'>
					<h2 className='text-xl font-semibold text-text'>1. Acceptance of Terms</h2>
					<p className='text-text-subtle'>By accessing and using LocalLink, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our service.</p>
				</section>

				<section className='space-y-3'>
					<h2 className='text-xl font-semibold text-text'>2. Use of Service</h2>
					<p className='text-text-subtle'>LocalLink provides AI-powered travel planning services. You agree to use the service only for lawful purposes and in accordance with these Terms of Service.</p>
					<ul className='list-disc list-inside text-text-subtle space-y-1 ml-4'>
						<li>You must be at least 18 years old to use this service</li>
						<li>You are responsible for maintaining the confidentiality of your account</li>
						<li>You agree not to reproduce, duplicate, or exploit any portion of the service without permission</li>
					</ul>
				</section>

				<section className='space-y-3'>
					<h2 className='text-xl font-semibold text-text'>3. AI-Generated Content</h2>
					<p className='text-text-subtle'>LocalLink uses Google Gemini AI to generate travel itineraries. While we strive for accuracy, AI-generated content may contain errors or outdated information. You are responsible for verifying all travel plans before making bookings.</p>
				</section>

				<section className='space-y-3'>
					<h2 className='text-xl font-semibold text-text'>4. User Accounts</h2>
					<p className='text-text-subtle'>When you create an account with us, you must provide accurate and complete information. You are solely responsible for the activity that occurs on your account.</p>
				</section>

				<section className='space-y-3'>
					<h2 className='text-xl font-semibold text-text'>5. Intellectual Property</h2>
					<p className='text-text-subtle'>The service and its original content, features, and functionality are and will remain the exclusive property of LocalLink and its licensors.</p>
				</section>

				<section className='space-y-3'>
					<h2 className='text-xl font-semibold text-text'>6. Limitation of Liability</h2>
					<p className='text-text-subtle'>LocalLink shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.</p>
				</section>

				<section className='space-y-3'>
					<h2 className='text-xl font-semibold text-text'>7. Changes to Terms</h2>
					<p className='text-text-subtle'>We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.</p>
				</section>

				<section className='space-y-3'>
					<h2 className='text-xl font-semibold text-text'>8. Contact Us</h2>
					<p className='text-text-subtle'>
						If you have any questions about these Terms, please contact us at{' '}
						<a href='mailto:legal@locallink.com' className='text-blue-600 hover:underline'>
							legal@locallink.com
						</a>
					</p>
				</section>
			</Card>
		</div>
	);
};
