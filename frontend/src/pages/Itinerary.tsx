import { useState } from 'react';

import { ItineraryForm, ItineraryView } from '@/components/itinerary';
import { Card } from '@/components/ui';
import { generateItinerary } from '@/services';
import { saveItinerary } from '@/store';
import type { Itinerary as ItineraryType, ItineraryInput } from '@/types';

const formatItineraryForCopy = (itinerary: ItineraryType): string => {
	const lines: string[] = [];
	lines.push(`${itinerary.destination} Itinerary`);
	lines.push(itinerary.summary);
	lines.push('');
	itinerary.days.forEach((day) => {
		lines.push(`Day ${day.day} - ${day.date}`);
		day.activities.forEach((activity) => {
			lines.push(`- ${activity.time} ${activity.title} (${activity.location})`);
		});
		lines.push('');
	});
	return lines.join('\n');
};

export const Itinerary = (): JSX.Element => {
	const [itinerary, setItinerary] = useState<ItineraryType | null>(null);
	const [isGenerating, setIsGenerating] = useState<boolean>(false);
	const [copyLabel, setCopyLabel] = useState<string>('Copy to clipboard');
	const [saveLabel, setSaveLabel] = useState<string>('Save itinerary');

	const handleGenerate = async (input: ItineraryInput): Promise<void> => {
		setIsGenerating(true);
		const result = await generateItinerary(input);
		setItinerary(result);
		setIsGenerating(false);
		setCopyLabel('Copy to clipboard');
		setSaveLabel('Save itinerary');
	};

	const handleCopy = async (): Promise<void> => {
		if (!itinerary) {
			return;
		}
		const text = formatItineraryForCopy(itinerary);
		if (navigator.clipboard?.writeText) {
			await navigator.clipboard.writeText(text);
			setCopyLabel('Copied');
			setTimeout(() => setCopyLabel('Copy to clipboard'), 2000);
			return;
		}
		setCopyLabel('Copy not supported');
		setTimeout(() => setCopyLabel('Copy to clipboard'), 2000);
	};

	const handleSave = (): void => {
		if (!itinerary) {
			return;
		}
		saveItinerary(itinerary);
		setSaveLabel('Saved');
		setTimeout(() => setSaveLabel('Save itinerary'), 2000);
	};

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-2xl font-semibold text-text">AI Trip Itinerary Builder</h1>
				<p className="text-sm text-text-subtle">
					Create a tailored plan for your next trip with a guided template.
				</p>
			</div>
			<Card className="grid gap-8 p-6 lg:grid-cols-[1.1fr_1fr]">
				<div className="space-y-4">
					<h2 className="text-lg font-semibold text-text">Trip details</h2>
					<ItineraryForm onGenerate={handleGenerate} isSubmitting={isGenerating} />
				</div>
				<div className="space-y-4">
					<h2 className="text-lg font-semibold text-text">Preview</h2>
					{itinerary ? (
						<ItineraryView
							itinerary={itinerary}
							onCopy={handleCopy}
							onSave={handleSave}
							copyLabel={copyLabel}
							saveLabel={saveLabel}
						/>
					) : (
						<p className="text-sm text-text-subtle">
							Generate an itinerary to see your plan here.
						</p>
					)}
				</div>
			</Card>
		</div>
	);
};
