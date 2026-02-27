import { useState, useEffect } from 'react';
import { getProfile, updateProfile, changePassword } from '../api/customer';
import { UserCircleIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import AlertModal from '../components/AlertModal';

export default function Profile() {
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      const data = res.data;
      setFname(data.fname || '');
      setLname(data.lname || '');
      setAddress(data.address || '');
    } catch (err) {
      setAlert({ message: err.response?.data?.message || 'Failed to load profile', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ fname, lname, address });
      setAlert({ message: 'Profile updated successfully', type: 'success' });
    } catch (err) {
      setAlert({ message: err.response?.data?.message || 'Failed to update profile', type: 'error' });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setAlert({ message: 'New passwords do not match', type: 'error' });
      return;
    }
    try {
      await changePassword(currentPassword, newPassword);
      setAlert({ message: 'Password changed successfully', type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setAlert({ message: err.response?.data?.message || 'Failed to change password', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-gray-500">Loading...</div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {alert && (
        <AlertModal
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="bg-white rounded-[20px] border border-gray-200 p-6 mb-6">
        <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
          <UserCircleIcon className="w-7 h-7 text-black" />
          Profile
        </h2>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">First Name</label>
            <input
              type="text"
              value={fname}
              onChange={(e) => setFname(e.target.value)}
              className="w-full bg-[#F0F0F0] border-0 rounded-full px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Last Name</label>
            <input
              type="text"
              value={lname}
              onChange={(e) => setLname(e.target.value)}
              className="w-full bg-[#F0F0F0] border-0 rounded-full px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-[#F0F0F0] border-0 rounded-full px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <button
            type="submit"
            className="bg-black hover:bg-gray-800 text-white px-6 py-2.5 rounded-full font-medium transition-colors"
          >
            Update Profile
          </button>
        </form>
      </div>

      <div className="bg-white rounded-[20px] border border-gray-200 p-6 mb-6">
        <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
          <LockClosedIcon className="w-7 h-7 text-black" />
          Change Password
        </h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-[#F0F0F0] border-0 rounded-full px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-[#F0F0F0] border-0 rounded-full px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#F0F0F0] border-0 rounded-full px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <button
            type="submit"
            className="bg-black hover:bg-gray-800 text-white px-6 py-2.5 rounded-full font-medium transition-colors"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}
