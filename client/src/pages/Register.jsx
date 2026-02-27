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
          <h2 className="text-2xl font-black uppercase text-black mb-6">Register</h2>

          {fields.map(({ name, label, type }) => (
            <label key={name} className="block mb-4">
              <span className="text-gray-600 text-sm font-medium">{label}</span>
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                required
                className="mt-1 block w-full bg-[#F0F0F0] border-0 rounded-full px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </label>
          ))}

          <button
            type="submit"
            className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-full font-medium transition-colors"
          >
            Register
          </button>

          <p className="mt-4 text-sm text-gray-500 text-center">
            Already have an account? <Link to="/login" className="text-black hover:text-gray-600 font-medium">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
