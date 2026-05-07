'use client';

import { useMemo, useState } from 'react';
import { Minus, Plus, Printer, Receipt, Send, Trash2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import {
  buildWhatsappMessage,
  calculateTotals,
  compactRupiah,
  makeId,
  rupiah,
  type CartItem,
  type DiscountType,
} from '@/lib/receipt';

const formatNumberInput = (value: string) => value.replace(/[^\d]/g, '');

export default function CalculatorPage() {
  const items = useAppStore((state) => state.items);
  const addTransaction = useAppStore((state) => state.addTransaction);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [note, setNote] = useState('');
  const [discountType, setDiscountType] = useState<DiscountType>('percent');
  const [discountValue, setDiscountValue] = useState('0');
  const [calculationVisible, setCalculationVisible] = useState(false);
  const [status, setStatus] = useState('');

  const calculation = useMemo(
    () => calculateTotals(cart, discountType, Number(discountValue || 0)),
    [cart, discountType, discountValue],
  );

  const addToCart = (name: string, price: number) => {
    setCalculationVisible(false);
    setStatus('');
    setCart((current) => {
      const found = current.find((item) => item.name === name);
      if (found) {
        return current.map((item) => (item.name === name ? { ...item, qty: item.qty + 1 } : item));
      }
      return [...current, { name, price, qty: 1 }];
    });
  };

  const changeQty = (name: string, delta: number) => {
    setCalculationVisible(false);
    setCart((current) =>
      current
        .map((item) => (item.name === name ? { ...item, qty: Math.max(1, item.qty + delta) } : item))
        .filter(Boolean),
    );
  };

  const removeFromCart = (name: string) => {
    setCalculationVisible(false);
    setCart((current) => current.filter((item) => item.name !== name));
  };

  const handleCalculate = () => {
    setCalculationVisible(true);
    setStatus('Perhitungan selesai. Total final siap disimpan.');
  };

  const handleSaveAndWhatsapp = () => {
    if (cart.length === 0) {
      setStatus('Keranjang masih kosong. Tambahkan item terlebih dahulu.');
      return;
    }

    const finalCalculation = calculateTotals(cart, discountType, Number(discountValue || 0));
    const transaction = {
      id: makeId('tx'),
      items: cart,
      total: finalCalculation.total,
      date: new Date().toISOString(),
      note,
      customerName,
    };

    addTransaction(transaction);

    const message = buildWhatsappMessage(transaction);
    const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

    if (typeof window !== 'undefined') {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }

    setCart([]);
    setCustomerName('');
    setNote('');
    setDiscountValue('0');
    setDiscountType('percent');
    setCalculationVisible(false);
    setStatus('Transaksi tersimpan dan link WhatsApp sudah dibuka.');
  };

  const hasDiscount = calculation.discountAmount > 0;

  return (
    <div className="space-y-4">
      <section className="glass rounded-[28px] p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-400/70">POS Terminal</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Kasir cepat untuk transaksi harian</h2>
            <p className="mt-2 text-sm text-slate-400">Tap item di kiri, atur jumlah di kanan, lalu kirim struk ke WhatsApp.</p>
          </div>
          <div className="hidden rounded-2xl border border-orange-500/20 bg-orange-500/10 p-3 text-orange-300 sm:block">
            <Receipt size={20} />
          </div>
        </div>
        {status ? <p className="mt-4 rounded-2xl border border-orange-500/20 bg-orange-500/10 px-4 py-3 text-sm text-orange-200">{status}</p> : null}
      </section>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="glass rounded-[28px] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">Katalog produk</p>
              <p className="text-sm text-slate-400">Klik untuk menambahkan item ke keranjang.</p>
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
              {items.length} item
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => addToCart(item.name, item.price)}
                className="group flex min-h-[112px] flex-col justify-between rounded-[22px] border border-white/10 bg-slate-900/80 p-4 text-left transition active:scale-[0.99] hover:border-orange-500/40 hover:bg-orange-500/10"
              >
                <div>
                  <p className="text-sm font-semibold text-white group-hover:text-orange-100">{item.name}</p>
                  <p className="mt-1 text-xs text-slate-400">{item.category}</p>
                </div>
                <p className="text-lg font-semibold text-orange-300">{rupiah(item.price)}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="glass rounded-[28px] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">Keranjang transaksi</p>
              <p className="text-sm text-slate-400">Atur kuantitas sebelum simpan.</p>
            </div>
            <button
              type="button"
              onClick={() => setCart([])}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-orange-500/40 hover:bg-orange-500/10"
            >
              <Trash2 size={14} />
              Kosongkan
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {cart.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/60 p-5 text-sm text-slate-400">
                Keranjang masih kosong. Pilih item dari katalog untuk mulai menghitung.
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.name} className="rounded-[22px] border border-white/10 bg-slate-900/80 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{item.name}</p>
                      <p className="mt-1 text-sm text-slate-400">{compactRupiah(item.price)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.name)}
                      className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 hover:border-orange-500/40 hover:text-orange-200"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="inline-flex items-center rounded-2xl border border-white/10 bg-black/20">
                      <button
                        type="button"
                        onClick={() => changeQty(item.name, -1)}
                        className="touch-target flex min-w-11 items-center justify-center rounded-l-2xl px-3 text-orange-300 hover:bg-orange-500/10"
                      >
                        <Minus size={16} />
                      </button>
                      <div className="min-w-12 px-4 py-3 text-center text-sm font-semibold text-white">{item.qty}</div>
                      <button
                        type="button"
                        onClick={() => changeQty(item.name, 1)}
                        className="touch-target flex min-w-11 items-center justify-center rounded-r-2xl px-3 text-orange-300 hover:bg-orange-500/10"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-orange-300">{rupiah(item.price * item.qty)}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 space-y-3 rounded-[24px] border border-white/10 bg-slate-950/80 p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-2 text-sm">
                <span className="text-slate-300">Nama pelanggan</span>
                <input
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="Contoh: Budi"
                  className="touch-target w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-orange-500/60"
                />
              </label>
              <label className="space-y-2 text-sm">
                <span className="text-slate-300">Catatan</span>
                <input
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Contoh: tanpa es"
                  className="touch-target w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-orange-500/60"
                />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-[1fr_0.7fr]">
              <label className="space-y-2 text-sm">
                <span className="text-slate-300">Diskon</span>
                <input
                  value={discountValue}
                  onChange={(event) => setDiscountValue(formatNumberInput(event.target.value))}
                  inputMode="numeric"
                  placeholder="0"
                  className="touch-target w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-orange-500/60"
                />
              </label>
              <label className="space-y-2 text-sm">
                <span className="text-slate-300">Tipe diskon</span>
                <select
                  value={discountType}
                  onChange={(event) => setDiscountType(event.target.value as DiscountType)}
                  className="touch-target w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-orange-500/60"
                >
                  <option value="percent">Persen (%)</option>
                  <option value="fixed">Nominal tetap</option>
                </select>
              </label>
            </div>

            <button
              type="button"
              onClick={handleCalculate}
              className="touch-target inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-orange-500/30 bg-orange-500/15 px-4 font-semibold text-orange-200 transition hover:bg-orange-500/25"
            >
              <Printer size={16} />
              Hitung
            </button>

            {calculationVisible ? (
              <div className="space-y-2 rounded-[22px] border border-orange-500/20 bg-orange-500/10 p-4 text-sm">
                <div className="flex items-center justify-between gap-3 text-slate-200">
                  <span>Subtotal</span>
                  <span>{rupiah(calculation.subtotal)}</span>
                </div>
                <div className="flex items-center justify-between gap-3 text-slate-200">
                  <span>Diskon</span>
                  <span>- {rupiah(calculation.discountAmount)}</span>
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-orange-500/20 pt-2 text-base font-semibold text-white">
                  <span>Total bayar</span>
                  <span>{rupiah(calculation.total)}</span>
                </div>
              </div>
            ) : null}

            <div className="space-y-2 rounded-[22px] border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between gap-3 text-sm text-slate-300">
                <span>Running total</span>
                <span className="font-semibold text-white">{rupiah(calculation.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-sm text-slate-300">
                <span>Diskon aktif</span>
                <span className="font-semibold text-orange-300">{hasDiscount ? `- ${rupiah(calculation.discountAmount)}` : 'Rp 0'}</span>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-2 text-lg font-semibold text-white">
                <span>Total akhir</span>
                <span>{rupiah(calculation.total)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveAndWhatsapp}
              className="touch-target inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-4 font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-400"
            >
              <Send size={16} />
              Simpan & Kirim WhatsApp
            </button>

            <p className="text-xs leading-5 text-slate-400">
              Struk akan tersimpan ke riwayat lokal, lalu WhatsApp terbuka dengan pesan siap kirim.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
