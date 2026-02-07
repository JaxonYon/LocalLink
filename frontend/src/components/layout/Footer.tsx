import { Github, Heart, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = (): JSX.Element => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className='bg-gray-900 text-gray-300 mt-auto'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
				<div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
					{/* Brand Section */}
					<div className='space-y-4'>
						<h3 className='text-white text-xl font-bold'>LocalLink</h3>
						<p className='text-sm text-gray-400'>AI-powered travel planning for discovering authentic local experiences.</p>
						<div className='flex items-center gap-2 text-sm'>
							<span>Made with</span>
							<Heart className='h-4 w-4 text-red-500 fill-red-500' />
							<span>for travelers</span>
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h4 className='text-white font-semibold mb-4'>Quick Links</h4>
						<ul className='space-y-2 text-sm'>
							<li>
								<Link to='/' className='hover:text-white transition-colors'>
									Home
								</Link>
							</li>
							<li>
								<Link to='/discover' className='hover:text-white transition-colors'>
									Discover
								</Link>
							</li>
							<li>
								<Link to='/itinerary' className='hover:text-white transition-colors'>
									Create Itinerary
								</Link>
							</li>
							<li>
								<Link to='/account/saved' className='hover:text-white transition-colors'>
									Saved Trips
								</Link>
							</li>
						</ul>
					</div>

					{/* Support */}
					<div>
						<h4 className='text-white font-semibold mb-4'>Support</h4>
						<ul className='space-y-2 text-sm'>
							<li>
								<Link to='/account' className='hover:text-white transition-colors'>
									Account Settings
								</Link>
							</li>
							<li>
								<Link to='/contact' className='hover:text-white transition-colors'>
									Contact Us
								</Link>
							</li>
							<li>
								<Link to='/legal/privacy' className='hover:text-white transition-colors'>
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link to='/legal/terms' className='hover:text-white transition-colors'>
									Terms of Service
								</Link>
							</li>
						</ul>
					</div>

					{/* Contact */}
					<div>
						<h4 className='text-white font-semibold mb-4'>Connect</h4>
						<ul className='space-y-2 text-sm'>
							<li>
								<a href='mailto:support@locallink.com' className='flex items-center gap-2 hover:text-white transition-colors'>
									<Mail className='h-4 w-4' />
									support@locallink.com
								</a>
							</li>
							<li>
								<a href='https://github.com/JaxonYon/LocalLink' target='_blank' rel='noopener noreferrer' className='flex items-center gap-2 hover:text-white transition-colors'>
									<Github className='h-4 w-4' />
									GitHub
								</a>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className='border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500'>
					<p>© {currentYear} LocalLink. All rights reserved.</p>
					<p className='mt-2 md:mt-0'>Powered by Google Gemini AI & Railway</p>
				</div>
			</div>
		</footer>
	);
};

export { Footer };
