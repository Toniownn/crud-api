import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AlertModal from '../components/AlertModal';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      setAlert({ message: 'Login successful!', type: 'success', redirect: true });
    } catch (err) {
      setAlert({
        message: err.response?.data?.message || 'Login failed',
        type: 'error',
      });
    }
  };

  const handleAlertClose = () => {
    const shouldRedirect = alert?.redirect;
    setAlert(null);
    if (shouldRedirect) navigate('/products');
  };

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
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Login</h2>

        <label className="block mb-4">
          <span className="text-gray-700 text-sm">Username</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <label className="block mb-6">
          <span className="text-gray-700 text-sm">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium"
        >
          Login
        </button>

        <p className="mt-4 text-sm text-gray-600 text-center">
          No account? <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
        </p>
      </form>
    </div>
  );
}
