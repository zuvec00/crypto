import React, { memo } from 'react';
import { ToggleLeft, ToggleRight } from 'lucide-react';

interface UserRowProps {
  user: any;
  toggleLoading: boolean;
  isHidden: boolean;
  onToggleStatus: (userId: string) => void;
  onToggleVisibility: () => void;
}

export const UserRow = memo(function UserRow({ user, toggleLoading, isHidden, onToggleStatus, onToggleVisibility }: UserRowProps) {
  return (
    <>
      <tr className="hover:bg-medium-gray transition-colors">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex flex-col">
            <span className="font-medium text-soft-white">{isHidden ? '****** ******' : `${user.firstname} ${user.lastname}`}</span>
            <span className="text-sm text-gray-400">{isHidden ? '****@****.***' : user.email}</span>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">
          {isHidden ? '********...' : (user.quidaxSubAccountId ? `${user.quidaxSubAccountId.slice(0, 8)}...` : 'Not created')}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
          {isHidden ? '₦*****' : (user.balance ? `₦${parseFloat(user.balance).toLocaleString()}` : 'Loading...')}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.status === 'active'
              ? 'bg-metallic-gold bg-opacity-20 text-metallic-gold'
              : 'bg-red-500 bg-opacity-20 text-red-400'
            }`}>
            {user.status}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center space-x-2">
            <button
              onClick={onToggleVisibility}
              className="text-gray-400 hover:text-soft-white transition-colors"
            >
              {isHidden ? 'Show' : 'Hide'}
            </button>
            <button
              onClick={() => onToggleStatus(user.id)}
              disabled={toggleLoading}
              className="text-electric-blue hover:text-metallic-gold transition-colors disabled:opacity-50"
            >
              {toggleLoading ? (
                <div className="animate-spin h-5 w-5 border-2 border-electric-blue border-t-transparent rounded-full" />
              ) : user.status === 'active' ? (
                <ToggleRight className="h-5 w-5" />
              ) : (
                <ToggleLeft className="h-5 w-5" />
              )}
            </button>
          </div>
        </td>
      </tr>


    </>
  )
});