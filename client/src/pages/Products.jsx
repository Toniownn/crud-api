import { useEffect, useState } from 'react';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../api/products';
import { v4 as uuidv4 } from 'uuid';
import AlertModal from '../components/AlertModal';
import {
  PlusIcon,
  PencilSquareIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

const EMPTY = { product_name: '', product_category: '', price: '', quantity: '' };

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [alert, setAlert] = useState(null);

  const load = async () => {
    try {
      const { data } = await getAllProducts();
      setProducts(data);
    } catch {
      setError('Failed to load products');
    }
  };

  useEffect(() => {
    getAllProducts()
      .then(({ data }) => setProducts(data))
      .catch(() => setError('Failed to load products'));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        quantity: Number(form.quantity),
      };
      if (editingId) {
        await updateProduct(editingId, payload);
        setAlert({ message: 'Product updated successfully', type: 'success' });
      } else {
        await createProduct({ id: uuidv4(), ...payload });
        setAlert({ message: 'Product created successfully', type: 'success' });
      }
      setForm(EMPTY);
      setEditingId(null);
      await load();
    } catch (err) {
      setAlert({
        message: err.response?.data?.message || err.response?.data?.error || 'Operation failed',
        type: 'error',
      });
    }
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setForm({
      product_name: p.product_name,
      product_category: p.product_category,
      price: String(p.price),
      quantity: String(p.quantity),
    });
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      await deleteProduct(id);
      setAlert({ message: 'Product deleted successfully', type: 'success' });
      await load();
    } catch (err) {
      setAlert({
        message: err.response?.data?.message || 'Delete failed',
        type: 'error',
      });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(EMPTY);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-black uppercase text-black mb-8">Products</h1>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      {alert && (
        <AlertModal
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-[20px] border border-gray-200 p-6 mb-6 grid grid-cols-2 gap-4">
        <input
          name="product_name"
          placeholder="Product Name"
          value={form.product_name}
          onChange={handleChange}
          required
          className="bg-[#F0F0F0] border-0 rounded-full px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
        />
        <input
          name="product_category"
          placeholder="Category"
          value={form.product_category}
          onChange={handleChange}
          required
          className="bg-[#F0F0F0] border-0 rounded-full px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
          className="bg-[#F0F0F0] border-0 rounded-full px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
        />
        <input
          name="quantity"
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          required
          className="bg-[#F0F0F0] border-0 rounded-full px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
        />
        <div className="col-span-2 flex gap-2">
          <button
            type="submit"
            className="bg-black hover:bg-gray-800 text-white px-6 py-2.5 rounded-full font-medium transition-colors inline-flex items-center gap-1.5"
          >
            {editingId ? (
              <>
                <PencilSquareIcon className="w-5 h-5" />
                Update
              </>
            ) : (
              <>
                <PlusIcon className="w-5 h-5" />
                Create
              </>
            )}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              className="border border-gray-300 hover:bg-gray-50 text-black rounded-full px-6 py-2.5 font-medium transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="bg-white rounded-[20px] border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#F0F0F0]">
            <tr>
              <th className="px-6 py-3 text-gray-600 text-xs font-semibold uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-gray-600 text-xs font-semibold uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-gray-600 text-xs font-semibold uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-gray-600 text-xs font-semibold uppercase tracking-wider">Qty</th>
              <th className="px-6 py-3 text-gray-600 text-xs font-semibold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-black">{p.product_name}</td>
                <td className="px-6 py-4 text-black">{p.product_category}</td>
                <td className="px-6 py-4 text-black">{p.price}</td>
                <td className="px-6 py-4 text-black">{p.quantity}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="bg-black hover:bg-gray-800 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors inline-flex items-center gap-1"
                  >
                    <PencilIcon className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors inline-flex items-center gap-1"
                  >
                    <TrashIcon className="w-4 h-4" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
