import { PrivyProvider } from '@/components/providers/privy-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { AppToaster } from '@/components/ToasterClient';
import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const gladiator = localFont({
	src: '../../public/fonts/GladiatorArenaDemoRegular.ttf',
	variable: '--font-gladiator',
});

export const metadata: Metadata = {
	title: 'Meme Wars',
	description:
		'Choose your token, join the fray, and let the memes battle it out.',
	icons: {
		icon: [
			{
				url: '/favicons/android-chrome-192x192.png',
				sizes: '192x192',
				type: 'image/png',
			},
			{
				url: '/favicons/favicon-32x32.png',
				sizes: '32x32',
				type: 'image/png',
			},
			{ url: '/favicons/favicon.ico', sizes: 'any' },
		],
		apple: '/favicons/apple-touch-icon.png',
		other: [
			{
				rel: 'icon',
				url: '/favicons/android-chrome-512x512.png',
				sizes: '512x512',
			},
			{
				rel: 'android-chrome',
				url: '/favicons/android-chrome-512x512.png',
				sizes: '512x512',
			},
		],
	},
	manifest: '/favicons/site.webmanifest',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`h-full dark ${GeistSans.className} ${gladiator.variable} bg-[#0A0A0A]`}
			>
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
