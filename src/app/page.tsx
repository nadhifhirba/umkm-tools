'use client';

import Link from 'next/link';
import { ArrowRight, CalendarDays, Package, Plus, ReceiptText, ShoppingCart, TrendingUp } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { rupiah, isSameDay } from '@/lib/receipt';

export default function DashboardPage() {
  const transactions = useAppStore((s) => s.transactions);
  const items = useAppStore((s) => s.items);

  const todayTx = transactions.filter(tx => isSameDay(tx.date));
  const todayRevenue = todayTx.reduce((s,tx) => s + tx.total, 0);
  const totalRevenue = transactions.reduce((s,tx) => s + tx.total, 0);

  return (
    <div className="space-y-8">
      {/* Hero — daily overview */}
      <section className="marketet-card bg-gradient-to-br from-[#D4784C] to-[#B8653A] p-6 text-white sm:p-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-sm">
              <CalendarDays size={12} /> Hari Ini
            </span>
            <div>
              <div className="text-sm text-white/80">Pendapatan Hari Ini</div>
              <div className="mt-1 text-4xl font-black">{rupiah(todayRevenue)}</div>
            </div>
            <div className="flex gap-4 text-sm text-white/70">
              <span>{todayTx.length} transaksi</span>
              <span>{items.length} item katalog</span>
            </div>
          </div>
          <div className="flex items-end justify-end gap-2">
            <Link href="/calculator" className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#D4784C] transition-all hover:bg-white/90">
              <Plus size={14} className="inline mr-1.5" />Transaksi Baru
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label:'Transaksi Hari Ini', value:todayTx.length, icon:ShoppingCart },
          { label:'Pendapatan Hari Ini', value:rupiah(todayRevenue), icon:TrendingUp },
          { label:'Total Pendapatan', value:rupiah(totalRevenue), icon:ReceiptText },
          { label:'Item Katalog', value:items.length, icon:Package },
        ].map(s=>{const I=s.icon;return(
          <div key={s.label} className="market-card text-center">
            <I size={18} className="mx-auto mb-2 text-[#D4784C]" />
            <div className="text-xl font-bold text-[#3D2B1F]">{s.value}</div>
            <div className="text-[10px] text-[#7A6B5D] uppercase tracking-[0.1em] mt-1">{s.label}</div>
          </div>
        )})}
      </div>

      {/* Recent transactions */}
      <section>
        <h2 className="mb-3 text-lg font-bold text-[#3D2B1F]">Transaksi Terbaru</h2>
        <div className="space-y-2">
          {transactions.slice(0,5).map(tx=>(
            <div key={tx.id} className="market-card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5B8C3E]/10">
                  <ReceiptText size={14} className="text-[#5B8C3E]" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{tx.items?.length || 0} item</p>
                  <p className="text-[10px] text-[#7A6B5D]">{new Date(tx.date).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
              <span className="text-sm font-bold text-[#5B8C3E]">{rupiah(tx.total)}</span>
            </div>
          ))}
          {transactions.length === 0 && (
            <div className="market-card p-8 text-center text-[#7A6B5D]">Belum ada transaksi.</div>
          )}
        </div>
      </section>
    </div>
  );
}
