import { useEffect, useState } from 'react';
import { getAllUsers, toggleUserStatus } from '../../api/admin';
import AdminLayout from '../../components/AdminLayout';
import AlertModal from '../../components/AlertModal';
import { LockOpenIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await getAllUsers();
      setUsers(data);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleToggle = async (customer_id) => {
    try {
      await toggleUserStatus(customer_id);
      setAlert({ message: 'User status updated successfully', type: 'success' });
      await load();
    } catch (err) {
      setAlert({
        message: err.response?.data?.message || err.response?.data?.error || 'Failed to update user status',
        type: 'error',
      });
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-black uppercase text-black mb-8">User Management</h1>

      {alert && (
        <AlertModal
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      {loading && <p className="text-gray-500">Loading...</p>}

      {!loading && (
        <div className="bg-white rounded-[20px] border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#F0F0F0]">
              <tr>
                <th className="px-6 py-3 text-gray-600 text-xs font-semibold uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-gray-600 text-xs font-semibold uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-gray-600 text-xs font-semibold uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-gray-600 text-xs font-semibold uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-gray-600 text-xs font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const auth = user.customer_auth || {};
                const isDisabled = auth.disabled === true;
                return (
                  <tr
                    key={user.customer_id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${isDisabled ? 'text-gray-400' : ''}`}
                  >
                    <td className={`px-6 py-4 ${isDisabled ? 'text-gray-400' : 'text-black'}`}>
                      {user.fname} {user.lname}
                    </td>
                    <td className={`px-6 py-4 ${isDisabled ? 'text-gray-400' : 'text-black'}`}>
                      {auth.username}
                    </td>
                    <td className={`px-6 py-4 ${isDisabled ? 'text-gray-400' : 'text-black'}`}>
                      {auth.role || 'user'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isDisabled
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {isDisabled ? 'Disabled' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggle(user.customer_id)}
                        className={`${
                          isDisabled
                            ? 'bg-black hover:bg-gray-800'
                            : 'bg-red-500 hover:bg-red-600'
                        } text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors inline-flex items-center gap-1.5`}
                      >
                        {isDisabled ? (
                          <>
                            <LockOpenIcon className="w-4 h-4" />
                            Enable
                          </>
                        ) : (
                          <>
                            <LockClosedIcon className="w-4 h-4" />
                            Disable
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
