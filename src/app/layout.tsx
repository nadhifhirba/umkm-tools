import type { ReactNode } from 'react';
import Link from 'next/link';
import { Calculator, History, Home, LayoutGrid, Package } from 'lucide-react';
import './globals.css';

export const metadata = {
  title: 'UMKM Simple Tools',
  description: 'POS calculator dan ekspor WhatsApp untuk UMKM',
};

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/calculator', label: 'Kasir', icon: Calculator },
  { href: '/items', label: 'Item', icon: Package },
  { href: '/history', label: 'Riwayat', icon: History },
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body>
        <div className="min-h-screen text-slate-100">
          <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-orange-500/30 bg-orange-500/15 text-orange-400 shadow-[0_0_30px_rgba(249,115,22,0.2)]">
                  <LayoutGrid size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.5em] text-orange-400/70">
                    UMKM_TOOLS
                  </p>
                  <h1 className="text-lg font-semibold tracking-wide text-white">Simple Tools</h1>
                </div>
              </Link>

              <nav className="flex flex-wrap gap-2 text-sm">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-slate-200 transition hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-200"
                    >
                      <Icon size={15} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </header>

          <main className="mx-auto w-full max-w-7xl px-4 py-4 pb-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
