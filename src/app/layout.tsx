import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Store } from 'lucide-react';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({ subsets:['latin'],weight:['400','500','600','700'],variable:'--font-plus-jakarta',display:'swap' });

export const metadata: Metadata = { title: 'UMKM Tools — Small Business Dashboard', description: 'Dashboard UMKM: POS kasir, katalog, riwayat transaksi.' };

export default function RootLayout({ children }:Readonly<{children:ReactNode}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${jakarta.variable}`}>
        <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-5 sm:px-6">
          <header className="mb-6 flex items-center justify-between rounded-2xl border border-[#EDE0D4] bg-white px-5 py-3 shadow-sm">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D4784C] text-white"><Store size={18} /></div>
              <div><h1 className="text-base font-bold tracking-tight text-[#3D2B1F]">UMKM<span className="text-[#D4784C]">Tools</span></h1><p className="text-[10px] text-[#7A6B5D]">Small Business Dashboard</p></div>
            </Link>
            <nav className="flex gap-1.5">
              {[{href:'/',label:'Dashboard'},{href:'/items',label:'Katalog'},{href:'/history',label:'Riwayat'}].map(i=>(
                <Link key={i.href} href={i.href} className="rounded-full px-4 py-2 text-sm font-medium text-[#7A6B5D] transition-all hover:bg-[#FFF8F0] hover:text-[#3D2B1F]">{i.label}</Link>
              ))}
            </nav>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
