import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { fetchAdminBanners, createAdminBanner, deleteAdminBanner } from '../services/api';
import toast from 'react-hot-toast';

export const AdminBanners = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    image: '',
    link: '/shop',
    buttonText: 'Shop Now',
    badge: 'NEW DROP',
  });

  const { data: banners = [], isLoading } = useQuery({
    queryKey: ['admin-banners'],
    queryFn: fetchAdminBanners,
  });

  const createMutation = useMutation({
    mutationFn: createAdminBanner,
    onSuccess: () => {
      toast.success('Banner created');
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
      queryClient.invalidateQueries({ queryKey: ['banners'] });
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to create banner'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminBanner,
    onSuccess: () => {
      toast.success('Banner deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
      queryClient.invalidateQueries({ queryKey: ['banners'] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(form);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-zinc-950 uppercase tracking-tight">
            Homepage Hero Banners ({banners.length})
          </h1>
          <p className="text-xs text-zinc-500 mt-1">Configure high-resolution slide imagery and promotional headlines.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-zinc-950 text-white rounded-xl text-xs font-bold uppercase flex items-center gap-2"
        >
          <Plus size={16} /> New Banner
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p className="text-xs text-zinc-400">Loading banners...</p>
        ) : (
          banners.map((b) => (
            <div key={b._id} className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm flex flex-col justify-between">
              <div className="relative aspect-[16/9] bg-zinc-900">
                <img src={b.image} alt={b.title} className="w-full h-full object-cover brightness-75" />
                {b.badge && (
                  <span className="absolute top-3 left-3 bg-brand-400 text-black text-[10px] font-black uppercase px-2 py-0.5 rounded">
                    {b.badge}
                  </span>
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-900">{b.title}</h3>
                  <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2">{b.subtitle}</p>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-zinc-100 mt-3 text-xs">
                  <span className="text-zinc-400">Target: {b.link}</span>
                  <button
                    onClick={() => deleteMutation.mutate(b._id)}
                    className="p-1.5 text-red-500 hover:text-red-700 rounded hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl z-10 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-200">
              <h3 className="font-bold text-sm uppercase text-zinc-900">Add Hero Banner</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-zinc-700 block mb-1">Headline *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. NEW WAVE STREETWEAR"
                  className="w-full p-2.5 border rounded-lg uppercase"
                />
              </div>
              <div>
                <label className="font-bold text-zinc-700 block mb-1">Subtitle</label>
                <textarea
                  rows={2}
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className="w-full p-2.5 border rounded-lg"
                />
              </div>
              <div>
                <label className="font-bold text-zinc-700 block mb-1">Image URL *</label>
                <input
                  type="text"
                  required
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 border rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Badge Text</label>
                  <input
                    type="text"
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    className="w-full p-2.5 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Target Link</label>
                  <input
                    type="text"
                    value={form.link}
                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                    className="w-full p-2.5 border rounded-lg"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 bg-zinc-950 text-white rounded-lg font-bold uppercase">
                  Create Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
