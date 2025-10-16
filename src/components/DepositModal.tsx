import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/lib/api-client';
import { useTransactionStore } from '@/stores/transaction.store';
import { useUserStore } from '@/stores/user.store';
import { usePrivy, useSolanaWallets } from '@privy-io/react-auth';
import { Connection, Transaction } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface DepositModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function DepositModal({ isOpen, onClose }: DepositModalProps) {
	const [amount, setAmount] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [depositAddress, setDepositAddress] = useState('');
	const [usdValue, setUsdValue] = useState(0);

	const { user } = usePrivy();
	const { wallets } = useSolanaWallets();
	const { refreshBalances } = useUserStore();
	const { addTransaction, updateTransactionStatus } = useTransactionStore();

	// Mock SOL price - in production, get from pricing service
	const solPrice = 225.5;

	useEffect(() => {
		if (isOpen) {
			fetchDepositAddress();
		}
	}, [isOpen]);

	useEffect(() => {
		const numAmount = parseFloat(amount) || 0;
		setUsdValue(numAmount * solPrice);
	}, [amount, solPrice]);

	const fetchDepositAddress = async () => {
		try {
			const response = await apiClient.get('/wallet/deposit-address');
			if (response.data.success) {
				setDepositAddress(response.data.depositAddress);
			}
		} catch {
			toast.error('Failed to get deposit address');
		}
	};

	const handleDeposit = async () => {
		if (!amount || parseFloat(amount) <= 0) {
			toast.error('Please enter a valid amount');
			return;
		}

		if (!user?.wallet?.address) {
			toast.error('Wallet not connected');
			return;
		}

		setIsLoading(true);

		try {
			// Create deposit transaction on backend
			const response = await apiClient.post('/wallet/deposit', {
				amount: parseFloat(amount),
				userWalletAddress: user.wallet.address,
				userDid: user.id,
			});

			if (response.data.success) {
				// Get the user's wallet for signing
				const walletAddress = user?.wallet?.address;
				if (!walletAddress) {
					throw new Error('Wallet not connected');
				}
				const wallet = wallets.find((w) => w.address === walletAddress);
				if (!wallet) {
					throw new Error('Wallet not found');
				}

				const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL as string;
				if (!rpcUrl) {
					throw new Error('Missing NEXT_PUBLIC_SOLANA_RPC_URL');
				}

				// Deserialize and send transaction
				const connection = new Connection(rpcUrl);
				const transaction = Transaction.from(
					Buffer.from(response.data.transaction, 'base64')
				);

				// Request user signature and send
				const signature = await wallet.sendTransaction(transaction, connection);

				if (signature) {
					// Add transaction to banner system
					addTransaction({
						signature,
						status: 'confirming',
						type: 'deposit',
					});

					// Confirm deposit on backend
					const confirmResponse = await apiClient.post(
						'/wallet/deposit/confirm',
						{
							signature: signature,
						}
					);

					if (confirmResponse.data.success) {
						updateTransactionStatus(signature, 'confirmed');
						toast.success(`Successfully deposited ${amount} SOL`);
						await refreshBalances();
						setAmount('');
						onClose();
					} else {
						updateTransactionStatus(signature, 'failed');
						toast.error(
							`Deposit confirmation failed: ${
								confirmResponse.data.error || 'Unknown error'
							}`
						);
					}
				} else {
					toast.error('Deposit cancelled or not signed');
				}
			} else {
				toast.error(response.data.error || 'Deposit failed');
			}
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : 'Deposit failed';
			toast.error(message);
			if (typeof error === 'object' && error !== null && 'signature' in error) {
				const possibleSignature = (error as { signature?: unknown }).signature;
				if (typeof possibleSignature === 'string') {
					updateTransactionStatus(possibleSignature, 'failed');
				}
			}
		} finally {
			setIsLoading(false);
		}
	};

	const maxAmount = 100; // Set a reasonable max for demo
	const setPct = (pct: number) => {
		setAmount(pct.toString());
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="text-white text-xl font-bold">
						Deposit SOL
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-6">
					{/* Amount Input */}
					<div>
						<Label htmlFor="amount" className="text-gray-400 text-sm">
							Amount (SOL)
						</Label>
						<Input
							id="amount"
							type="number"
							placeholder="0.0"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							className="bg-gray-800 border-gray-700 text-white mt-2"
							disabled={isLoading}
							step="0.001"
							min="0.001"
							max={maxAmount}
						/>
						<div className="flex justify-between text-xs text-gray-500 mt-1">
							<span>≈ ${usdValue.toFixed(2)} USD</span>
							<span>Max: {maxAmount} SOL</span>
						</div>
					</div>

					{/* Quick Amount Buttons */}
					<div className="flex gap-2">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => setPct(0.01)}
							className="flex-1 bg-gray-700 text-gray-300 hover:bg-gray-800"
						>
							0.01
						</Button>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => setPct(0.02)}
							className="flex-1 bg-gray-700 text-gray-300 hover:bg-gray-800"
						>
							0.02
						</Button>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => setPct(0.05)}
							className="flex-1 bg-gray-700 text-gray-300 hover:bg-gray-800"
						>
							0.05
						</Button>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => setPct(0.1)}
							className="flex-1 bg-gray-700 text-gray-300 hover:bg-gray-800"
						>
							0.1
						</Button>
					</div>

					{/* Deposit Address (if available) */}
					{depositAddress && (
						<div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
							<Label className="text-gray-400 text-sm">Deposit Address</Label>
							<div className="flex items-center gap-2 mt-1">
								<code className="text-xs text-gray-300 bg-gray-900 px-2 py-1 rounded flex-1">
									{depositAddress}
								</code>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => navigator.clipboard.writeText(depositAddress)}
									className="border-gray-700 text-gray-300 hover:bg-gray-800"
								>
									Copy
								</Button>
							</div>
						</div>
					)}

					{/* Action Button */}
					<Button
						onClick={handleDeposit}
						disabled={!amount || parseFloat(amount) <= 0 || isLoading}
						className="w-full bg-neon-green hover:bg-neon-green/90 text-black font-bold h-12 text-lg"
					>
						{isLoading ? 'Processing...' : 'Deposit SOL'}
					</Button>

					{/* Info */}
					<div className="text-xs text-gray-500 text-center">
						Deposits are processed on the Solana network.
						<br />
						Minimum deposit: 0.001 SOL
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
