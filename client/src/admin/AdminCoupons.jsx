import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Tag, X } from 'lucide-react';
import { fetchAdminCoupons, createAdminCoupon, deleteAdminCoupon } from '../services/api';
import toast from 'react-hot-toast';

export const AdminCoupons = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 999,
    maxDiscountAmount: 500,
    expiryDate: '2028-12-31',
  });

  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: fetchAdminCoupons,
  });

  const createMutation = useMutation({
    mutationFn: createAdminCoupon,
    onSuccess: () => {
      toast.success('Coupon created');
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to create coupon'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminCoupon,
    onSuccess: () => {
      toast.success('Coupon deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({
      ...form,
      discountValue: Number(form.discountValue),
      minOrderAmount: Number(form.minOrderAmount),
      maxDiscountAmount: form.maxDiscountAmount ? Number(form.maxDiscountAmount) : null,
      expiryDate: new Date(form.expiryDate),
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-zinc-950 uppercase tracking-tight">
            Promotional Coupons
          </h1>
          <p className="text-xs text-zinc-500 mt-1">Generate discount codes, set cart thresholds, and review redemption counts.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-zinc-950 text-white rounded-xl text-xs font-bold uppercase flex items-center gap-2"
        >
          <Plus size={16} /> New Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {isLoading ? (
          <p className="text-xs text-zinc-400">Loading coupons...</p>
        ) : (
          coupons.map((c) => (
            <div key={c._id} className="p-5 bg-white rounded-2xl border border-zinc-200 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-mono font-black text-base text-zinc-950 bg-zinc-100 px-3 py-1 rounded-lg border border-zinc-300">
                  {c.code}
                </span>
                <button
                  onClick={() => deleteMutation.mutate(c._id)}
                  className="p-1 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="text-xs text-zinc-600 space-y-1">
                <p>
                  Discount: <strong className="text-zinc-900">{c.discountValue}{c.discountType === 'percentage' ? '%' : ' ₹'} OFF</strong>
                </p>
                <p>Min Order: ₹{c.minOrderAmount}</p>
                <p>Used: {c.usedCount || 0} times</p>
                <p className="text-[11px] text-zinc-400">Expires: {new Date(c.expiryDate).toLocaleDateString()}</p>
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
              <h3 className="font-bold text-sm uppercase text-zinc-900">Create Coupon</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-zinc-700 block mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. SUMMER25"
                  className="w-full p-2.5 border rounded-lg font-mono uppercase font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Type</label>
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                    className="w-full p-2.5 border rounded-lg"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Flat (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Value *</label>
                  <input
                    type="number"
                    required
                    value={form.discountValue}
                    onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                    className="w-full p-2.5 border rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Min Order (₹)</label>
                  <input
                    type="number"
                    value={form.minOrderAmount}
                    onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
                    className="w-full p-2.5 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Max Cap (₹)</label>
                  <input
                    type="number"
                    value={form.maxDiscountAmount}
                    onChange={(e) => setForm({ ...form, maxDiscountAmount: e.target.value })}
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
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
