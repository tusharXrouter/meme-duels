'use client';

import { CreateDuelModal } from '@/components/CreateDuelModal';
import { DepositModal } from '@/components/DepositModal';
import { Button } from '@/components/ui/button';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { UsernameModal } from '@/components/UsernameModal';
import { WithdrawModal } from '@/components/WithdrawModal';
import { authAPI } from '@/lib/api';
import { UserProfile, useUserStore } from '@/stores/user.store';
import { shortenAddress } from '@/utils';
import { usePrivy } from '@privy-io/react-auth';
import { Loader2, Wallet } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import CopyButton from './ui/copy-button';
import { Separator } from './ui/separator';

export const HEADER_NAVIGATION = [{ name: 'Wars', href: '/war' }];

export const Header = () => {
	const { ready, authenticated, user, login, logout, getAccessToken } =
		usePrivy();
	const [showDepositModal, setShowDepositModal] = useState(false);
	const [showWithdrawModal, setShowWithdrawModal] = useState(false);
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [showUsernameModal, setShowUsernameModal] = useState(false);
	const [pendingAccessToken, setPendingAccessToken] = useState<string | null>(
		null
	);

	const {
		balances,
		userProfile,
		setAuthentication,
		clearAuthentication,
		setLoading,
		refreshBalances,
	} = useUserStore();
	const pathname = usePathname();

	const formatAddress = (address: string) => {
		return `${address.slice(0, 2)}...${address.slice(-4)}`;
	};

	const getTokenSymbol = (mint: string) => {
		const tokenMap: Record<string, string> = {
			So11111111111111111111111111111111111111112: 'SOL',
			EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: 'USDC',
			Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB: 'USDT',
		};
		return tokenMap[mint] || 'TOKEN';
	};

	const renderTokenSymbol = (mint: string) => {
		const symbol = getTokenSymbol(mint);
		const iconMap: Record<string, string> = {
			So11111111111111111111111111111111111111112: '/chainLogos/solana.svg',
		};

		const iconPath = iconMap[mint];
		if (iconPath) {
			return (
				<>
					<Image
						src={iconPath}
						alt={symbol}
						width={16}
						height={16}
						className="w-3 h-3"
					/>
				</>
			);
		}
		return symbol;
	};

	// Handle authentication when user connects wallet
	useEffect(() => {
		const handleAuthentication = async () => {
			if (authenticated && user && ready && !userProfile) {
				// Only authenticate if user is connected but not yet authenticated in our store
				try {
					setLoading(true);

					// Get Privy access token
					const accessToken = await getAccessToken();
					if (!accessToken) {
						throw new Error('Failed to get access token');
					}

					// Verify token with our backend and get user profile (or prompt for username)
					const profileResponse = await authAPI.verifyToken(accessToken);
					console.log('Auth response:', profileResponse); // Debug log

					if (profileResponse.success) {
						// Handle different possible response structures
						const responseWithUser =
							profileResponse as typeof profileResponse & {
								user?: UserProfile;
							};
						let userData: UserProfile | undefined;

						if (profileResponse.data?.user) {
							userData = profileResponse.data.user;
						} else if (responseWithUser.user) {
							userData = responseWithUser.user;
						} else if (
							profileResponse.data &&
							'id' in profileResponse.data &&
							'username' in profileResponse.data &&
							'wallet_address' in profileResponse.data
						) {
							userData = profileResponse.data as unknown as UserProfile;
						}

						if (userData) {
							setAuthentication(accessToken, userData);
							toast.success('Connected successfully!');
						} else {
							throw new Error('User data not found in response');
						}
					} else if (profileResponse.code === 'USERNAME_REQUIRED') {
						setPendingAccessToken(accessToken);
						setShowUsernameModal(true);
					} else {
						throw new Error(profileResponse.error || 'Failed to verify user');
					}
				} catch (error) {
					console.error('Authentication error:', error);
					toast.error('Failed to authenticate user');
					clearAuthentication();
				} finally {
					setLoading(false);
				}
			} else if (!authenticated && userProfile) {
				// User disconnected, clear auth state
				clearAuthentication();
			}
		};

		handleAuthentication();
	}, [
		authenticated,
		user,
		ready,
		userProfile,
		clearAuthentication,
		getAccessToken,
		refreshBalances,
		setAuthentication,
		setLoading,
	]);

	return (
		<>
			<header className="flex items-center justify-between px-6 bg-app">
				<div className="flex items-center gap-8">
					<Link href="/">
						<Image
							src="/new-logo.png"
							alt="pumpduels"
							className="h-32 w-36"
							width={400}
							height={400}
						/>
					</Link>

					<nav className="hidden md:flex items-center gap-6 pl-10">
						{HEADER_NAVIGATION.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className={`text-lg font-light transition-colors hover:text-primary ${
									pathname === item.href
										? 'text-primary'
										: 'text-muted-foreground'
								}`}
							>
								{item.name}
							</Link>
						))}
					</nav>
				</div>

				<div className="flex items-center gap-4">
					{ready && authenticated && user ? (
						<div className="flex items-center gap-5">
							{/* Create Duel only on /war route */}
							{pathname?.startsWith('/war') && (
								<Button onClick={() => setShowCreateModal(true)}>
									Create Duel
								</Button>
							)}

							<span className="hidden md:flex gap-2">
								{/* Deposit Button */}
								<Button
									onClick={() => setShowDepositModal(true)}
									className="bg-[#526FFF] rounded-sm hover:bg-[#526FFF]/70 text-black"
								>
									Deposit
								</Button>
							</span>

							{/* User Info with Disconnect Popover */}
							<Popover>
								<PopoverTrigger asChild>
									<Button variant={'outline'} disabled={!ready}>
										<Wallet />
										<span className="text-sm">
											@{userProfile?.username || 'you'}
										</span>
										<Separator orientation="vertical" />
										<span>
											{Object.entries(balances).map(([mint, balance]) => (
												<div key={mint} className="flex items-center">
													{renderTokenSymbol(mint)}
													<span className="text-neon-green pl-1">
														{Number(balance).toFixed(3)}
													</span>
												</div>
											))}
										</span>
									</Button>
								</PopoverTrigger>
								<PopoverContent  align="end">
									<div className="flex flex-col gap-2">
										<div className="flex items-start justify-between">
											<p className="text-sm font-semibold text-[var(--primary)]">
												Account
											</p>
											<div className="flex space-x-2">
												{user.wallet?.address && (
													<p className="mt-1 text-xs text-[var(--brand-secondary)]">
														{shortenAddress(user.wallet?.address)}
													</p>
												)}
												<CopyButton
													textToCopy={user.wallet?.address}
													disabled={!user.wallet?.address}
													variant="ghost"
													size="icon"
													className="h-6 w-6 text-[var(--brand-secondary)] hover:text-[var(--primary)]"
													aria-label="Copy Solana address"
												/>
											</div>
										</div>
										<div className="flex flex-col gap-2">
											<Button
												variant="outline"
												onClick={() => setShowWithdrawModal(true)}
												className="border-2"
											>
												Withdraw
											</Button>
											<Button
												variant="destructive"
												onClick={logout}
												className="hover:text-red-300 hover:bg-red-500/20 w-full"
											>
												Disconnect
											</Button>
										</div>
									</div>
								</PopoverContent>
							</Popover>
						</div>
					) : (
						<Button
							className="bg-neon-green/10 text-neon-green border border-neon-green px-6 py-5 rounded-sm w-44"
							onClick={login}
							disabled={!ready}
						>
							{!ready ? <Loader2 className="animate-spin" /> : 'Connect Wallet'}
						</Button>
					)}
				</div>
			</header>

			{/* Modals */}
			<DepositModal
				isOpen={showDepositModal}
				onClose={() => setShowDepositModal(false)}
			/>
			<WithdrawModal
				isOpen={showWithdrawModal}
				onClose={() => setShowWithdrawModal(false)}
			/>
			<CreateDuelModal
				isOpen={showCreateModal}
				onClose={() => setShowCreateModal(false)}
			/>
			{pendingAccessToken && (
				<UsernameModal
					isOpen={showUsernameModal}
					onClose={() => setShowUsernameModal(false)}
					accessToken={pendingAccessToken}
				/>
			)}
		</>
	);
};
