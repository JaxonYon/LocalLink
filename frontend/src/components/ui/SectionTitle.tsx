import type { ReactNode } from 'react';

import { cn } from '@/utils';

export interface SectionTitleProps {
	title: string;
	subtitle?: string;
	action?: ReactNode;
	className?: string;
}

export const SectionTitle = ({
	title,
	subtitle,
	action,
	className
}: SectionTitleProps): JSX.Element => {
	return (
		<div className={cn('flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between', className)}>
			<div>
				<h2 className="text-xl font-semibold text-text">{title}</h2>
				{subtitle ? <p className="text-sm text-text-subtle">{subtitle}</p> : null}
			</div>
			{action ? <div>{action}</div> : null}
		</div>
	);
};
