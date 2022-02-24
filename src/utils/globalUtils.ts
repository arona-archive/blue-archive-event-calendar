export const isNonNullable = <T extends object>(value: T | null): value is NonNullable<T> => {
	return !!value;
};

export const sleep = async (ms: number): Promise<void> => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};
