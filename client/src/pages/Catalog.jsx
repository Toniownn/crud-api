import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { searchProducts, getCategories } from '../api/catalog';
import { PhotoIcon } from '@heroicons/react/24/outline';

export default function Catalog() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const debounceRef = useRef(null);

  useEffect(() => {
    getCategories()
      .then(({ data }) => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchProducts();
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, minPrice, maxPrice, page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { page };
      if (search) params.search = search;
      if (category) params.category = category;
      if (minPrice) params.min_price = minPrice;
      if (maxPrice) params.max_price = maxPrice;
      const { data } = await searchProducts(params);
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
    } catch {
      setProducts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value) => { setSearch(value); setPage(1); };
  const handleCategoryChange = (value) => { setCategory(value); setPage(1); };
  const handleMinPriceChange = (value) => { setMinPrice(value); setPage(1); };
  const handleMaxPriceChange = (value) => { setMaxPrice(value); setPage(1); };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <h1 className="text-3xl font-black uppercase text-black text-center">Product Catalog</h1>
      <div className="w-16 h-1 bg-black mx-auto mt-3 mb-8 rounded-full"></div>

      <div className="bg-[#F0F0F0] rounded-[20px] p-5 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full bg-white border-0 rounded-full px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
          />
          <select
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="bg-white border-0 rounded-full px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => handleMinPriceChange(e.target.value)}
            className="bg-white border-0 rounded-full px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => handleMaxPriceChange(e.target.value)}
            className="bg-white border-0 rounded-full px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-12">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-400 py-12">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-[20px] border border-gray-200 overflow-hidden">
              {product.image_url ? (
                <div className="bg-[#F0F0F0] overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.product_name}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="w-full h-48 bg-[#F0F0F0] flex flex-col items-center justify-center text-gray-400 overflow-hidden">
                  <div className="hover:scale-105 transition-transform duration-300 flex flex-col items-center">
                    <PhotoIcon className="w-10 h-10 mb-1" />
                    <span className="text-xs">No Image</span>
                  </div>
                </div>
              )}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-black mb-1">{product.product_name}</h2>
                <p className="text-sm text-gray-500 mb-2">{product.product_category}</p>
                <p className="text-xl font-bold text-black mb-3">${Number(product.price).toFixed(2)}</p>
                <Link
                  to={`/product/${product.id}`}
                  className="inline-block bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="bg-black hover:bg-gray-800 text-white px-5 py-2 rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-gray-700 font-medium">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="bg-black hover:bg-gray-800 text-white px-5 py-2 rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
