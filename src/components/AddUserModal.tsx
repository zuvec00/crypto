import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

interface AddUserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (userData: { firstname: string; lastname: string; email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
}

export default function AddUserSidebar({ isOpen, onClose, onAddUser }: AddUserSidebarProps) {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await onAddUser(formData);
    
    if (result.success) {
      setFormData({ firstname: '', lastname: '', email: '', password: '' });
      onClose();
    } else {
      setError(result.error || 'Failed to add user');
    }
    
    setLoading(false);
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />}
      <div className={`fixed top-0 right-0 h-full w-96 bg-dark-gray border-l border-medium-gray transform transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-soft-white">Add New Worker</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-soft-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-soft-white mb-1">First Name</label>
            <input
              type="text"
              required
              value={formData.firstname}
              onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
              className="w-full p-3 bg-medium-gray border border-light-gray rounded-lg focus:ring-2 focus:ring-metallic-gold focus:border-transparent text-soft-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-soft-white mb-1">Last Name</label>
            <input
              type="text"
              required
              value={formData.lastname}
              onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
              className="w-full p-3 bg-medium-gray border border-light-gray rounded-lg focus:ring-2 focus:ring-metallic-gold focus:border-transparent text-soft-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-soft-white mb-1">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3 bg-medium-gray border border-light-gray rounded-lg focus:ring-2 focus:ring-metallic-gold focus:border-transparent text-soft-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-soft-white mb-1">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-3 bg-medium-gray border border-light-gray rounded-lg focus:ring-2 focus:ring-metallic-gold focus:border-transparent text-soft-white"
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm">{error}</div>
          )}

            <div className="flex space-x-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 px-4 border border-light-gray text-gray-400 rounded-lg hover:bg-medium-gray transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 px-4 bg-metallic-gold text-primary-black rounded-lg hover:bg-gold-hover transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}