import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { usePrivy } from '@privy-io/react-auth';
import { useUserStore } from '@/stores/user.store';
import { apiClient } from '@/lib/api-client';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WithdrawModal({ isOpen, onClose }: WithdrawModalProps) {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [usdValue, setUsdValue] = useState(0);

  const { user } = usePrivy();
  const { balances, refreshBalances } = useUserStore();

  // Mock SOL price - in production, get from pricing service
  const solPrice = 225.50;

  const userBalance = balances?.['So11111111111111111111111111111111111111112'] || 0;

  useEffect(() => {
    const numAmount = parseFloat(amount) || 0;
    setUsdValue(numAmount * solPrice);
  }, [amount, solPrice]);

  useEffect(() => {
    if (isOpen) {
      // Ensure latest balances when opening the modal
      refreshBalances();
    }
  }, [isOpen, refreshBalances]);

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (parseFloat(amount) > userBalance) {
      toast.error('Insufficient balance');
      return;
    }

    if (!user?.wallet?.address) {
      toast.error('Wallet not connected');
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiClient.post('/wallet/withdraw', {
        amount: parseFloat(amount),
        userWalletAddress: user.wallet.address,
        userDid: user.id,
      });

      if (response.data.success) {
        toast.success(`Successfully withdrew ${amount} SOL`);
        await refreshBalances();
        setAmount('');
        onClose();
      } else {
        toast.error(response.data.error || 'Withdrawal failed');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Withdrawal failed';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const maxAmount = Math.floor((userBalance || 0) * 1000) / 1000; // Round down to 3 decimals
  const setPct = (pct: number) => {
    const val = Math.floor((userBalance * pct) * 1000) / 1000;
    setAmount(val > 0 ? val.toString() : '');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent >
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-bold">Withdraw</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Token Selection */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">Tokens</label>
            <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">SOL</span>
              </div>
              <span className="text-white font-medium">SOL</span>
              <span className="ml-auto px-2 py-1 bg-yellow-500 text-black text-xs font-bold rounded">
                FREE
              </span>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">Amount</label>
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type="number"
                  placeholder="0.109"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white text-lg h-14 pr-16"
                  step="0.001"
                  min="0.001"
                  max={maxAmount}
                  disabled={isLoading}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  SOL
                </div>
              </div>

              <div className="text-right">
                <span className="text-gray-400 text-sm">~${usdValue.toFixed(2)} USD</span>
                <div className="text-gray-400 text-sm">
                  Available: {userBalance.toFixed(3)} SOL
                </div>
              </div>
            </div>

            {/* Quick Selection Buttons */}
            <div className="flex gap-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPct(0.25)}
                disabled={userBalance <= 0}
                className="flex-1 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
              >
                25%
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPct(0.5)}
                disabled={userBalance <= 0}
                className="flex-1 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
              >
                50%
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAmount(maxAmount.toString())}
                disabled={maxAmount <= 0}
                className="flex-1 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
              >
                MAX
              </Button>
            </div>
          </div>

          {/* Fee Info */}
          <div className="text-center">
            <p className="text-green-400 text-sm font-medium">
              Enjoy 0% fees on SOL deposits & withdrawals!
            </p>
          </div>

          {/* Withdraw Button */}
          <Button
            onClick={handleWithdraw}
            disabled={
              isLoading ||
              !amount ||
              parseFloat(amount) <= 0 ||
              parseFloat(amount) > userBalance
            }
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold h-12 text-lg"
          >
            {isLoading ? 'PROCESSING...' : 'WITHDRAW NOW'}
          </Button>

          {/* Withdrawal Info */}
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Funds will be sent to your connected wallet
            </p>
            <p className="text-gray-500 text-xs mt-1">
              {user?.wallet?.address ?
                `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}` :
                'No wallet connected'
              }
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
