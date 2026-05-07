import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { CartItem, CatalogItem, Transaction } from './receipt';
import { makeId } from './receipt';

const memoryStorage = (() => {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
  };
})();

type AddTransactionInput = Omit<Transaction, 'id' | 'date'> & {
  id?: string;
  date?: string;
};

type UpdateItemInput = Partial<Omit<CatalogItem, 'id'>>;

type StoreState = {
  transactions: Transaction[];
  items: CatalogItem[];
  addTransaction: (transaction: AddTransactionInput) => void;
  removeTransaction: (id: string) => void;
  addItem: (item: Omit<CatalogItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: UpdateItemInput) => void;
};

const demoItems: CatalogItem[] = [
  { id: makeId('item'), name: 'Nasi Goreng', price: 18000, category: 'Makanan' },
  { id: makeId('item'), name: 'Mie Goreng', price: 17000, category: 'Makanan' },
  { id: makeId('item'), name: 'Ayam Geprek', price: 22000, category: 'Makanan' },
  { id: makeId('item'), name: 'Es Teh Manis', price: 7000, category: 'Minuman' },
  { id: makeId('item'), name: 'Es Kopi Susu', price: 15000, category: 'Minuman' },
  { id: makeId('item'), name: 'Jus Alpukat', price: 20000, category: 'Minuman' },
  { id: makeId('item'), name: 'Jasa Antar', price: 10000, category: 'Jasa' },
  { id: makeId('item'), name: 'Jasa Bungkus', price: 3000, category: 'Jasa' },
  { id: makeId('item'), name: 'Kerupuk', price: 5000, category: 'Lainnya' },
  { id: makeId('item'), name: 'Paket Hemat', price: 30000, category: 'Lainnya' },
];

const safeStorage = createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : memoryStorage));

export const useAppStore = create<StoreState>()(
  persist(
    (set) => ({
      transactions: [],
      items: demoItems,
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [
            {
              id: transaction.id ?? makeId('tx'),
              items: transaction.items,
              total: transaction.total,
              date: transaction.date ?? new Date().toISOString(),
              note: transaction.note,
              customerName: transaction.customerName,
            },
            ...state.transactions,
          ],
        })),
      removeTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((transaction) => transaction.id !== id),
        })),
      addItem: (item) =>
        set((state) => ({
          items: [{ id: makeId('item'), ...item }, ...state.items],
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      updateItem: (id, updates) =>
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
        })),
    }),
    {
      name: 'umkm-simple-tools',
      storage: safeStorage,
      partialize: (state) => ({ items: state.items, transactions: state.transactions }),
    },
  ),
);
