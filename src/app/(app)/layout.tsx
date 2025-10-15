import React from 'react';
import { type ReactNode } from 'react';
import { Header } from '@/components/Header';

const AppLayout = ({ children }: { children: ReactNode }) => {
	return (
		<>
			<Header />
			<main className="flex-1 overflow-hidden">{children}</main>
		</>
	);
};

export default AppLayout;
