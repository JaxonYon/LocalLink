import { useId } from 'react';
import type { SelectHTMLAttributes } from 'react';

import { cn } from '@/utils';

export interface SelectOption {
	value: string;
	label: string;
	disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
	label?: string;
	description?: string;
	error?: string;
	options: SelectOption[];
	placeholder?: string;
}

export const Select = ({
	className,
	label,
	description,
	error,
	options,
	placeholder,
	id,
	...props
}: SelectProps): JSX.Element => {
	const autoId = useId();
	const selectId = id ?? autoId;

	return (
		<div className="space-y-2">
			{label ? (
				<label htmlFor={selectId} className="text-sm font-medium text-text">
					{label}
				</label>
			) : null}
			<select
				id={selectId}
				className={cn(
					'h-11 w-full rounded-md border border-border bg-surface px-3 text-sm text-text focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200',
					error ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : '',
					className
				)}
				aria-invalid={error ? 'true' : 'false'}
				{...props}
			>
				{placeholder ? (
					<option value="" disabled>
						{placeholder}
					</option>
				) : null}
				{options.map((option) => (
					<option key={option.value} value={option.value} disabled={option.disabled}>
						{option.label}
					</option>
				))}
			</select>
			{description ? <p className="text-xs text-text-subtle">{description}</p> : null}
			{error ? (
				<p className="text-xs text-red-600" role="alert">
					{error}
				</p>
			) : null}
		</div>
	);
};
