import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart, updateCartItem, removeFromCart, clearCart } from '../api/cart';
import { ShoppingCartIcon, TrashIcon } from '@heroicons/react/24/outline';
import AlertModal from '../components/AlertModal';

export default function Cart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    load();
  }, []);

  const handleUpdateQty = async (item, delta) => {
    const newQty = item.quantity + delta;
    try {
      if (newQty <= 0) {
        await removeFromCart(item.id);
      } else {
        await updateCartItem(item.id, newQty);
      }
      await load();
    } catch (err) {
      setAlert({
        message: err.response?.data?.message || 'Failed to update quantity',
        type: 'error',
      });
    }
  };

  const handleRemove = async (id) => {
    try {
      await removeFromCart(id);
      await load();
    } catch (err) {
      setAlert({
        message: err.response?.data?.message || 'Failed to remove item',
        type: 'error',
      });
    }
  };

  const handleClear = async () => {
    try {
      await clearCart();
      setItems([]);
    } catch (err) {
      setAlert({
        message: err.response?.data?.message || 'Failed to clear cart',
        type: 'error',
      });
    }
  };

  const total = items.reduce(
    (sum, item) => sum + Number((item.product || item.Product).price) * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <p className="text-gray-500 text-center">Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-black uppercase text-black mb-8">Your Cart</h1>

      {alert && (
        <AlertModal
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      {items.length === 0 ? (
        <div className="bg-white rounded-[20px] border border-gray-200 p-12 text-center">
          <ShoppingCartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-6">Your cart is empty.</p>
          <Link
            to="/catalog"
            className="bg-black hover:bg-gray-800 text-white rounded-full px-8 py-3 font-medium inline-block transition-colors"
          >
            Browse Catalog
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            {items.map((item) => {
              const product = item.product || item.Product;
              const price = Number(product.price);
              const subtotal = price * item.quantity;
              return (
                <div key={item.id} className="border-b border-gray-100 py-6 flex items-start gap-4">
                  <div className="w-20 h-20 bg-[#F0F0F0] rounded-[20px] flex-shrink-0 overflow-hidden">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.product_name}
                        className="w-full h-full object-cover rounded-[20px]"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No img
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-black font-bold text-sm">{product.product_name}</h3>
                    <p className="text-black font-bold text-lg mt-1">${price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-[#F0F0F0] rounded-full inline-flex items-center">
                      <button
                        onClick={() => handleUpdateQty(item, -1)}
                        className="w-8 h-8 flex items-center justify-center text-black font-bold hover:bg-gray-200 rounded-full transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-black font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQty(item, 1)}
                        className="w-8 h-8 flex items-center justify-center text-black font-bold hover:bg-gray-200 rounded-full transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-red-500 hover:text-red-600 p-1.5 transition-colors"
                      title="Remove item"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white rounded-[20px] border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-black mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="text-black font-medium">${total.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="text-black font-bold">Total</span>
                  <span className="text-black font-bold text-lg">${total.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-black hover:bg-gray-800 text-white rounded-full py-3 font-medium transition-colors"
              >
                Go to Checkout &rarr;
              </button>
              <button
                onClick={handleClear}
                className="w-full text-sm text-red-500 hover:text-red-600 text-center mt-3 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
