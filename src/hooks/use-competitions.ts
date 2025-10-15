'use client';
import { getActiveCompetitions } from '@/services/mock-data';
import { Competition, TokenData } from '@/types/token';
import { useEffect, useState } from 'react';

export const useCompetitions = () => {
	const [competitions, setCompetitions] = useState<Competition[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchCompetitions = async () => {
			try {
				setLoading(true);
				// Simulate API call
				await new Promise((resolve) => setTimeout(resolve, 1000));
				const data = getActiveCompetitions();
				setCompetitions(data);
			} catch (err) {
				setError('Failed to fetch competitions');
			} finally {
				setLoading(false);
			}
		};

		fetchCompetitions();
	}, []);

	const handleTokenSelect = (token: TokenData) => {
		console.log('Token selected:', token);
		// Handle token selection logic
	};

	return {
		competitions,
		loading,
		error,
		handleTokenSelect,
	};
};
