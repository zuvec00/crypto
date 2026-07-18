import { useState } from 'react';
import { Loader2, Lock, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { apiService } from '../../services/api';

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const notify = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword.length < 8) {
      notify('error', 'New password must be at least 8 characters');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      notify('error', 'New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const result = await apiService.changePassword(
        formData.currentPassword,
        formData.newPassword,
      );
      notify('success', result.message || 'Password updated successfully');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const passwordField = (
    label: string,
    field: 'currentPassword' | 'newPassword' | 'confirmPassword',
    visibilityKey: 'current' | 'new' | 'confirm',
    placeholder: string,
  ) => (
    <div>
      <label className="block text-sm font-medium text-soft-white mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPasswords[visibilityKey] ? 'text' : 'password'}
          required
          value={formData[field]}
          onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
          className="w-full p-3 pr-12 bg-medium-gray border border-light-gray rounded-lg focus:ring-2 focus:ring-metallic-gold focus:border-transparent text-soft-white"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() =>
            setShowPasswords({ ...showPasswords, [visibilityKey]: !showPasswords[visibilityKey] })
          }
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
        >
          {showPasswords[visibilityKey] ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {notification && (
        <div className={`fixed bottom-4 right-4 z-50 flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500 bg-opacity-20 border border-green-500' : 'bg-red-500 bg-opacity-20 border border-red-500'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-green-400" />
          ) : (
            <XCircle className="h-5 w-5 text-red-400" />
          )}
          <p className={notification.type === 'success' ? 'text-green-400' : 'text-red-400'}>
            {notification.message}
          </p>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-soft-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account settings</p>
      </div>

      <div className="bg-dark-gray rounded-xl border border-medium-gray p-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center space-x-3 mb-6">
            <div className="h-10 w-10 bg-metallic-gold bg-opacity-20 rounded-full flex items-center justify-center">
              <Lock className="h-5 w-5 text-metallic-gold" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-soft-white">Change Password</h3>
              <p className="text-sm text-gray-400">Update the password you use to log in</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {passwordField('Current Password', 'currentPassword', 'current', 'Enter your current password')}
            {passwordField('New Password', 'newPassword', 'new', 'At least 8 characters')}
            {passwordField('Confirm New Password', 'confirmPassword', 'confirm', 'Re-enter your new password')}

            <button
              type="submit"
              disabled={
                loading ||
                !formData.currentPassword ||
                !formData.newPassword ||
                !formData.confirmPassword
              }
              className="w-full py-3 px-4 bg-metallic-gold text-primary-black rounded-lg hover:bg-gold-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Lock className="h-5 w-5" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
