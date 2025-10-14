"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CreateDuelModal } from "@/components/CreateDuelModal";
import { usePrivy } from '@privy-io/react-auth';
import { useUserStore, UserProfile } from "@/stores/user.store";
import { DepositModal } from "@/components/DepositModal";
import { WithdrawModal } from "@/components/WithdrawModal";
import { authAPI } from "@/lib/api";
import { UsernameModal } from "@/components/UsernameModal";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Tooltip } from "./ui/tooltip";
import Image from "next/image";
import { usePathname } from 'next/navigation';

export const Header = () => {
  const { ready, authenticated, user, login, logout, getAccessToken } = usePrivy();
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [pendingAccessToken, setPendingAccessToken] = useState<string | null>(null);

  const { balances, userProfile, setAuthentication, clearAuthentication, setLoading, refreshBalances } = useUserStore();
  const pathname = usePathname();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 2)}...${address.slice(-4)}`;
  };

  const getTokenSymbol = (mint: string) => {
    const tokenMap: Record<string, string> = {
      'So11111111111111111111111111111111111111112': 'SOL',
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': 'USDC',
      'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': 'USDT',
    };
    return tokenMap[mint] || 'TOKEN';
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
            const responseWithUser = profileResponse as typeof profileResponse & { user?: UserProfile };
            let userData: UserProfile | undefined;
            
            if (profileResponse.data?.user) {
              userData = profileResponse.data.user;
            } else if (responseWithUser.user) {
              userData = responseWithUser.user;
            } else if (profileResponse.data && 'id' in profileResponse.data && 'username' in profileResponse.data && 'wallet_address' in profileResponse.data) {
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
  }, [authenticated, user, ready, userProfile, clearAuthentication, getAccessToken, refreshBalances, setAuthentication, setLoading]);

  return (
    <>
      <header className="flex items-center justify-between p-4 border-b border-border bg-[#0A0A0A] text-white">
        <div className="flex items-center gap-2">
          <Image src="/pumpduel.png" alt="pumpduels" className="w-6 h-6 md:w-10 md:h-10" width={40} height={40} />
          <span className="text-neon-green text-2xl font-bold hidden md:block">pumpwars</span>
          <div className="items-center gap-2 px-3 py-1 bg-neon-green/20 border border-neon-green rounded-lg hidden sm:flex">
            <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
            <span className="text-neon-green font-semibold">Live</span>
          </div>
        </div>


        <div className="flex items-center gap-4">

          {ready && authenticated && user ? (
            <div className="flex items-center gap-3">
              {/* Create Duel only on /war route */}
              {pathname?.startsWith('/war') && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="border-neon-green text-neon-green bg-neon-green/10 hover:bg-neon-green/30"
                  onClick={() => setShowCreateModal(true)}
                >
                  ⚔️ Create Duel
                </Button>
              )}

              <span className="hidden md:flex gap-2">
                {/* Deposit Button */}
                <Button
                  variant="secondary"
                  size="sm"
                  className={cn(
                    "border-neon-blue text-neon-blue bg-neon-blue/10 hover:bg-neon-blue/30 overflow-hidden transition-all duration-300 px-2",
                    "group relative flex items-center justify-center w-8 hover:w-28"
                  )}
                  style={{ minWidth: "2rem" }}
                  onClick={() => setShowDepositModal(true)}
                >
                  <span
                    className={cn(
                      "transition-all duration-200",
                      "group-hover:opacity-0 group-hover:translate-x-[-10px] text-2xl"
                    )}
                  >
                    💵
                  </span>
                  <span
                    className={cn(
                      "absolute left-0 right-0 mx-auto opacity-0 transition-all duration-200",
                      "group-hover:opacity-100 group-hover:translate-x-0"
                    )}
                    style={{ pointerEvents: "none" }}
                  >
                    💵 Deposit
                  </span>
                </Button>

                {/* Withdraw Button */}
                <Button
                  variant="secondary"
                  size="sm"
                  className={cn(
                    "border-yellow-500 text-yellow-500 bg-yellow-500/10 hover:bg-yellow-500/20 overflow-hidden transition-all duration-300 px-2",
                    "group relative flex items-center justify-center w-8 hover:w-28"
                  )}
                  style={{ minWidth: "2rem" }}
                  onClick={() => setShowWithdrawModal(true)}
                >
                  <span
                    className={cn(
                      "transition-all duration-200",
                      "group-hover:opacity-0 group-hover:translate-x-[-10px] text-xl"
                    )}
                  >
                    📤
                  </span>
                  <span
                    className={cn(
                      "absolute left-0 right-0 mx-auto opacity-0 transition-all duration-200",
                      "group-hover:opacity-100 group-hover:translate-x-0"
                    )}
                    style={{ pointerEvents: "none" }}
                  >
                    📤 Withdraw
                  </span>
                </Button>
              </span>

              {/* User Info with Disconnect Tooltip */}
              <Tooltip
                content={
                  <span className="flex flex-col gap-2 w-40">
                    <span className="md:hidden flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-yellow-500 text-yellow-500 bg-yellow-500/10 w-full"
                        onClick={() => setShowDepositModal(true)}
                      >
                        💵 Deposit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-yellow-500 text-yellow-500 bg-yellow-500/10 w-full"
                        onClick={() => setShowWithdrawModal(true)}
                      >
                        📤 Withdraw
                      </Button>
                    </span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={logout}
                      className="hover:text-red-300 hover:bg-red-500/20 w-full"
                    >
                      Disconnect
                    </Button>
                  </span>
                }
                side="bottom"
                align="start"
              >
                <Button
                  className="border-2 bg-neon-green/20 border-neon-green hover:bg-neon-green/90 h-10"
                  disabled={!ready}
                >
                  <div className="font-semibold">@{userProfile?.username || "you"}</div>
                  <div className="text-muted-foreground hidden sm:block">
                    {user.wallet?.address ? formatAddress(user.wallet.address) : 'No wallet'}
                  </div>
                </Button>
              </Tooltip>

              {/* Balances */}
              <div className="flex items-center gap-2 text-sm">
                {Object.entries(balances).map(([mint, balance]) => (
                  <div key={mint} className="px-2 py-1 bg-background/50 rounded">
                    <span className="text-muted-foreground">{getTokenSymbol(mint)}: </span>
                    <span className="text-neon-green font-semibold">
                      {Number(balance).toFixed(3)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Button
              className="bg-neon-green text-background hover:bg-neon-green/90 neon-glow"
              onClick={login}
              disabled={!ready}
            >
              {!ready ? 'Loading...' : 'Connect Wallet'}
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
