import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Star, CheckCircle, Trash2 } from 'lucide-react';
import { fetchAdminReviews, toggleAdminReview, deleteAdminReview } from '../services/api';
import toast from 'react-hot-toast';

export const AdminReviews = () => {
  const queryClient = useQueryClient();
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: fetchAdminReviews,
  });

  const toggleMutation = useMutation({
    mutationFn: toggleAdminReview,
    onSuccess: () => {
      toast.success('Review visibility toggled');
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminReview,
    onSuccess: () => {
      toast.success('Review deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
    },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-zinc-950 uppercase tracking-tight">
          Review Moderation ({reviews.length})
        </h1>
        <p className="text-xs text-zinc-500 mt-1">Approve or hide customer product reviews and verify feedback.</p>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
        <div className="divide-y divide-zinc-100">
          {isLoading ? (
            <p className="p-6 text-xs text-zinc-400">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="p-6 text-xs text-zinc-400">No reviews found.</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev._id} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-900">{rev.product?.name || 'Product'}</span>
                    <span className="text-zinc-400">• By {rev.user?.name || 'Customer'}</span>
                  </div>
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className={i < rev.rating ? 'fill-current' : 'text-zinc-300'} />
                    ))}
                  </div>
                  <h4 className="font-bold text-zinc-900">{rev.title}</h4>
                  <p className="text-zinc-600">{rev.comment}</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleMutation.mutate(rev._id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                      rev.isApproved
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-zinc-200 text-zinc-700'
                    }`}
                  >
                    {rev.isApproved ? 'Approved' : 'Hidden'}
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(rev._id)}
                    className="p-1.5 text-red-500 hover:text-red-700 rounded hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
