'use client';

import { useEffect, useMemo, useState } from 'react';
import { Download, History, Search, Trash2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { buildWhatsappMessage, formatDateTime, rupiah } from '@/lib/receipt';

export default function HistoryPage() {
  const transactions = useAppStore((state) => state.transactions);
  const removeTransaction = useAppStore((state) => state.removeTransaction);

  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(transactions[0]?.id ?? null);

  useEffect(() => {
    if (!selectedId && transactions[0]?.id) {
      setSelectedId(transactions[0].id);
    }
  }, [selectedId, transactions]);
  const [message, setMessage] = useState('');

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return transactions;
    return transactions.filter((transaction) => transaction.customerName.toLowerCase().includes(term));
  }, [search, transactions]);

  const selected = filtered.find((transaction) => transaction.id === selectedId) ?? filtered[0] ?? null;

  const exportTransaction = () => {
    if (!selected) return;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(buildWhatsappMessage(selected))}`;
    if (typeof window !== 'undefined') {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }
    setMessage('Struk transaksi sudah disiapkan untuk WhatsApp.');
  };

  return (
    <div className="space-y-4">
      <section className="glass rounded-[28px] p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-400/70">Riwayat transaksi</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Lihat order yang sudah tersimpan</h2>
            <p className="mt-2 text-sm text-slate-400">Cari berdasarkan nama pelanggan, lalu buka detail atau ekspor ke WhatsApp.</p>
          </div>
          <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-3 text-orange-300">
            <History size={20} />
          </div>
        </div>
        {message ? <p className="mt-4 rounded-2xl border border-orange-500/20 bg-orange-500/10 px-4 py-3 text-sm text-orange-200">{message}</p> : null}
      </section>

      <label className="glass flex items-center gap-3 rounded-[28px] px-4 py-3">
        <Search size={18} className="text-slate-400" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cari nama pelanggan..."
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
        />
      </label>

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="glass rounded-[28px] p-5 text-sm text-slate-400">Belum ada transaksi yang cocok dengan pencarian.</div>
          ) : (
            filtered.map((transaction) => (
              <button
                key={transaction.id}
                type="button"
                onClick={() => setSelectedId(transaction.id)}
                className={`glass w-full rounded-[28px] p-4 text-left transition ${
                  selected?.id === transaction.id ? 'border-orange-500/50 bg-orange-500/10' : 'hover:border-orange-500/30 hover:bg-white/[0.06]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{transaction.customerName || 'Pelanggan umum'}</p>
                    <p className="mt-1 text-sm text-slate-400">{formatDateTime(transaction.date)}</p>
                  </div>
                  <p className="text-lg font-semibold text-orange-300">{rupiah(transaction.total)}</p>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3 text-sm text-slate-400">
                  <span>{transaction.items.length} item</span>
                  <span>{transaction.note || 'Tanpa catatan'}</span>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="glass rounded-[28px] p-4">
          {selected ? (
            <>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-400/70">Detail transaksi</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">{selected.customerName || 'Pelanggan umum'}</h3>
                  <p className="mt-1 text-sm text-slate-400">{formatDateTime(selected.date)}</p>
                </div>
                <button
                  type="button"
                  onClick={exportTransaction}
                  className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-400"
                >
                  <Download size={16} />
                  Export WA
                </button>
              </div>

              <div className="mt-4 space-y-3 rounded-[24px] border border-white/10 bg-slate-950/80 p-4">
                {selected.items.map((item) => (
                  <div key={`${selected.id}-${item.name}`} className="flex items-center justify-between gap-3 text-sm">
                    <div>
                      <p className="font-medium text-white">{item.name}</p>
                      <p className="text-slate-400">
                        {item.qty} x {rupiah(item.price)}
                      </p>
                    </div>
                    <p className="font-semibold text-orange-300">{rupiah(item.qty * item.price)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Total</p>
                  <p className="mt-2 text-lg font-semibold text-white">{rupiah(selected.total)}</p>
                </div>
                <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Item</p>
                  <p className="mt-2 text-lg font-semibold text-white">{selected.items.length}</p>
                </div>
                <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Catatan</p>
                  <p className="mt-2 text-sm font-medium text-white">{selected.note || 'Tidak ada catatan'}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={exportTransaction}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-400"
                >
                  <Download size={16} />
                  Kirim WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => removeTransaction(selected.id)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-rose-200 transition hover:border-rose-400/40 hover:bg-rose-500/10"
                >
                  <Trash2 size={16} />
                  Hapus Transaksi
                </button>
              </div>
            </>
          ) : (
            <div className="rounded-[24px] border border-dashed border-white/10 bg-white/5 p-6 text-sm text-slate-400">
              Pilih transaksi dari daftar untuk melihat detail dan menyiapkan ekspor WhatsApp.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
