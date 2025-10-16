'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function LandingHero() {
	const coinImages = [
		{ name: 'DOGE', src: '/meme-avatars/pengu.png' },
		{ name: 'PEPE', src: '/meme-avatars/pepe.png' },
		{ name: 'SHIB', src: '/meme-avatars/image.png' },
		{ name: 'BONK', src: '/meme-avatars/bonk.png' },
	];

	const getRandomCoins = () => {
		const shuffled = [...coinImages].sort(() => Math.random() - 0.5);
		return {
			left: shuffled[0],
			right: shuffled[1],
		};
	};

	const { left: leftCoin, right: rightCoin } = getRandomCoins();

	return (
		<div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
			<div className="pointer-events-none absolute inset-0 h-full w-full">
				<img
					src="/colosseum_bw.png"
					alt="Background"
					className="h-full w-full object-cover "
					style={{ minHeight: '100vh', minWidth: '100vw' }}
				/>
				<div className="absolute inset-0 bg-black/75 backdrop-blur-[2px]" />
			</div>

			<div className="fixed top-0 z-10 flex w-full items-center justify-between px-[60px] py-7">
				<Image
					src="/new-logo.png"
					alt="pumpduels"
					className="h-32 w-36"
					width={400}
					height={400}
				/>
			</div>

			<div className="relative z-50 flex flex-col items-center gap-6 px-6 text-center">
				<h1 className="text-6xl font-[family-name:var(--font-gladiator)] font-extrabold tracking-tight text-white md:text-7xl lg:text-8xl drop-shadow-md">
					<span className="block">MEME</span>
					<span className="block">WARS</span>
				</h1>

				<p className="text-base text-slate-600 pb-10 pt-0">
					Choose your token, join the fray, and let the memes battle it out.
				</p>

				<div className="flex items-center gap-4">
					<Link
						href="/war"
						className="rounded-sm bg-[#BA863A] px-10 py-3 font-semibold text-black transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2"
					>
						Enter Arena
					</Link>
				</div>
			</div>

			{/* Left & Right tokens */}
			<div className="px-2">
				<div
					className="token token-left"
					role="img"
					aria-label="Left token approaching"
				>
					<div className="token-coin">
						<Image
							src={leftCoin.src}
							alt={`${leftCoin.name} coin`}
							height={500}
							width={500}
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
							src={rightCoin.src}
							alt={`${rightCoin.name} coin`}
							height={500}
							width={500}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
