'use client';

import { PrivyProvider as Privy } from '@privy-io/react-auth';
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';

export function PrivyProvider({ children }: { children: React.ReactNode }) {
	const cluster = (process.env.NEXT_PUBLIC_SOLANA_CLUSTER || 'mainnet-beta') as
		| 'mainnet-beta'
		| 'devnet'
		| 'testnet';

	const blockExplorerUrl =
		cluster === 'devnet'
			? 'https://solscan.io/?cluster=devnet'
			: cluster === 'testnet'
			? 'https://solscan.io/?cluster=testnet'
			: 'https://solscan.io';

	return (
		<Privy
			appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'clt1234567890abcdef'}
			config={{
				loginMethods: ['wallet', 'google', 'email', 'twitter'],
				appearance: {
					landingHeader: 'Welcome to Meme Wars',
					loginMessage: 'Enroll into the war madness',
					showWalletLoginFirst: true,
					walletChainType: 'solana-only',
					theme: 'dark',
          accentColor:  '#0a0a0a',
					walletList: ['detected_wallets', 'phantom', 'solflare', 'backpack'],
				},
				externalWallets: {
					solana: {
						connectors: toSolanaWalletConnectors({
							shouldAutoConnect: true,
						}),
					},
				},
				solanaClusters: [
					{
						name: cluster,
						rpcUrl:
							process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
							'https://api.mainnet-beta.solana.com',
						blockExplorerUrl,
					},
				],
				// Add debugging and better error handling
				embeddedWallets: {
					createOnLogin: 'users-without-wallets',
				},
				mfa: {
					noPromptOnMfaRequired: false,
				},
			}}
		>
			{children}
		</Privy>
	);
}
