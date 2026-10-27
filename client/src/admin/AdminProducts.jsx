import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Search, X, Check, Eye } from 'lucide-react';
import {
  fetchProducts,
  fetchCategories,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
} from '../services/api';
import toast from 'react-hot-toast';

export const AdminProducts = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State
  const [form, setForm] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    discountPrice: '',
    category: '',
    stock: '',
    images: '',
    tags: '',
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
  });

  const { data: catData = [] } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });
  const { data: prodData, isLoading } = useQuery({
    queryKey: ['admin-products-list', search],
    queryFn: () => fetchProducts({ search, limit: 50 }),
  });

  const products = prodData?.products || [];

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createAdminProduct,
    onSuccess: () => {
      toast.success('Product created successfully');
      setIsModalOpen(false);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['admin-products-list'] });
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to create product'),
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateAdminProduct(id, data),
    onSuccess: () => {
      toast.success('Product updated successfully');
      setIsModalOpen(false);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['admin-products-list'] });
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to update product'),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteAdminProduct,
    onSuccess: () => {
      toast.success('Product deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-products-list'] });
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to delete'),
  });

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      shortDescription: '',
      price: '',
      discountPrice: '',
      category: '',
      stock: '',
      images: '',
      tags: '',
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: false,
    });
    setEditingProduct(null);
  };

  const openCreateModal = () => {
    resetForm();
    if (catData.length > 0) {
      setForm((prev) => ({ ...prev, category: catData[0]._id }));
    }
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setForm({
      name: p.name,
      description: p.description,
      shortDescription: p.shortDescription || '',
      price: p.price,
      discountPrice: p.discountPrice || '',
      category: p.category?._id || p.category,
      stock: p.stock,
      images: p.images?.join(', ') || '',
      tags: p.tags?.join(', ') || '',
      isFeatured: p.isFeatured,
      isBestSeller: p.isBestSeller,
      isNewArrival: p.isNewArrival,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const imagesArray = form.images
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean);

    const payload = {
      ...form,
      images: imagesArray.length > 0 ? imagesArray : ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80'],
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
      stock: Number(form.stock),
    };

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct._id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-zinc-950 uppercase tracking-tight">
            Product Inventory
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Manage catalog, adjust prices, restock items, and toggle featured drops.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 bg-zinc-950 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2 transition-all"
        >
          <Plus size={16} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-zinc-200/80 shadow-sm flex items-center gap-3">
        <Search size={18} className="text-zinc-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter products by title, tag, or SKU..."
          className="w-full text-xs text-zinc-900 focus:outline-none"
        />
        {search && (
          <button onClick={() => setSearch('')} className="text-zinc-400 hover:text-black">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price (INR)</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Badges</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-zinc-400">
                    Loading catalog items...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-zinc-400">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id} className="hover:bg-zinc-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0] || 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=100&q=80'}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover bg-zinc-100 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-zinc-900 truncate max-w-[200px]">{p.name}</p>
                          <p className="text-[10px] text-zinc-400">{p.sku || p.slug}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-medium text-zinc-600">
                      {p.category?.name || 'Unassigned'}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-black text-zinc-900">
                        ₹{(p.discountPrice || p.price).toLocaleString('en-IN')}
                      </span>
                      {p.discountPrice && (
                        <span className="text-[10px] text-zinc-400 line-through block">
                          ₹{p.price}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.stock <= 5
                            ? 'bg-red-100 text-red-700'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {p.stock} units
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {p.isFeatured && (
                          <span className="bg-brand-400 text-black text-[9px] font-black px-1.5 py-0.5 rounded">
                            FEATURED
                          </span>
                        )}
                        {p.isBestSeller && (
                          <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-1.5 py-0.5 rounded">
                            BEST
                          </span>
                        )}
                        {p.isNewArrival && (
                          <span className="bg-zinc-950 text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                            NEW
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-zinc-500 hover:text-black hover:bg-zinc-100 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id, p.name)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-200 mb-4">
              <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-900">
                {editingProduct ? 'Edit Product' : 'Create New Product'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-black">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-zinc-700 block mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Vintage Aviator Titanium Gold"
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900"
                  >
                    {catData.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Discount Price (₹ Optional)</label>
                  <input
                    type="number"
                    min={0}
                    value={form.discountPrice}
                    onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">Short Description</label>
                <input
                  type="text"
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  placeholder="One line summary for search cards"
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">Full Description *</label>
                <textarea
                  rows={3}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">
                  Image URLs (Comma separated) *
                </label>
                <input
                  type="text"
                  required
                  value={form.images}
                  onChange={(e) => setForm({ ...form, images: e.target.value })}
                  placeholder="https://images.unsplash.com/..., https://..."
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">Tags (Comma separated)</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="sunglasses, polarized, gold"
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900"
                />
              </div>

              {/* Boolean Flags */}
              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-zinc-700">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="rounded text-zinc-900 w-4 h-4"
                  />
                  <span>Featured Item</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-zinc-700">
                  <input
                    type="checkbox"
                    checked={form.isBestSeller}
                    onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked })}
                    className="rounded text-zinc-900 w-4 h-4"
                  />
                  <span>Best Seller</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-zinc-700">
                  <input
                    type="checkbox"
                    checked={form.isNewArrival}
                    onChange={(e) => setForm({ ...form, isNewArrival: e.target.checked })}
                    className="rounded text-zinc-900 w-4 h-4"
                  />
                  <span>New Arrival</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-zinc-300 rounded-lg font-bold text-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-6 py-2 bg-zinc-950 text-white rounded-lg font-bold uppercase disabled:opacity-50"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
