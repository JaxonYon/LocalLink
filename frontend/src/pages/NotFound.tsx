import { Link } from 'react-router-dom';

import { Button } from '@/components/ui';

export const NotFound = (): JSX.Element => {
	return (
		<div className="flex flex-col items-start gap-3">
			<p className="text-xs font-semibold uppercase tracking-[0.3em] text-text-subtle">404</p>
			<h1 className="text-2xl font-semibold text-text">We could not find that page.</h1>
			<p className="text-sm text-text-subtle">
				Head back to the homepage to continue exploring Local Link.
			</p>
			<Button asChild variant="outline">
				<Link to="/">Go home</Link>
			</Button>
		</div>
	);
};
