import { listingCategories } from '@/data';
import { Button, Input, Select } from '@/components/ui';

const categoryOptions = listingCategories.map((category) => ({
	value: category.id,
	label: category.label
}));

export const Hero = (): JSX.Element => {
	return (
		<section className="rounded-xl border border-border bg-surface p-8 shadow-subtle">
			<div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
				<div className="space-y-4">
					<p className="text-xs font-semibold uppercase tracking-[0.3em] text-text-subtle">
						Local Link
					</p>
					<h1 className="text-3xl font-semibold text-text sm:text-4xl">
						Design your trip with locals who know the city best.
					</h1>
					<p className="text-base text-text-subtle">
						Discover curated experiences, trusted guides, and neighborhood favorites tailored to the
						way you travel.
					</p>
				</div>
				<div className="rounded-lg border border-border bg-surface-subtle p-5">
					<form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
						<Input label="Destination" placeholder="Where do you want to go?" />
						<Select
							label="Category"
							placeholder="All categories"
							options={categoryOptions}
						/>
						<Input label="Dates" placeholder="Add dates" />
						<Button type="submit" className="w-full">
							Search experiences
						</Button>
					</form>
				</div>
			</div>
		</section>
	);
};
