export interface ListingGalleryProps {
	title: string;
}

export const ListingGallery = ({ title }: ListingGalleryProps): JSX.Element => {
	return (
		<div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
			<div className="flex h-64 items-center justify-center rounded-lg border border-border bg-surface-muted text-sm text-text-subtle">
				Main photo placeholder for {title}
			</div>
			<div className="grid gap-4">
				<div className="flex h-32 items-center justify-center rounded-lg border border-border bg-surface-muted text-xs text-text-subtle">
					Gallery view
				</div>
				<div className="flex h-32 items-center justify-center rounded-lg border border-border bg-surface-muted text-xs text-text-subtle">
					Gallery view
				</div>
			</div>
		</div>
	);
};
