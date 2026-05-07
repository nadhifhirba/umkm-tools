export type CatalogItem = {
  id: string;
  name: string;
  price: number;
  category: string;
};

export type CartItem = {
  name: string;
  qty: number;
  price: number;
};

export type Transaction = {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  note: string;
  customerName: string;
};

export type DiscountType = 'percent' | 'fixed';

export type Calculation = {
  subtotal: number;
  discountAmount: number;
  total: number;
};

export const rupiah = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Math.max(0, value));

export const compactRupiah = (value: number) =>
  `Rp ${new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 0,
  }).format(Math.max(0, value))}`;

export const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));

export const formatDateOnly = (value: string) =>
  new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
  }).format(new Date(value));

export const isSameDay = (left: string, right: Date = new Date()) => {
  const a = new Date(left);
  return (
    a.getFullYear() === right.getFullYear() &&
    a.getMonth() === right.getMonth() &&
    a.getDate() === right.getDate()
  );
};

export const calculateTotals = (
  items: CartItem[],
  discountType: DiscountType,
  discountValue: number,
): Calculation => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const safeDiscountValue = Number.isFinite(discountValue) ? Math.max(0, discountValue) : 0;

  let discountAmount = 0;
  if (discountType === 'percent') {
    discountAmount = subtotal * (safeDiscountValue / 100);
  } else {
    discountAmount = safeDiscountValue;
  }

  discountAmount = Math.min(subtotal, Math.max(0, discountAmount));

  return {
    subtotal,
    discountAmount,
    total: Math.max(0, subtotal - discountAmount),
  };
};

export const buildWhatsappMessage = (
  transaction: {
    items: CartItem[];
    total: number;
    customerName?: string;
    note?: string;
  },
  options?: {
    includeHeading?: boolean;
  },
) => {
  const heading = options?.includeHeading ?? true;
  const lines = transaction.items.map((item) => `${item.qty}x ${item.name} — ${compactRupiah(item.price * item.qty)}`);

  const parts: string[] = [];
  if (heading) parts.push('🧾 Struk UMKM Tools');
  if (transaction.customerName) parts.push(`Pelanggan: ${transaction.customerName}`);
  if (transaction.note) parts.push(`Catatan: ${transaction.note}`);
  if (parts.length) parts.push('');
  parts.push(...lines);
  parts.push('', `Total: ${compactRupiah(transaction.total)}`, '', 'Terima kasih!');

  return parts.join('\n');
};

export const makeId = (prefix = 'id') =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
