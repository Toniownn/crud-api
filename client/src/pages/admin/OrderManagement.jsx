import { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus } from '../../api/admin';
import AdminLayout from '../../components/AdminLayout';
import AlertModal from '../../components/AlertModal';

const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [alert, setAlert] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await getAllOrders(statusFilter);
      setOrders(data);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [statusFilter]);

  const handleStatusChange = async (order_id, newStatus) => {
    try {
      await updateOrderStatus(order_id, newStatus);
      setAlert({ message: 'Order status updated successfully', type: 'success' });
      await load();
    } catch (err) {
      setAlert({
        message: err.response?.data?.message || err.response?.data?.error || 'Failed to update status',
        type: 'error',
      });
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-black uppercase text-black mb-8">Order Management</h1>

      {alert && (
        <AlertModal
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="mb-6 flex items-center gap-3">
        <span className="text-sm font-medium text-gray-600">Filter by status</span>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#F0F0F0] border-0 rounded-full px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="">All</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}

      {!loading && (
        <div className="bg-white rounded-[20px] border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#F0F0F0]">
              <tr>
                <th className="px-6 py-3 text-gray-600 text-xs font-semibold uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-gray-600 text-xs font-semibold uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-gray-600 text-xs font-semibold uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-gray-600 text-xs font-semibold uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-gray-600 text-xs font-semibold uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-black font-mono text-sm">
                    {order.id?.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 text-black">
                    {order.customer?.fname ? `${order.customer.fname} ${order.customer.lname}` : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="bg-[#F0F0F0] border-0 rounded-full px-3 py-1 text-sm text-gray-800 focus:ring-2 focus:ring-black focus:outline-none"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-black">
                    ${Number(order.total_amount ?? 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-black">
                    {order.placed_at ? new Date(Number(order.placed_at)).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
