import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderDetail, cancelOrder } from '../api/orders';
import { ArrowLeftIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import AlertModal from '../components/AlertModal';

const STATUS_BADGE = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const load = async () => {
    try {
      const { data } = await getOrderDetail(id);
      setOrder(data.order || data);
    } catch (err) {
      setAlert({
        message: err.response?.data?.message || 'Failed to load order',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleCancel = async () => {
    try {
      await cancelOrder(id);
      setAlert({ message: 'Order cancelled successfully', type: 'success' });
      await load();
    } catch (err) {
      setAlert({
        message: err.response?.data?.message || 'Failed to cancel order',
        type: 'error',
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-gray-500 text-center">Loading order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-[20px] border border-gray-200 p-8 text-center">
          <p className="text-gray-500 mb-4">Order not found.</p>
          <Link to="/orders" className="text-black hover:text-gray-600 font-medium transition-colors">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const items = order.order_items || order.OrderItems || [];
  const total = Number(order.total_amount);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-black uppercase text-black mb-8">Order Details</h1>

      {alert && (
        <AlertModal
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="bg-white rounded-[20px] border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Order ID</p>
            <p className="text-black font-mono text-sm">{order.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                STATUS_BADGE[order.status] || 'bg-gray-100 text-gray-800'
              }`}
            >
              {order.status}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Placed</p>
            <p className="text-black">
              {new Date(Number(order.placed_at)).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="text-black font-bold">${total.toFixed(2)}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-500">Shipping Address</p>
            <p className="text-black">{order.shipping_address}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[20px] border border-gray-200 overflow-hidden mb-6">
        <table className="w-full text-left">
          <thead className="bg-[#F0F0F0]">
            <tr>
              <th className="px-4 py-3 text-gray-600 text-xs font-semibold uppercase tracking-wider">Product</th>
              <th className="px-4 py-3 text-gray-600 text-xs font-semibold uppercase tracking-wider">Price</th>
              <th className="px-4 py-3 text-gray-600 text-xs font-semibold uppercase tracking-wider">Quantity</th>
              <th className="px-4 py-3 text-gray-600 text-xs font-semibold uppercase tracking-wider">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const price = Number(item.price);
              const subtotal = price * item.quantity;
              return (
                <tr key={idx} className="border-b border-gray-100">
                  <td className="px-4 py-3 text-black">{item.product_name}</td>
                  <td className="px-4 py-3 text-gray-700">${price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-gray-700">{item.quantity}</td>
                  <td className="px-4 py-3 text-black font-medium">${subtotal.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <Link
          to="/orders"
          className="text-black hover:text-gray-600 font-medium flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Orders
        </Link>
        {order.status === 'pending' && (
          <button
            onClick={handleCancel}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-full font-medium transition-colors flex items-center gap-2"
          >
            <ExclamationTriangleIcon className="w-5 h-5" />
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
}
