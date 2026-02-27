import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../api/catalog';
import { addToCart } from '../api/cart';
import { useAuth } from '../context/AuthContext';
import AlertModal from '../components/AlertModal';
import { PhotoIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

export default function ProductDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getProductById(id)
      .then(({ data }) => setProduct(data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load product.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await addToCart({ product_id: id, quantity: 1 });
      setAlert({ message: 'Added to cart!', type: 'success' });
    } catch (err) {
      setAlert({ message: err.response?.data?.message || 'Failed to add to cart.', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white">
        <div className="text-center text-gray-400 py-12">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white">
        <div className="bg-white rounded-[20px] border border-gray-200 p-6 text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <Link to="/catalog" className="inline-block bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full font-medium transition-colors">
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {alert && (<AlertModal message={alert.message} type={alert.type} onClose={() => setAlert(null)} />)}

      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-1">
        <Link to="/catalog" className="text-gray-500 hover:text-black">Home</Link>
        <ChevronRightIcon className="w-3.5 h-3.5 text-gray-400" />
        <Link to="/catalog" className="text-gray-500 hover:text-black">Catalog</Link>
        <ChevronRightIcon className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-black font-medium">{product.product_name}</span>
      </nav>

      <div className="bg-white rounded-[20px] border border-gray-200 overflow-hidden md:flex">
        <div className="md:w-1/2">
          {product.image_url ? (
            <div className="bg-[#F0F0F0] overflow-hidden rounded-[20px]">
              <img src={product.image_url} alt={product.product_name} className="w-full h-72 md:h-full object-cover" />
            </div>
          ) : (
            <div className="w-full h-72 md:h-full bg-[#F0F0F0] rounded-[20px] flex flex-col items-center justify-center text-gray-400">
              <PhotoIcon className="w-16 h-16 mb-2" />
              <span className="text-sm">No Image</span>
            </div>
          )}
        </div>

        <div className="p-6 md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black mb-2">{product.product_name}</h1>
            <p className="text-sm text-gray-500 mb-4">{product.product_category}</p>
            <p className="text-3xl font-bold text-black mb-4">${Number(product.price).toFixed(2)}</p>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Stock:</span>{' '}
              {product.quantity > 0 ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                  <CheckCircleIcon className="w-3.5 h-3.5" />
                  {product.quantity} available
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700">
                  <XCircleIcon className="w-3.5 h-3.5" />
                  Out of stock
                </span>
              )}
            </p>
            {product.description && (
              <p className="text-gray-700 mt-4 leading-relaxed">{product.description}</p>
            )}
          </div>

          {token && (
            <button
              onClick={handleAddToCart}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white py-3 rounded-full font-medium text-lg transition-colors"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
