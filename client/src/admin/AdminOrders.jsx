import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Printer, Eye, X, Check, Truck, Clock } from 'lucide-react';
import { fetchAdminOrders, updateAdminOrderStatus } from '../services/api';
import toast from 'react-hot-toast';

const STATUS_LIST = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];

export const AdminOrders = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);

  const [updateStatusVal, setUpdateStatusVal] = useState('');
  const [trackingVal, setTrackingVal] = useState('');
  const [courierVal, setCourierVal] = useState('Bluedart');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', statusFilter],
    queryFn: () => fetchAdminOrders({ status: statusFilter }),
  });

  const orders = data?.orders || [];

  const statusMutation = useMutation({
    mutationFn: ({ id, data }) => updateAdminOrderStatus(id, data),
    onSuccess: (res) => {
      toast.success(res.message || 'Status updated');
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      if (selectedOrder) {
        setSelectedOrder(res.order);
      }
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Update failed'),
  });

  const handleUpdateStatus = (orderId) => {
    if (!updateStatusVal) return;
    statusMutation.mutate({
      id: orderId,
      data: {
        status: updateStatusVal,
        trackingNumber: trackingVal,
        courierName: courierVal,
      },
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-zinc-950 uppercase tracking-tight">
            Order Fulfillment
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Track customer shipments, update dispatch milestones, and print invoices.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 bg-white p-1.5 rounded-xl border border-zinc-200 text-xs">
          <button
            onClick={() => setStatusFilter('')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              !statusFilter ? 'bg-zinc-950 text-white' : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            All Orders
          </button>
          {STATUS_LIST.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                statusFilter === st ? 'bg-zinc-950 text-white' : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-zinc-400">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-zinc-400">
                    No orders in this status.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-zinc-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-zinc-900">
                      {ord.orderNumber}
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-bold text-zinc-900">{ord.shippingAddress?.fullName}</p>
                      <p className="text-[10px] text-zinc-400">{ord.shippingAddress?.city}, {ord.shippingAddress?.state}</p>
                    </td>

                    <td className="py-3 px-4 text-zinc-600 font-medium">
                      {ord.items?.length || 0} items
                    </td>

                    <td className="py-3 px-4 font-black text-zinc-950">
                      ₹{ord.totalPrice?.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold uppercase text-[10px] text-zinc-700">
                        {ord.paymentMethod}
                      </span>
                      <span
                        className={`ml-1 text-[10px] font-bold ${
                          ord.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'
                        }`}
                      >
                        ({ord.paymentStatus})
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          ord.orderStatus === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.orderStatus === 'Shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : ord.orderStatus === 'Cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ord.orderStatus}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(ord);
                            setUpdateStatusVal(ord.orderStatus);
                            setTrackingVal(ord.trackingNumber || '');
                            setCourierVal(ord.courierName || 'Bluedart');
                            setShowInvoice(false);
                          }}
                          className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded font-bold transition-colors flex items-center gap-1"
                        >
                          <Eye size={12} />
                          <span>Inspect</span>
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

      {/* Order Details & Status Update Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-200">
              <div>
                <h3 className="font-display font-black text-base uppercase text-zinc-950">
                  Order Details: {selectedOrder.orderNumber}
                </h3>
                <span className="text-[11px] text-zinc-400">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowInvoice(!showInvoice)}
                  className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-lg text-xs font-bold flex items-center gap-1"
                >
                  <Printer size={14} />
                  <span>{showInvoice ? 'Close Invoice' : 'Print Invoice'}</span>
                </button>
                <button onClick={() => setSelectedOrder(null)} className="text-zinc-400 hover:text-black">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Print Invoice View */}
            {showInvoice ? (
              <div className="p-6 border border-zinc-200 rounded-2xl bg-zinc-50 space-y-6 print:p-0 print:border-none">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-black text-xl tracking-widest text-zinc-950">BITTAALO</h2>
                    <p className="text-[10px] text-zinc-500">Premium Lifestyle Accessories India</p>
                    <p className="text-[10px] text-zinc-500">bittaalo@gmail.com • +91 9037489104</p>
                  </div>
                  <div className="text-right text-xs">
                    <p className="font-bold font-mono">TAX INVOICE</p>
                    <p className="text-[11px] text-zinc-500">Inv #: {selectedOrder.orderNumber}</p>
                    <p className="text-[11px] text-zinc-500">Date: {new Date(selectedOrder.createdAt).toLocaleDateString('en-IN')}</p>
                  </div>
                </div>

                <div className="text-xs text-zinc-700 bg-white p-3 rounded-lg border border-zinc-200">
                  <p className="font-bold text-zinc-900 mb-1">Billed & Shipped To:</p>
                  <p>{selectedOrder.shippingAddress.fullName}</p>
                  <p>{selectedOrder.shippingAddress.street}</p>
                  <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pinCode}</p>
                  <p>Contact: +91 {selectedOrder.shippingAddress.phone}</p>
                </div>

                <table className="w-full text-left text-xs">
                  <thead className="border-b border-zinc-300 font-bold">
                    <tr>
                      <th className="py-2">Item</th>
                      <th className="py-2">Qty</th>
                      <th className="py-2 text-right">Price</th>
                      <th className="py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {selectedOrder.items?.map((it, i) => (
                      <tr key={i}>
                        <td className="py-2">{it.name} {it.variant?.value ? `(${it.variant.value})` : ''}</td>
                        <td className="py-2">{it.quantity}</td>
                        <td className="py-2 text-right">₹{it.price}</td>
                        <td className="py-2 text-right">₹{it.price * it.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="border-t border-zinc-300 pt-3 text-xs space-y-1 text-right">
                  <p>Subtotal: ₹{selectedOrder.itemsPrice}</p>
                  <p>Shipping: ₹{selectedOrder.shippingPrice}</p>
                  {selectedOrder.discountPrice > 0 && <p className="text-emerald-600">Discount: -₹{selectedOrder.discountPrice}</p>}
                  <p className="font-black text-sm text-zinc-900 pt-1 border-t border-zinc-300">
                    Grand Total: ₹{selectedOrder.totalPrice.toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="text-center pt-4">
                  <button
                    onClick={handlePrint}
                    className="px-6 py-2.5 bg-zinc-950 text-white rounded-lg text-xs font-bold uppercase tracking-wider"
                  >
                    Print Physical Copy
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Status Update Form */}
                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-900">
                    Update Dispatch & Delivery Status
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <select
                      value={updateStatusVal}
                      onChange={(e) => setUpdateStatusVal(e.target.value)}
                      className="p-2 border border-zinc-300 rounded-lg text-xs bg-white font-bold"
                    >
                      {STATUS_LIST.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      placeholder="Tracking Number"
                      value={trackingVal}
                      onChange={(e) => setTrackingVal(e.target.value)}
                      className="p-2 border border-zinc-300 rounded-lg text-xs bg-white"
                    />

                    <button
                      onClick={() => handleUpdateStatus(selectedOrder._id)}
                      disabled={statusMutation.isPending}
                      className="py-2 px-4 bg-zinc-950 hover:bg-black text-white text-xs font-bold uppercase rounded-lg disabled:opacity-50"
                    >
                      {statusMutation.isPending ? 'Updating...' : 'Save Status'}
                    </button>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-900">
                    Purchased Gear ({selectedOrder.items?.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedOrder.items?.map((it, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl text-xs">
                        <img
                          src={it.image || 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=100&q=80'}
                          alt={it.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-bold text-zinc-900">{it.name}</p>
                          {it.variant?.value && (
                            <p className="text-[11px] text-zinc-400">Variant: {it.variant.value}</p>
                          )}
                          <p className="text-zinc-500 text-[11px]">Qty: {it.quantity} × ₹{it.price}</p>
                        </div>
                        <span className="font-black text-zinc-900">₹{it.price * it.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Address & Tracking */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                    <p className="font-bold text-zinc-900 mb-1">Destination Address:</p>
                    <p>{selectedOrder.shippingAddress.fullName}</p>
                    <p>{selectedOrder.shippingAddress.street}</p>
                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pinCode}</p>
                    <p className="text-zinc-500 mt-1">Phone: +91 {selectedOrder.shippingAddress.phone}</p>
                  </div>

                  <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                    <p className="font-bold text-zinc-900 mb-1">Logistics & Tracking:</p>
                    <p>Courier: {selectedOrder.courierName || 'Bluedart'}</p>
                    <p>Tracking ID: {selectedOrder.trackingNumber || 'Pending Assignment'}</p>
                    <p className="mt-1">
                      Payment: <span className="font-bold uppercase">{selectedOrder.paymentMethod}</span> ({selectedOrder.paymentStatus})
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
