export const canUseStorage = (): boolean => {
	return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
};

export const getLocalStorage = <T>(key: string, fallback: T): T => {
	if (!canUseStorage()) {
		return fallback;
	}

	try {
		const raw = window.localStorage.getItem(key);
		if (raw === null) {
			return fallback;
		}
		return JSON.parse(raw) as T;
	} catch {
		return fallback;
	}
};

export const setLocalStorage = <T>(key: string, value: T): void => {
	if (!canUseStorage()) {
		return;
	}

	try {
		window.localStorage.setItem(key, JSON.stringify(value));
	} catch {
		// Ignore write errors to keep UI resilient.
	}
};

export const removeLocalStorage = (key: string): void => {
	if (!canUseStorage()) {
		return;
	}

	try {
		window.localStorage.removeItem(key);
	} catch {
		// Ignore remove errors.
	}
};
