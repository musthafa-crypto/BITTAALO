import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Mail, Phone, Calendar } from 'lucide-react';
import { fetchAdminCustomers } from '../services/api';

export const AdminCustomers = () => {
  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['admin-customers'],
    queryFn: fetchAdminCustomers,
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-zinc-950 uppercase tracking-tight">
          Customer Accounts ({customers.length})
        </h1>
        <p className="text-xs text-zinc-500 mt-1">Review registered user accounts and saved shipping addresses.</p>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4">Customer Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Addresses</th>
              <th className="py-3 px-4">Joined Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {isLoading ? (
              <tr><td colSpan={5} className="py-6 text-center text-zinc-400">Loading customers...</td></tr>
            ) : customers.length === 0 ? (
              <tr><td colSpan={5} className="py-6 text-center text-zinc-400">No customers registered yet.</td></tr>
            ) : (
              customers.map((c) => (
                <tr key={c._id} className="hover:bg-zinc-50">
                  <td className="py-3 px-4 font-bold text-zinc-900">{c.name}</td>
                  <td className="py-3 px-4 text-zinc-600 flex items-center gap-1.5"><Mail size={12} /> {c.email}</td>
                  <td className="py-3 px-4 text-zinc-600">{c.phone || 'N/A'}</td>
                  <td className="py-3 px-4 text-zinc-500">{c.addresses?.length || 0} saved</td>
                  <td className="py-3 px-4 text-zinc-400">{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
