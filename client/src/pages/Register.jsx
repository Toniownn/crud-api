import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({
    fname: '', lname: '', address: '', username: '', password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await register(form);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const fields = [
    { name: 'fname', label: 'First Name', type: 'text' },
    { name: 'lname', label: 'Last Name', type: 'text' },
    { name: 'address', label: 'Address', type: 'text' },
    { name: 'username', label: 'Username', type: 'text' },
    { name: 'password', label: 'Password', type: 'password' },
  ];

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
      <form onSubmit={handleSubmit} className="bg-white shadow rounded p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Register</h2>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-4">{success}</p>}

        {fields.map(({ name, label, type }) => (
          <label key={name} className="block mb-4">
            <span className="text-gray-700 text-sm">{label}</span>
            <input
              type={type}
              name={name}
              value={form[name]}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
        ))}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium"
        >
          Register
        </button>

        <p className="mt-4 text-sm text-gray-600 text-center">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
}
