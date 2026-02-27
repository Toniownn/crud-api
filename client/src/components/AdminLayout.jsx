import { Link, useLocation } from 'react-router-dom';
import {
  ChartBarIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: ChartBarIcon },
  { path: '/admin/orders', label: 'Orders', icon: ClipboardDocumentListIcon },
  { path: '/admin/users', label: 'Users', icon: UsersIcon },
];

export default function AdminLayout({ children }) {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <aside className="w-56 bg-[#F0F0F0] p-4">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-black">
          <Cog6ToothIcon className="w-5 h-5 text-black" />
          Admin Panel
        </h2>
        <nav className="flex flex-col gap-1">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-2.5 px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                pathname === path
                  ? 'bg-black text-white rounded-full'
                  : 'text-gray-600 hover:bg-gray-200 rounded-full'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
