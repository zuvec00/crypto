import { useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { useUsers } from '../../hooks/useUsers';
import { UserRow } from '../../components/UserRow';
import AddUserSidebar from '../../components/AddUserModal';

export default function UsersPage() {
  const { users, loading, error, refetch, toggleUserStatus, addUser } = useUsers();
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [hiddenRows, setHiddenRows] = useState<Set<string>>(new Set());



  const handleToggleStatus = async (userId: string) => {
    setToggleLoading(userId);
    await toggleUserStatus(userId);
    setToggleLoading(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-soft-white mb-2">User Management</h1>
          <p className="text-gray-400">Manage platform users and their access</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-metallic-gold text-primary-black px-4 py-2 rounded-lg hover:bg-gold-hover transition-all"
        >
          Add New User
        </button>
      </div>

      <div className="bg-dark-gray rounded-xl border border-medium-gray">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-medium-gray">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Sub-Account ID</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Balance</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-medium-gray">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-metallic-gold mx-auto mb-2" />
                    <p className="text-gray-400">Loading users...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <AlertCircle className="h-6 w-6 text-red-400 mx-auto mb-2" />
                    <p className="text-red-400 mb-2">{error}</p>
                    <button
                      onClick={refetch}
                      className="text-metallic-gold hover:opacity-80 text-sm"
                    >
                      Try again
                    </button>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    No workers found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    toggleLoading={toggleLoading === user.id}
                    isHidden={hiddenRows.has(user.id)}
                    onToggleStatus={handleToggleStatus}
                    onToggleVisibility={() => {
                      const newHidden = new Set(hiddenRows);
                      if (hiddenRows.has(user.id)) {
                        newHidden.delete(user.id);
                      } else {
                        newHidden.add(user.id);
                      }
                      setHiddenRows(newHidden);
                    }}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddUserSidebar
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddUser={addUser}
      />
    </div>
  );
}