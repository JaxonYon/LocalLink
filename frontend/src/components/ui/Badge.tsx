import type { HTMLAttributes } from 'react';

import { cn } from '@/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
	variant?: 'default' | 'muted' | 'outline';
}

const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
	default: 'bg-brand-100 text-brand-700',
	muted: 'bg-surface-muted text-text-subtle',
	outline: 'border border-border text-text-subtle'
};

export const Badge = ({
	className,
	variant = 'default',
	...props
}: BadgeProps): JSX.Element => {
	return (
		<span
			className={cn(
				'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
				variantClasses[variant],
				className
			)}
			{...props}
		/>
	);
};
