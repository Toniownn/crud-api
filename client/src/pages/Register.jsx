import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AlertModal from '../components/AlertModal';

export default function Register() {
  const [form, setForm] = useState({
    fname: '', lname: '', address: '', username: '', password: '',
  });
  const [alert, setAlert] = useState(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      setAlert({ message: 'Registration successful!', type: 'success', redirect: true });
    } catch (err) {
      setAlert({
        message: err.response?.data?.message || 'Registration failed',
        type: 'error',
      });
    }
  };

  const handleAlertClose = () => {
    const shouldRedirect = alert?.redirect;
    setAlert(null);
    if (shouldRedirect) navigate('/login');
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
      {alert && (
        <AlertModal
          message={alert.message}
          type={alert.type}
          onClose={handleAlertClose}
        />
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow rounded p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Register</h2>

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
