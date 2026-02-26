import { useEffect, useState } from 'react';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../api/products';
import { v4 as uuidv4 } from 'uuid';
import AlertModal from '../components/AlertModal';

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
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Products</h1>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      {alert && (
        <AlertModal
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow rounded p-4 mb-6 grid grid-cols-2 gap-4">
        <input
          name="product_name"
          placeholder="Product Name"
          value={form.product_name}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="product_category"
          placeholder="Category"
          value={form.product_category}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="quantity"
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="col-span-2 flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium"
          >
            {editingId ? 'Update' : 'Create'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded font-medium"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="bg-white shadow rounded overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-gray-700 text-sm font-semibold">Name</th>
              <th className="px-4 py-3 text-gray-700 text-sm font-semibold">Category</th>
              <th className="px-4 py-3 text-gray-700 text-sm font-semibold">Price</th>
              <th className="px-4 py-3 text-gray-700 text-sm font-semibold">Qty</th>
              <th className="px-4 py-3 text-gray-700 text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-gray-200">
                <td className="px-4 py-3 text-gray-800">{p.product_name}</td>
                <td className="px-4 py-3 text-gray-800">{p.product_category}</td>
                <td className="px-4 py-3 text-gray-800">{p.price}</td>
                <td className="px-4 py-3 text-gray-800">{p.quantity}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
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
