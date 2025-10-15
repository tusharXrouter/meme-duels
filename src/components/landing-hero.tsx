'use client';

import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

const GLADIATOR_FONT = 'var(--font-gladiator), "Trajan Pro", "Cinzel", "Times New Roman", serif)';

export default function LandingHero() {
	// Stable deterministic values for SSR consistency
	const leftDrops = React.useMemo(
		() =>
			Array.from({ length: 12 }, (_, i) => ({
				startX: 5 + ((i * 7) % 26),
				delay: (i % 6) * 0.35,
				duration: 4 + (i % 5),
				scale: 0.8 + (i % 4) * 0.15,
			})),
		[]
	);

	const rightDrops = React.useMemo(
		() =>
			Array.from({ length: 12 }, (_, i) => ({
				startX: 5 + ((i * 9) % 28),
				delay: (i % 5) * 0.4,
				duration: 4 + ((i + 2) % 5),
				scale: 0.8 + (i % 3) * 0.18,
			})),
		[]
	);

	const coinImages = [
		{ name: 'DOGE', src: '/images/coins/doge.jpg' },
		{ name: 'PEPE', src: '/images/coins/pepe.jpg' },
		{ name: 'SHIB', src: '/images/coins/shib.jpg' },
		{ name: 'BONK', src: '/images/coins/bonk.jpg' },
	];

	return (
		<div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
			<div className="pointer-events-none absolute inset-0 h-full w-full">
				<img
					src="/backgrounds/battlefield.png"
					alt="Background"
					className="h-full w-full object-cover "
					style={{ minHeight: '100vh', minWidth: '100vw' }}
				/>
				<div className="absolute inset-0 bg-black/50" />
			</div>

			<div className="fixed top-0 z-10 flex w-full items-center justify-between px-[60px] py-7">
				<Image
					src="/new-logo.png"
					alt="pumpduels"
					className="h-28 w-28"
					width={40}
					height={40}
				/>
			</div>

			<div className="relative z-50 flex flex-col items-center gap-6 px-6 text-center">
				<h1 className="text-5xl font-extrabold tracking-tight text-white md:text-7xl lg:text-8xl drop-shadow-md">
					<span className="block"  style={{ fontFamily: GLADIATOR_FONT }}>MEME</span>
					<span className="block"  style={{ fontFamily: GLADIATOR_FONT }}>WARS</span>
				</h1>

				<p className="max-w-prose text-gray-500 font-sans text-base leading-relaxed opacity-80 md:text-lg">
					Choose your token, join the fray, and let the memes battle it out.
				</p>

				<div className="flex items-center gap-4">
					<Link
						href="/war"
						className="rounded-md bg-[#e11d48] px-5 py-2.5 font-semibold text-black shadow-[0_0_0_2px_#e11d48] transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2"
					>
						Enter Arena
					</Link>
				</div>
			</div>

			{/* Left & Right tokens */}
			<div className="px-2">
				{' '}
				<div
					className="token token-left"
					role="img"
					aria-label="Left token approaching"
				>
					<div className="token-coin">
						<Image
							src={coinImages[0].src}
							alt="DOGE coin"
							fill
							className="token-img"
						/>
					</div>
				</div>
				<div
					className="token token-right"
					role="img"
					aria-label="Right token approaching"
				>
					<div className="token-coin">
						<Image
							src={coinImages[1].src}
							alt="PEPE coin"
							fill
							className="token-img"
						/>
					</div>
				</div>{' '}
			</div>

			<div className="fixed bottom-0 z-10 flex w-full items-center justify-between text-center px-6 py-6">
				<p className="flex justify-center text-gray-600 text-center">
					Choose your token, join the fray, and let the memes battle it out.
				</p>
			</div>
		</div>
	);
}
