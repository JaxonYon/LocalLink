import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { NavLink, Link } from 'react-router-dom';

import { cn } from '@/utils';
import { Button } from '@/components/ui';

const navItems = [
	{ label: 'Home', to: '/' },
	{ label: 'Discover', to: '/discover' },
	{ label: 'AI Itinerary', to: '/itinerary' },
	{ label: 'Saved', to: '/saved' }
];

export const Header = (): JSX.Element => {
	return (
		<header className="border-b border-border bg-surface">
			<div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
				<Link to="/" className="text-lg font-semibold tracking-tight text-text">
					Local Link
				</Link>
				<nav className="hidden items-center gap-6 md:flex">
					{navItems.map((item) => (
						<NavLink
							key={item.to}
							to={item.to}
							end={item.to === '/'}
							className={({ isActive }) =>
								cn(
									'text-sm font-medium text-text-subtle transition-colors hover:text-text',
									isActive ? 'text-text' : ''
								)
							}
						>
							{item.label}
						</NavLink>
					))}
				</nav>
				<div className="flex items-center gap-3">
					<SignedOut>
						<Button asChild variant="ghost" size="sm">
							<Link to="/auth/sign-in">Sign in</Link>
						</Button>
						<Button asChild variant="primary" size="sm">
							<Link to="/auth/sign-up">Sign up</Link>
						</Button>
					</SignedOut>
					<SignedIn>
						<UserButton afterSignOutUrl="/" />
					</SignedIn>
				</div>
			</div>
		</header>
	);
};
