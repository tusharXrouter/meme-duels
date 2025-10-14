import { useState, useMemo, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { usePrivy } from '@privy-io/react-auth';
import { duelsAPI, tokensAPI } from '@/lib/api';

interface UITokenInfo {
  address: string;
  symbol: string;
  name: string;
  logoURI?: string;
  decimals?: number;
  price?: number;
}

interface CreateDuelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateDuelModal({ isOpen, onClose }: CreateDuelModalProps) {
  const { ready, authenticated } = usePrivy();
  const [tokenA, setTokenA] = useState<UITokenInfo | null>(null);
  const [tokenB, setTokenB] = useState<UITokenInfo | null>(null);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tokens, setTokens] = useState<UITokenInfo[]>([]);
  const [loadingTokens, setLoadingTokens] = useState(false);

const canCreate = useMemo(() => {
    return !!tokenA && !!tokenB && tokenA.symbol !== tokenB.symbol && (name.trim().length > 0);
  }, [tokenA, tokenB, name]);

  const autofillName = () => {
    if (tokenA && tokenB) {
      setName(`${tokenA.symbol} vs ${tokenB.symbol}`);
    }
  };

  const handleCreate = async () => {
    if (!authenticated) {
      toast.error('Please connect your wallet to create a duel');
      return;
    }
    if (!canCreate) return;
    setIsLoading(true);
    try {
      const res = await duelsAPI.createDuel({
        name: name.trim(),
        token_a_mint: tokenA?.address ?? '',
        token_b_mint: tokenB?.address ?? '',
        token_a_name: tokenA!.name,
        token_b_name: tokenB!.name,
        token_a_symbol: tokenA!.symbol,
        token_b_symbol: tokenB!.symbol,
        token_a_start_price: tokenA!.price || 0,
        token_b_start_price: tokenB!.price || 0,
      });
      if (res.success) {
        toast.success('Duel created');
        setTokenA(null); setTokenB(null); setName('');
        onClose();
        
        // Trigger refresh of duels list
        window.dispatchEvent(new CustomEvent('duel-created'));
      } else {
        toast.error(res.error || 'Failed to create duel');
      }
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to create duel';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch supported tokens from backend
  useEffect(() => {
    const load = async () => {
      if (!isOpen) return;
      setLoadingTokens(true);
      try {
        const res = await tokensAPI.getSupportedTokens();
        console.log("supported tokens - ", res, res.success, res.tokens)
        if (res.success && res.tokens) {
          // Map to UITokenInfo if needed
          const items: UITokenInfo[] = res.tokens.map((t) => ({
            address: t.address,
            symbol: t.symbol,
            name: t.name,
            logoURI: t.logoURI,
            decimals: t.decimals,
          }));
          setTokens(items);
        } else {
          toast.error(res.error || 'Failed to load supported tokens');
        }
      } catch {
        toast.error('Failed to load supported tokens');
      } finally {
        setLoadingTokens(false);
      }
    };
    load();
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-bold">Create Duel</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Token A Selection */}
            <div>
              <Label className="block text-gray-400 text-sm mb-2">Token A</Label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {loadingTokens && (
                  <div className="text-gray-400 text-sm">Loading tokens…</div>
                )}
                {!loadingTokens && tokens.length === 0 && (
                  <div className="text-gray-400 text-sm">No supported tokens available</div>
                )}
                {tokens.map((token) => (
                  <button
key={`${token.symbol}-${token.address ?? 'nomint'}`}
                    onClick={() => setTokenA(token)}
                    className={`w-full p-3 rounded-lg border transition-colors ${
                      tokenA?.address === token.address
                        ? 'border-neon-green bg-neon-green/10'
                        : 'border-gray-700 hover:border-gray-600 bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{token.symbol[0]}</span>
                      </div>
                      <div className="text-left">
                        <div className="text-white font-semibold">{token.symbol}</div>
                        <div className="text-gray-400 text-sm">{token.name}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Token B Selection */}
            <div>
              <Label className="block text-gray-400 text-sm mb-2">Token B</Label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {loadingTokens && (
                  <div className="text-gray-400 text-sm">Loading tokens…</div>
                )}
                {!loadingTokens && tokens.length === 0 && (
                  <div className="text-gray-400 text-sm">No supported tokens available</div>
                )}
                {tokens.map((token) => (
                  <button
key={`${token.symbol}-${token.address ?? 'nomint'}`}
                    onClick={() => setTokenB(token)}
                    className={`w-full p-3 rounded-lg border transition-colors ${
                      tokenB?.address === token.address
                        ? 'border-neon-green bg-neon-green/10'
                        : 'border-gray-700 hover:border-gray-600 bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{token.symbol[0]}</span>
                      </div>
                      <div className="text-left">
                        <div className="text-white font-semibold">{token.symbol}</div>
                        <div className="text-gray-400 text-sm">{token.name}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="duel-name" className="block text-gray-400 text-sm mb-2">Duel Name</Label>
            <div className="flex gap-2">
              <Input
                id="duel-name"
                placeholder="e.g. BONK vs SOL"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Button
                variant="outline"
                onClick={autofillName}
                disabled={!tokenA || !tokenB}
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Autofill
              </Button>
            </div>
          </div>

          <div className="text-xs text-gray-400">
            Uses Birdeye token search (server-side). Ensure tokens are valid mints on the selected cluster.
          </div>

          <Button
            onClick={handleCreate}
            disabled={!canCreate || !ready || isLoading}
            className="w-full bg-neon-green hover:bg-neon-green/90 text-black font-bold h-12 text-lg"
          >
            {isLoading ? 'CREATING...' : 'CREATE DUEL'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
