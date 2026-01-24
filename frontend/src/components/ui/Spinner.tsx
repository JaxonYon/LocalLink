import type { HTMLAttributes } from 'react';

import { cn } from '@/utils';

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
	label?: string;
}

export const Spinner = ({ className, label = 'Loading' }: SpinnerProps): JSX.Element => {
	return (
		<div className={cn('flex items-center gap-2 text-sm text-text-subtle', className)}>
			<span
				className="h-4 w-4 animate-spin rounded-full border-2 border-border-strong border-t-brand-600"
				aria-hidden="true"
			/>
			<span>{label}</span>
		</div>
	);
};
