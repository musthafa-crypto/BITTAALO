import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Mail, Check, MessageSquare } from 'lucide-react';
import { fetchAdminMessages, markAdminMessageRead } from '../services/api';
import toast from 'react-hot-toast';

export const AdminMessages = () => {
  const queryClient = useQueryClient();
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['admin-messages'],
    queryFn: fetchAdminMessages,
  });

  const readMutation = useMutation({
    mutationFn: markAdminMessageRead,
    onSuccess: () => {
      toast.success('Marked as read');
      queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
    },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-zinc-950 uppercase tracking-tight">
          Support Inbox ({messages.length})
        </h1>
        <p className="text-xs text-zinc-500 mt-1">Inquiries submitted via the Contact form and routed to bittaalo@gmail.com.</p>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm divide-y divide-zinc-100">
        {isLoading ? (
          <p className="p-6 text-xs text-zinc-400">Loading inbox messages...</p>
        ) : messages.length === 0 ? (
          <p className="p-6 text-xs text-zinc-400">No customer inquiries received yet.</p>
        ) : (
          messages.map((m) => (
            <div
              key={m._id}
              className={`p-5 flex flex-col sm:flex-row justify-between items-start gap-4 text-xs transition-colors ${
                !m.isRead ? 'bg-amber-50/50' : ''
              }`}
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-zinc-900">{m.name}</span>
                  <span className="text-zinc-500">(&lt;{m.email}&gt;)</span>
                  {m.phone && <span className="text-zinc-500">• +91 {m.phone}</span>}
                  <span className="text-zinc-400">• {new Date(m.createdAt).toLocaleDateString()}</span>
                </div>
                <h4 className="font-bold text-zinc-900 text-sm">{m.subject}</h4>
                <p className="text-zinc-600 whitespace-pre-wrap leading-relaxed">{m.message}</p>
              </div>

              {!m.isRead ? (
                <button
                  onClick={() => readMutation.mutate(m._id)}
                  className="px-3 py-1.5 bg-zinc-950 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1 flex-shrink-0"
                >
                  <Check size={12} /> Mark Read
                </button>
              ) : (
                <span className="text-[11px] text-zinc-400 font-bold uppercase">Read</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
