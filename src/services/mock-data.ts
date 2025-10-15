import { CRYPTO_LOGOS, TOKEN_THEMES } from '@/constants/tokens';
import { Competition } from '@/types/token';

export const mockCompetitions: Competition[] = [
	{
		id: '1',
		isLive: true,
		token1: {
			name: 'PUMP',
			fullName: 'BACK PUMP',
			poolSize: '0.001 SOL',
			stake: '0 SOL',
			price: '$0.0041',
			...TOKEN_THEMES.EMERALD,
			image: CRYPTO_LOGOS.BTC,
		},
		token2: {
			name: 'SOL',
			fullName: 'BACK SOL',
			poolSize: '0.001 SOL',
			stake: '0 SOL',
			price: '$2.0e+2',
			...TOKEN_THEMES.PURPLE,
			image: CRYPTO_LOGOS.SOL,
		},
	},
	// Add more competitions...
];

export const getActiveCompetitions = (): Competition[] => {
	return mockCompetitions.filter((comp) => comp.isLive);
};

export const getCompetitionById = (id: string): Competition | undefined => {
	return mockCompetitions.find((comp) => comp.id === id);
};
