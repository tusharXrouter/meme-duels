import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';
import { useTransactionStore } from '@/stores/transaction.store';

export function TransactionBanner() {
  const { transactions, removeTransaction } = useTransactionStore();
  const [visibleTransactions, setVisibleTransactions] = useState<string[]>([]);

  // Show new transactions and auto-hide after delay
  useEffect(() => {
    transactions.forEach((tx) => {
      if (!visibleTransactions.includes(tx.id)) {
        setVisibleTransactions((prev) => [...prev, tx.id]);
        
        // Auto-hide after 5 seconds for confirmed/failed transactions
        if (tx.status === 'confirmed' || tx.status === 'failed') {
          setTimeout(() => {
            setVisibleTransactions((prev) => prev.filter((id) => id !== tx.id));
            removeTransaction(tx.signature);
          }, 5000);
        }
      }
    });
  }, [transactions, visibleTransactions, removeTransaction]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'confirming':
        return <Clock className="w-5 h-5 text-yellow-500 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'failed':
        return 'Failed';
      case 'confirming':
        return 'Confirming...';
      default:
        return 'Pending';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'border-green-500 bg-green-500/10';
      case 'failed':
        return 'border-red-500 bg-red-500/10';
      case 'confirming':
        return 'border-yellow-500 bg-yellow-500/10';
      default:
        return 'border-gray-500 bg-gray-500/10';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'Deposit';
      case 'withdrawal':
        return 'Withdrawal';
      case 'bet':
        return 'Bet';
      default:
        return 'Transaction';
    }
  };

  const formatSignature = (signature: string) => {
    return `${signature.slice(0, 8)}...${signature.slice(-8)}`;
  };

  const openExplorer = (signature: string) => {
    const explorerUrl = `https://solscan.io/tx/${signature}`;
    window.open(explorerUrl, '_blank');
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {transactions
          .filter((tx) => visibleTransactions.includes(tx.id))
          .map((tx) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`
                max-w-sm w-full p-4 rounded-lg border backdrop-blur-sm
                ${getStatusColor(tx.status)}
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(tx.status)}
                  <div>
                    <div className="font-semibold text-white">
                      {getTypeText(tx.type)} {getStatusText(tx.status)}
                    </div>
                    <div className="text-sm text-gray-400 font-mono">
                      {formatSignature(tx.signature)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openExplorer(tx.signature)}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                    title="View on Solscan"
                  >
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </button>
                  
                  <button
                    onClick={() => {
                      setVisibleTransactions((prev) => prev.filter((id) => id !== tx.id));
                      removeTransaction(tx.signature);
                    }}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                  >
                    <XCircle className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
}
