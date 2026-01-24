import type { HTMLAttributes } from 'react';

import { cn } from '@/utils';

export type CardProps = HTMLAttributes<HTMLDivElement>;

export const Card = ({ className, ...props }: CardProps): JSX.Element => {
	return (
		<div
			className={cn('rounded-lg border border-border bg-surface shadow-subtle', className)}
			{...props}
		/>
	);
};
