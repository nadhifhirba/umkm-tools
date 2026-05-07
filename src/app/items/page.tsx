'use client';

import { useMemo, useState } from 'react';
import { Check, Edit3, Plus, Trash2, Package } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { rupiah } from '@/lib/receipt';

const categories = ['Makanan', 'Minuman', 'Jasa', 'Lainnya'] as const;

type FormState = {
  name: string;
  price: string;
  category: (typeof categories)[number];
};

const emptyForm: FormState = {
  name: '',
  price: '',
  category: 'Makanan',
};

export default function ItemsPage() {
  const items = useAppStore((state) => state.items);
  const addItem = useAppStore((state) => state.addItem);
  const removeItem = useAppStore((state) => state.removeItem);
  const updateItem = useAppStore((state) => state.updateItem);

  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const grouped = useMemo(() => {
    return categories.map((category) => ({
      category,
      items: items.filter((item) => item.category === category),
    }));
  }, [items]);

  const startEdit = (id: string) => {
    const target = items.find((item) => item.id === id);
    if (!target) return;

    setEditingId(id);
    setForm({
      name: target.name,
      price: String(target.price),
      category: target.category as FormState['category'],
    });
    setMessage(`Mode edit aktif untuk ${target.name}.`);
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const saveItem = () => {
    if (!form.name.trim()) {
      setMessage('Nama item wajib diisi.');
      return;
    }

    const price = Number(form.price);
    if (!Number.isFinite(price) || price <= 0) {
      setMessage('Harga harus lebih dari 0.');
      return;
    }

    if (editingId) {
      updateItem(editingId, {
        name: form.name.trim(),
        price,
        category: form.category,
      });
      setMessage('Item berhasil diperbarui.');
    } else {
      addItem({
        name: form.name.trim(),
        price,
        category: form.category,
      });
      setMessage('Item baru berhasil ditambahkan.');
    }

    resetForm();
  };

  return (
    <div className="space-y-4">
      <section className="glass rounded-[28px] p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-400/70">Manajemen item</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Kelola katalog produk dan jasa</h2>
            <p className="mt-2 text-sm text-slate-400">Tambah, ubah, atau hapus item agar kasir selalu siap dipakai.</p>
          </div>
          <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-3 text-orange-300">
            <Package size={20} />
          </div>
        </div>
        {message ? <p className="mt-4 rounded-2xl border border-orange-500/20 bg-orange-500/10 px-4 py-3 text-sm text-orange-200">{message}</p> : null}
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="glass rounded-[28px] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-400">
              {editingId ? <Edit3 size={18} /> : <Plus size={18} />}
            </div>
            <div>
              <p className="font-semibold text-white">{editingId ? 'Edit item' : 'Tambah item baru'}</p>
              <p className="text-sm text-slate-400">Semua harga memakai Rupiah.</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <label className="space-y-2 text-sm">
              <span className="text-slate-300">Nama item</span>
              <input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Contoh: Roti Bakar"
                className="touch-target w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-orange-500/60"
              />
            </label>

            <label className="space-y-2 text-sm">
              <span className="text-slate-300">Harga</span>
              <input
                value={form.price}
                onChange={(event) => setForm((current) => ({ ...current, price: event.target.value.replace(/[^\d]/g, '') }))}
                inputMode="numeric"
                placeholder="25000"
                className="touch-target w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-orange-500/60"
              />
            </label>

            <label className="space-y-2 text-sm">
              <span className="text-slate-300">Kategori</span>
              <select
                value={form.category}
                onChange={(event) => setForm((current) => ({ ...current, category: event.target.value as FormState['category'] }))}
                className="touch-target w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-orange-500/60"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={saveItem}
                className="touch-target inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-4 font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-400"
              >
                <Check size={16} />
                {editingId ? 'Simpan Perubahan' : 'Tambah Item'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="touch-target inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 font-semibold text-slate-200 transition hover:border-orange-500/40 hover:bg-orange-500/10"
              >
                Batal
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {grouped.map((group) => (
            <section key={group.category} className="glass rounded-[28px] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">{group.category}</p>
                  <p className="text-sm text-slate-400">{group.items.length} item</p>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                  {group.category}
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {group.items.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-400">
                    Belum ada item di kategori ini.
                  </div>
                ) : (
                  group.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-3 rounded-[22px] border border-white/10 bg-slate-900/80 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-semibold text-white">{item.name}</p>
                        <p className="mt-1 text-sm text-orange-300">{rupiah(item.price)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(item.id)}
                          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-orange-500/40 hover:bg-orange-500/10"
                        >
                          <Edit3 size={15} />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-rose-200 hover:border-rose-400/40 hover:bg-rose-500/10"
                        >
                          <Trash2 size={15} />
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
