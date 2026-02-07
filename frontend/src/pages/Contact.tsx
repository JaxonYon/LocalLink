import { Button, Card } from '@/components/ui';
import { Mail, MessageSquare, Phone } from 'lucide-react';

export const Contact = (): JSX.Element => {
	return (
		<div className='max-w-4xl mx-auto px-4 py-12 space-y-8'>
			<div>
				<h1 className='text-3xl font-bold text-text'>Contact & Support</h1>
				<p className='text-text-subtle mt-2'>Get in touch with our team. We're here to help!</p>
			</div>

			<div className='grid md:grid-cols-3 gap-6'>
				<Card className='p-6 space-y-3 text-center'>
					<div className='mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center'>
						<Mail className='h-6 w-6 text-blue-600 dark:text-blue-400' />
					</div>
					<h3 className='font-semibold text-text'>Email Support</h3>
					<p className='text-sm text-text-subtle'>Get help via email</p>
					<a href='mailto:support@locallink.com' className='text-blue-600 hover:underline text-sm'>
						support@locallink.com
					</a>
				</Card>

				<Card className='p-6 space-y-3 text-center'>
					<div className='mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center'>
						<MessageSquare className='h-6 w-6 text-green-600 dark:text-green-400' />
					</div>
					<h3 className='font-semibold text-text'>Live Chat</h3>
					<p className='text-sm text-text-subtle'>Chat with our team</p>
					<Button variant='link' size='sm'>
						Start Chat
					</Button>
				</Card>

				<Card className='p-6 space-y-3 text-center'>
					<div className='mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center'>
						<Phone className='h-6 w-6 text-purple-600 dark:text-purple-400' />
					</div>
					<h3 className='font-semibold text-text'>Phone Support</h3>
					<p className='text-sm text-text-subtle'>Mon-Fri, 9am-5pm EST</p>
					<a href='tel:+1-555-0123' className='text-blue-600 hover:underline text-sm'>
						+1 (555) 0123
					</a>
				</Card>
			</div>

			<Card className='p-8 space-y-6'>
				<h2 className='text-2xl font-semibold text-text'>Send us a message</h2>
				<form className='space-y-4'>
					<div className='grid md:grid-cols-2 gap-4'>
						<div>
							<label className='block text-sm font-medium text-text mb-1'>Name</label>
							<input type='text' className='w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Your name' />
						</div>
						<div>
							<label className='block text-sm font-medium text-text mb-1'>Email</label>
							<input type='email' className='w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='your@email.com' />
						</div>
					</div>
					<div>
						<label className='block text-sm font-medium text-text mb-1'>Subject</label>
						<input type='text' className='w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='How can we help?' />
					</div>
					<div>
						<label className='block text-sm font-medium text-text mb-1'>Message</label>
						<textarea rows={6} className='w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Tell us more...' />
					</div>
					<Button type='submit' fullWidth className='md:w-auto'>
						Send Message
					</Button>
				</form>
			</Card>

			<Card className='p-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900'>
				<h3 className='font-semibold text-text mb-2'>Frequently Asked Questions</h3>
				<p className='text-sm text-text-subtle mb-3'>Check out our FAQ section for quick answers to common questions.</p>
				<a href='#' className='text-blue-600 hover:underline text-sm font-medium'>
					View FAQ →
				</a>
			</Card>
		</div>
	);
};
