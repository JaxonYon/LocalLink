import type { HTMLAttributes } from 'react';

import { cn } from '@/utils';

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
	label?: string;
}

export const Spinner = ({ className, label = 'Loading' }: SpinnerProps): JSX.Element => {
	return (
		<div className={cn('flex flex-col items-center justify-center gap-4', className)}>
			<div className='relative w-16 h-16'>
				<div className='absolute inset-0 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 opacity-20 animate-pulse'></div>
				<div className='absolute inset-2 rounded-full border-4 border-transparent border-t-orange-600 border-r-orange-500 animate-spin'></div>
				<div className='absolute inset-4 rounded-full border-2 border-orange-300 opacity-50'></div>
			</div>
			<div className='text-center'>
				<p className='text-base font-semibold text-gray-900'>{label}</p>
				<p className='text-xs text-gray-500 mt-1'>Just a moment...</p>
			</div>
		</div>
	);
};
