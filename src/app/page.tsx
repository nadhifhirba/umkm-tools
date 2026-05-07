'use client';

import Link from 'next/link';
import { ArrowRight, CalendarDays, Clock3, Package, Plus, ReceiptText, ShoppingCart } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { formatDateTime, isSameDay, rupiah } from '@/lib/receipt';

export default function DashboardPage() {
  const transactions = useAppStore((state) => state.transactions);
  const items = useAppStore((state) => state.items);

  const todayTransactions = transactions.filter((transaction) => isSameDay(transaction.date));
  const todaysRevenue = todayTransactions.reduce((sum, transaction) => sum + transaction.total, 0);
  const recentTransactions = transactions.slice(0, 5);

  const stats = [
    {
      label: 'Transaksi hari ini',
      value: todayTransactions.length.toString(),
      helper: 'Order masuk sejak pagi',
      icon: ReceiptText,
    },
    {
      label: 'Pendapatan hari ini',
      value: rupiah(todaysRevenue),
      helper: 'Total penjualan hari ini',
      icon: Clock3,
    },
    {
      label: 'Total item katalog',
      value: items.length.toString(),
      helper: 'Produk dan jasa aktif',
      icon: Package,
    },
  ];

  const actions = [
    { href: '/calculator', label: 'New Transaction', icon: ShoppingCart },
    { href: '/items', label: 'Add Item', icon: Plus },
    { href: '/history', label: 'View History', icon: CalendarDays },
  ];

  return (
    <div className="space-y-4">
      <section className="glass rounded-[28px] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-400/70">Dashboard</p>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-white">POS sederhana untuk UMKM</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Kelola transaksi, katalog produk, dan kirim struk langsung ke WhatsApp dalam satu alur cepat.
            </p>
          </div>
          <Link
            href="/calculator"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-400"
          >
            Mulai Kasir
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass rounded-[24px] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{stat.value}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-400">
                  <Icon size={18} />
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-400">{stat.helper}</p>
            </div>
          );
        })}
      </section>

      <section className="glass rounded-[28px] p-4">
        <p className="text-sm font-semibold text-white">Quick actions</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4 transition hover:border-orange-500/40 hover:bg-orange-500/10"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-400">
                    <Icon size={18} />
                  </div>
                  <span className="font-medium text-white">{action.label}</span>
                </div>
                <ArrowRight size={16} className="text-orange-300" />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="glass rounded-[28px] p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-white">Transaksi terbaru</p>
            <p className="text-sm text-slate-400">Pantau order terakhir yang tersimpan di perangkat ini.</p>
          </div>
          <Link href="/history" className="text-sm font-semibold text-orange-300 hover:text-orange-200">
            Lihat semua
          </Link>
        </div>

        <div className="mt-4 space-y-3">
          {recentTransactions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-sm text-slate-400">
              Belum ada transaksi. Coba buat transaksi pertama di menu Kasir.
            </div>
          ) : (
            recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900/70 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-white">{transaction.customerName || 'Pelanggan umum'}</p>
                  <p className="mt-1 text-sm text-slate-400">
                    {formatDateTime(transaction.date)} · {transaction.items.length} item
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <p className="text-lg font-semibold text-orange-300">{rupiah(transaction.total)}</p>
                  <Link href="/history" className="text-sm font-semibold text-slate-200 hover:text-white">
                    Detail
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
