import type { HTMLAttributes } from 'react';

import { cn } from '@/utils';

export type ContainerProps = HTMLAttributes<HTMLDivElement>;

export const Container = ({ className, ...props }: ContainerProps): JSX.Element => {
	return <div className={cn('mx-auto w-full max-w-6xl px-6', className)} {...props} />;
};
