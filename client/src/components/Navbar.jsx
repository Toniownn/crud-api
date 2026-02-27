import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShoppingCartIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

export default function Navbar() {
  const { token, customer, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-10">
        <Link to="/" className="text-2xl font-black uppercase text-black">
          SHOP.CO
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/catalog"
            className="text-sm text-gray-600 hover:text-black transition-colors"
          >
            Catalog
          </Link>

          {token && (
            <>
              <Link
                to="/orders"
                className="text-sm text-gray-600 hover:text-black transition-colors"
              >
                My Orders
              </Link>
              {isAdmin && (
                <>
                  <Link
                    to="/products"
                    className="text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    Products
                  </Link>
                  <Link
                    to="/admin"
                    className="text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    Admin
                  </Link>
                </>
              )}
              <Link
                to="/assistant"
                className="text-sm text-gray-600 hover:text-black transition-colors"
              >
                Assistant
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-5">
        {token ? (
          <>
            <Link to="/cart" className="text-black hover:text-gray-600 transition-colors">
              <ShoppingCartIcon className="w-6 h-6" />
            </Link>
            <Link to="/profile" className="text-black hover:text-gray-600 transition-colors">
              <UserCircleIcon className="w-6 h-6" />
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-black transition-colors font-medium"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-sm text-gray-600 hover:text-black transition-colors font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-black hover:bg-gray-800 text-white rounded-full px-6 py-2 text-sm font-medium transition-colors"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
