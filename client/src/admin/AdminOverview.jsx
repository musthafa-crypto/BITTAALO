import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  AlertTriangle,
  ArrowUpRight,
  Package,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { fetchAdminStats } from '../services/api';

const COLORS = ['#D4AF37', '#18181B', '#3B82F6', '#10B981', '#EC4899', '#8B5CF6'];

export const AdminOverview = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: fetchAdminStats,
  });

  if (isLoading) {
    return <div className="p-8 text-xs text-zinc-500">Loading admin metrics...</div>;
  }

  const salesData =
    stats?.salesHistory?.length > 0
      ? stats.salesHistory.map((item) => ({
          name: item._id?.slice(5) || item.name,
          revenue: item.revenue || 0,
        }))
      : [
          { name: 'Mon', revenue: 14200 },
          { name: 'Tue', revenue: 19800 },
          { name: 'Wed', revenue: 26500 },
          { name: 'Thu', revenue: 22100 },
          { name: 'Fri', revenue: 38400 },
          { name: 'Sat', revenue: 47900 },
          { name: 'Sun', revenue: 53200 },
        ];

  const categoryPieData =
    stats?.categoryStats?.length > 0
      ? stats.categoryStats.map((c) => ({ name: c.name, value: c.count }))
      : [
          { name: 'Sunglasses', value: 4 },
          { name: 'Caps', value: 4 },
          { name: 'Jewellery', value: 4 },
          { name: 'Watches', value: 4 },
          { name: 'Footwear', value: 4 },
        ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-zinc-950 uppercase tracking-tight">
          Executive Dashboard
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Real-time metrics, live sales volume, and low stock inventory alarms.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 bg-white rounded-2xl border border-zinc-200/80 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Sales</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-zinc-950">
            ₹{(stats?.totalSales || 0).toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <ArrowUpRight size={12} /> Live gross processed volume
          </span>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-zinc-200/80 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-zinc-950">
            {stats?.totalOrders || 0}
          </div>
          <span className="text-[11px] text-zinc-400">Razorpay & COD orders</span>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-zinc-200/80 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Registered Customers</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-zinc-950">
            {stats?.totalUsers || 0}
          </div>
          <span className="text-[11px] text-zinc-400">Active customer profiles</span>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-zinc-200/80 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Low Stock Alerts</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-zinc-950">
            {stats?.lowStockCount || 0}
          </div>
          <span className="text-[11px] text-amber-600 font-medium">Items with &le; 5 units</span>
        </div>
      </div>

      {/* Charts Section: Revenue over time & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Bar Chart */}
        <div className="lg:col-span-2 p-6 bg-white rounded-2xl border border-zinc-200/80 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-900">
              Revenue Velocity (INR ₹)
            </h3>
            <span className="text-[11px] text-zinc-400">Last 7 Days</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={11} tickLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={11} tickLine={false} tickFormatter={(val) => `₹${val}`} />
                <Tooltip
                  formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#18181B', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="revenue" fill="#D4AF37" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Pie Chart */}
        <div className="p-6 bg-white rounded-2xl border border-zinc-200/80 shadow-sm space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-900">
            Catalog Distribution
          </h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name) => [`${val} Products`, name]}
                  contentStyle={{ backgroundColor: '#18181B', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Section: Low-Stock Alarms & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Items */}
        <div className="p-6 bg-white rounded-2xl border border-zinc-200/80 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-zinc-100">
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-900 flex items-center gap-2">
              <AlertTriangle size={14} className="text-amber-500" />
              <span>Low-Stock Inventory Warnings</span>
            </h3>
            <Link to="/admin/products" className="text-[11px] text-brand-600 font-bold hover:underline">
              Manage All
            </Link>
          </div>

          <div className="space-y-3">
            {stats?.lowStockProducts?.length === 0 ? (
              <p className="text-xs text-zinc-500 py-4">All catalog items have healthy inventory levels.</p>
            ) : (
              stats?.lowStockProducts?.slice(0, 5).map((p) => (
                <div key={p._id} className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.images?.[0] || 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=100&q=80'}
                      alt={p.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-bold text-zinc-900 truncate max-w-[200px]">{p.name}</p>
                      <p className="text-[10px] text-zinc-400">₹{p.price}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 font-bold text-[11px]">
                    {p.stock} units left
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Orders Stream */}
        <div className="p-6 bg-white rounded-2xl border border-zinc-200/80 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-zinc-100">
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-900 flex items-center gap-2">
              <ShoppingBag size={14} className="text-brand-500" />
              <span>Recent Customer Orders</span>
            </h3>
            <Link to="/admin/orders" className="text-[11px] text-brand-600 font-bold hover:underline">
              View All Orders
            </Link>
          </div>

          <div className="space-y-3">
            {stats?.recentOrders?.length === 0 ? (
              <p className="text-xs text-zinc-500 py-4">No recent orders placed yet.</p>
            ) : (
              stats?.recentOrders?.map((ord) => (
                <div key={ord._id} className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 text-xs">
                  <div>
                    <span className="font-bold text-zinc-900 font-mono">{ord.orderNumber}</span>
                    <p className="text-[10px] text-zinc-500">
                      {ord.user?.name || ord.guestInfo?.name || 'Customer'} • ₹{ord.totalPrice}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      ord.orderStatus === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : ord.orderStatus === 'Shipped'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {ord.orderStatus}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
