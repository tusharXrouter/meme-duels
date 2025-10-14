import { create } from 'zustand';

export interface Transaction {
  id: string;
  signature: string;
  status: 'confirming' | 'confirmed' | 'failed';
  type: 'deposit' | 'withdrawal' | 'bet';
  timestamp: number;
}

interface TransactionState {
  transactions: Transaction[];
  
  // Actions
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void;
  updateTransactionStatus: (signature: string, status: Transaction['status']) => void;
  removeTransaction: (signature: string) => void;
  clearTransactions: () => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],

  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [
        ...state.transactions,
        {
          ...transaction,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
        },
      ],
    })),

  updateTransactionStatus: (signature, status) =>
    set((state) => ({
      transactions: state.transactions.map((tx) =>
        tx.signature === signature ? { ...tx, status } : tx
      ),
    })),

  removeTransaction: (signature) =>
    set((state) => ({
      transactions: state.transactions.filter((tx) => tx.signature !== signature),
    })),

  clearTransactions: () =>
    set({ transactions: [] }),
}));
