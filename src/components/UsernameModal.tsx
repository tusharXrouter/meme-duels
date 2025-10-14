import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { authAPI } from '@/lib/api';
import { useUserStore, UserProfile } from '@/stores/user.store';

interface UsernameModalProps {
  isOpen: boolean;
  onClose: () => void;
  accessToken: string;
}

export function UsernameModal({ isOpen, onClose, accessToken }: UsernameModalProps) {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setAuthentication, refreshBalances } = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast.error('Please enter a username');
      return;
    }

    if (username.length < 3) {
      toast.error('Username must be at least 3 characters long');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await authAPI.verifyToken(accessToken, username.trim());
      console.log('Username modal response:', response); // Debug log
      
      if (response.success) {
        // Handle different possible response structures
        const responseWithUser = response as typeof response & { user?: UserProfile };
        let userData: UserProfile | undefined;
        
        if (response.data?.user) {
          userData = response.data.user;
        } else if (responseWithUser.user) {
          userData = responseWithUser.user;
        } else if (response.data && 'id' in response.data && 'username' in response.data && 'wallet_address' in response.data) {
          userData = response.data as unknown as UserProfile;
        }
        
        if (userData) {
          setAuthentication(accessToken, userData);
          toast.success('Username set successfully!');
          onClose();
        } else {
          toast.error('User data not found in response');
        }
      } else {
        toast.error(response.error || 'Failed to set username');
      }
    } catch (error: unknown) {
      console.error('Username submission error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to set username';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-bold">Choose Your Username</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="username" className="text-gray-400 text-sm">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white mt-2"
              disabled={isLoading}
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-1">
              This will be your display name in the duels
            </p>
          </div>

          <Button
            type="submit"
            disabled={!username.trim() || isLoading}
            className="w-full bg-neon-green hover:bg-neon-green/90 text-black font-bold h-12 text-lg"
          >
            {isLoading ? 'Setting Username...' : 'Set Username'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
