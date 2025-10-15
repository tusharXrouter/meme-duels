export const formatPrice = (price: string): string => {
	// Handle scientific notation and format currency
	if (price.includes('e+')) {
		const num = parseFloat(price);
		return `$${num.toLocaleString()}`;
	}
	return price;
};

export const generateTokenId = (tokenName: string): string => {
	return `${tokenName.toLowerCase()}-${Date.now()}`;
};

export const getTokenInitial = (tokenName: string): string => {
	return tokenName.charAt(0).toUpperCase();
};
