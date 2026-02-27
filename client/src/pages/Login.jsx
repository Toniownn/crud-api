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
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-white">
      {alert && (
        <AlertModal
          message={alert.message}
          type={alert.type}
          onClose={handleAlertClose}
        />
      )}

      <div className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="bg-white rounded-[20px] border border-gray-200 p-8">
          <h2 className="text-2xl font-black uppercase text-black mb-6">Login</h2>

          <label className="block mb-4">
            <span className="text-gray-600 text-sm font-medium">Username</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 block w-full bg-[#F0F0F0] border-0 rounded-full px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </label>

          <label className="block mb-6">
            <span className="text-gray-600 text-sm font-medium">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full bg-[#F0F0F0] border-0 rounded-full px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </label>

          <button
            type="submit"
            className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-full font-medium transition-colors"
          >
            Login
          </button>

          <p className="mt-4 text-sm text-gray-500 text-center">
            No account? <Link to="/register" className="text-black hover:text-gray-600 font-medium">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
