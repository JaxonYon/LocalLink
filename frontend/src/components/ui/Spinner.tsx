import { Loader2 } from 'lucide-react';
import type { HTMLAttributes } from 'react';

import { cn } from '@/utils';

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {}

export const Spinner = ({ className, ...props }: SpinnerProps): JSX.Element => {
	return (
		<div className={cn('flex items-center justify-center', className)} {...props}>
			<Loader2 className='h-10 w-10 animate-spin text-white' aria-hidden='true' />
		</div>
	);
};
