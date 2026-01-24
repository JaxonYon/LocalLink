import { useId } from 'react';
import type { InputHTMLAttributes } from 'react';

import { cn } from '@/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	description?: string;
	error?: string;
}

export const Input = ({
	className,
	label,
	description,
	error,
	id,
	...props
}: InputProps): JSX.Element => {
	const autoId = useId();
	const inputId = id ?? autoId;

	return (
		<div className="space-y-2">
			{label ? (
				<label htmlFor={inputId} className="text-sm font-medium text-text">
					{label}
				</label>
			) : null}
			<input
				id={inputId}
				className={cn(
					'h-11 w-full rounded-md border border-border bg-surface px-3 text-sm text-text placeholder:text-text-subtle focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200',
					error ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : '',
					className
				)}
				aria-invalid={error ? 'true' : 'false'}
				{...props}
			/>
			{description ? <p className="text-xs text-text-subtle">{description}</p> : null}
			{error ? (
				<p className="text-xs text-red-600" role="alert">
					{error}
				</p>
			) : null}
		</div>
	);
};
