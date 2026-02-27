import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../api/orders';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import AlertModal from '../components/AlertModal';

const STATUS_BADGE = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getMyOrders();
        setOrders(data.orders || data || []);
      } catch (err) {
        setAlert({
          message: err.response?.data?.message || 'Failed to load orders',
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-gray-500 text-center">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-black uppercase text-black mb-8">My Orders</h1>

      {alert && (
        <AlertModal
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      {orders.length === 0 ? (
        <div className="bg-white rounded-[20px] border border-gray-200 p-12 text-center">
          <ClipboardDocumentListIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-6">No orders yet.</p>
          <Link
            to="/catalog"
            className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full font-medium inline-block transition-colors"
          >
            Browse Catalog
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-[20px] border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#F0F0F0]">
              <tr>
                <th className="px-4 py-3 text-gray-600 text-xs font-semibold uppercase tracking-wider">Order ID</th>
                <th className="px-4 py-3 text-gray-600 text-xs font-semibold uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-gray-600 text-xs font-semibold uppercase tracking-wider">Total</th>
                <th className="px-4 py-3 text-gray-600 text-xs font-semibold uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-gray-600 text-xs font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-black font-mono text-sm">
                    {order.id.substring(0, 8)}...
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        STATUS_BADGE[order.status] || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-black font-semibold">
                    ${Number(order.total_amount).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {new Date(Number(order.placed_at)).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/orders/${order.id}`}
                      className="text-black hover:text-gray-600 font-medium transition-colors"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
