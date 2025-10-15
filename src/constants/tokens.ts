export const TOKEN_THEMES = {
	EMERALD: {
		color: '#10b981',
		gradient: 'from-emerald-500 to-emerald-600',
		cardGradient: 'from-emerald-900/40 to-emerald-950/40',
		textColor: 'text-emerald-400',
		borderColor: 'border-emerald-700',
	},
	PURPLE: {
		color: '#a855f7',
		gradient: 'from-purple-500 to-purple-600',
		cardGradient: 'from-purple-900/40 to-purple-950/40',
		textColor: 'text-purple-400',
		borderColor: 'border-purple-700',
	},
	ORANGE: {
		color: '#f97316',
		gradient: 'from-orange-500 to-orange-600',
		cardGradient: 'from-orange-900/40 to-orange-950/40',
		textColor: 'text-orange-400',
		borderColor: 'border-orange-700',
	},
	// Add more themes...
} as const;

export const CRYPTO_LOGOS = {
	BTC: '/images/bitcoin-btc-logo.png',
	SOL: '/images/solana-sol-logo.png',
	DOGE: '/images/dogecoin-doge-logo.png',
	Pump: '/images/pump-logo.png',
} as const;
