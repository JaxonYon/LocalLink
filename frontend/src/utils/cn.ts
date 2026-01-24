export type ClassValue = string | null | undefined | false;

export const cn = (...values: ClassValue[]): string => {
	return values.filter(Boolean).join(' ');
};
