import type { Itinerary } from '@/types';
import { Button, Card } from '@/components/ui';

export interface ItineraryViewProps {
	itinerary: Itinerary;
	onCopy: () => void;
	onSave: () => void;
	copyLabel?: string;
	saveLabel?: string;
}

export const ItineraryView = ({
	itinerary,
	onCopy,
	onSave,
	copyLabel = 'Copy to clipboard',
	saveLabel = 'Save itinerary'
}: ItineraryViewProps): JSX.Element => {
	return (
		<section className="space-y-6">
			<div className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-5 shadow-subtle sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2 className="text-lg font-semibold text-text">{itinerary.destination} Itinerary</h2>
					<p className="text-sm text-text-subtle">{itinerary.summary}</p>
				</div>
				<div className="flex gap-2">
					<Button variant="outline" size="sm" onClick={onCopy}>
						{copyLabel}
					</Button>
					<Button variant="secondary" size="sm" onClick={onSave}>
						{saveLabel}
					</Button>
				</div>
			</div>
			<div className="space-y-4">
				{itinerary.days.map((day) => (
					<Card key={day.day} className="p-5">
						<div className="flex items-center justify-between border-b border-border pb-3">
							<p className="text-sm font-semibold text-text">Day {day.day}</p>
							<p className="text-xs text-text-subtle">{day.date}</p>
						</div>
						<div className="mt-4 space-y-4">
							{day.activities.map((activity, index) => (
								<div key={`${day.day}-${index}`} className="flex gap-4">
									<div className="text-xs font-semibold text-brand-700">{activity.time}</div>
									<div className="space-y-1">
										<p className="text-sm font-semibold text-text">{activity.title}</p>
										<p className="text-sm text-text-subtle">{activity.description}</p>
										<p className="text-xs text-text-subtle">{activity.location}</p>
									</div>
								</div>
							))}
						</div>
					</Card>
				))}
			</div>
		</section>
	);
};
