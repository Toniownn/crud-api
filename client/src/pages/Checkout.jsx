import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart } from '../api/cart';
import { checkout } from '../api/orders';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import AlertModal from '../components/AlertModal';

export default function Checkout() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shippingAddress, setShippingAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getCart();
        setItems(data.items || []);
      } catch (err) {
        setAlert({
          message: err.response?.data?.message || 'Failed to load cart',
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const total = items.reduce(
    (sum, item) => sum + Number((item.product || item.Product).price) * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    try {
      await checkout(shippingAddress);
      setAlert({ message: 'Order placed successfully!', type: 'success' });
    } catch (err) {
      setSubmitting(false);
      setAlert({
        message: err.response?.data?.message || 'Checkout failed',
        type: 'error',
      });
    }
  };

  const handleAlertClose = () => {
    if (alert?.type === 'success') {
      navigate('/orders');
    }
    setAlert(null);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-gray-500 text-center">Loading checkout...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-black uppercase text-black mb-8">Checkout</h1>

      {alert && (
        <AlertModal
          message={alert.message}
          type={alert.type}
          onClose={handleAlertClose}
        />
      )}

      <div className="bg-white rounded-[20px] border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-black mb-4">Order Summary</h2>
        {items.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <table className="w-full text-left mb-4">
            <thead className="bg-[#F0F0F0]">
              <tr>
                <th className="px-4 py-2.5 text-gray-600 text-xs font-semibold uppercase tracking-wider">Product</th>
                <th className="px-4 py-2.5 text-gray-600 text-xs font-semibold uppercase tracking-wider">Qty</th>
                <th className="px-4 py-2.5 text-gray-600 text-xs font-semibold uppercase tracking-wider">Price</th>
                <th className="px-4 py-2.5 text-gray-600 text-xs font-semibold uppercase tracking-wider">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const price = Number((item.product || item.Product).price);
                const subtotal = price * item.quantity;
                return (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="px-4 py-2.5 text-black">{(item.product || item.Product).product_name}</td>
                    <td className="px-4 py-2.5 text-gray-700">{item.quantity}</td>
                    <td className="px-4 py-2.5 text-gray-700">${price.toFixed(2)}</td>
                    <td className="px-4 py-2.5 text-black font-medium">${subtotal.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        <p className="text-right text-lg font-bold text-black">
          Total: ${total.toFixed(2)}
        </p>
      </div>

      <div className="bg-white rounded-[20px] border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-black mb-4">Shipping Address</h2>
        <textarea
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          placeholder="Enter your shipping address"
          rows={3}
          className="w-full bg-[#F0F0F0] border-0 rounded-2xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <div className="flex items-center justify-between">
        <Link
          to="/cart"
          className="text-black hover:text-gray-600 font-medium flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Cart
        </Link>
        <button
          onClick={handlePlaceOrder}
          disabled={items.length === 0 || !shippingAddress.trim() || submitting}
          className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
}
