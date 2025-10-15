import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { QueryProvider } from '@/components/providers/query-provider';
import { PrivyProvider } from '@/components/providers/privy-provider';
import { Buffer } from 'buffer';
import process from 'process';
import { AppToaster } from '@/components/ToasterClient';

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
		>
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" type="image/png" href="/favicon.png" />
				<meta
					name="description"
					content="Meme Wars - A fun meme dueling application"
				/>
				<title>Meme Wars</title>
			</head>
			<body className={`h-full dark  ${GeistSans.className} bg-[var(--background)] text-foreground`}>
				<PrivyProvider>
					<QueryProvider>
						{children}
						<AppToaster />
					</QueryProvider>
				</PrivyProvider>
			</body>
		</html>
	);
}
