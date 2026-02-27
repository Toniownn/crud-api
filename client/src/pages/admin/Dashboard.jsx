import { useEffect, useState } from 'react';
import { getDashboard } from '../../api/admin';
import AdminLayout from '../../components/AdminLayout';
import {
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  CubeIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statCards = [
  {
    key: 'totalOrders',
    label: 'Total Orders',
    icon: ClipboardDocumentListIcon,
  },
  {
    key: 'totalRevenue',
    label: 'Total Revenue',
    icon: CurrencyDollarIcon,
    format: (v) =>
      `$${Number(v ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  },
  {
    key: 'totalProducts',
    label: 'Total Products',
    icon: CubeIcon,
  },
  {
    key: 'totalUsers',
    label: 'Total Users',
    icon: UsersIcon,
  },
];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then(({ data }) => setData(data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-3xl font-black uppercase text-black mb-8">Dashboard</h1>

      {loading && <p className="text-gray-500">Loading...</p>}

      {!loading && data && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((card) => {
              const Icon = card.icon;
              const value = card.format
                ? card.format(data[card.key])
                : (data[card.key] ?? 0);
              return (
                <div
                  key={card.key}
                  className="bg-white rounded-[20px] border border-gray-200 p-6 flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#F0F0F0]">
                    <Icon className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-black">{value}</p>
                    <p className="text-sm text-gray-500 mt-1">{card.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-[20px] border border-gray-200 overflow-hidden">
            <h2 className="text-lg font-semibold text-black px-6 py-4 border-b border-gray-200">
              Recent Orders
            </h2>
            <table className="w-full text-left">
              <thead className="bg-[#F0F0F0]">
                <tr>
                  <th className="px-6 py-3 text-gray-600 text-xs font-semibold uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-gray-600 text-xs font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-gray-600 text-xs font-semibold uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-gray-600 text-xs font-semibold uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody>
                {(data.recentOrders ?? []).slice(0, 5).map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-black font-mono text-sm">
                      {order.id?.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          statusColors[order.status] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-black">
                      ${Number(order.total_amount ?? 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-black">
                      {order.placed_at ? new Date(Number(order.placed_at)).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))}
                {(!data.recentOrders || data.recentOrders.length === 0) && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      No recent orders.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!loading && !data && (
        <p className="text-red-600 text-sm">Failed to load dashboard data.</p>
      )}
    </AdminLayout>
  );
}
