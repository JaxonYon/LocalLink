import { getLocalStorage, setLocalStorage } from '@/store/localStorage';

const SAVED_KEY = 'local_link_saved_items';

export interface SavedItem {
	listingId: string;
	savedAt: string;
}

export const getSavedItems = (): SavedItem[] => {
	return getLocalStorage<SavedItem[]>(SAVED_KEY, []);
};

export const isListingSaved = (listingId: string): boolean => {
	return getSavedItems().some((item) => item.listingId === listingId);
};

export const saveListing = (listingId: string): SavedItem[] => {
	const existing = getSavedItems();
	if (existing.some((item) => item.listingId === listingId)) {
		return existing;
	}
	const next = [...existing, { listingId, savedAt: new Date().toISOString() }];
	setLocalStorage(SAVED_KEY, next);
	return next;
};

export const removeSavedListing = (listingId: string): SavedItem[] => {
	const next = getSavedItems().filter((item) => item.listingId !== listingId);
	setLocalStorage(SAVED_KEY, next);
	return next;
};
