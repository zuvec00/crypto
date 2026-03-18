import { useState } from 'react';
import { Clock, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import { useWithdrawalRequests } from '../../hooks/useWithdrawalRequests';

export default function AdminWithdrawals() {
  const { requests, loading, error, markAsCompleted, markAsFailed } = useWithdrawalRequests();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleMarkCompleted = async (id: string) => {
    try {
      setProcessingId(id);
      await markAsCompleted(id);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleMarkFailed = async (id: string) => {
    try {
      setProcessingId(id);
      await markAsFailed(id);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500 bg-opacity-20 text-yellow-400';
      case 'completed':
        return 'bg-metallic-gold bg-opacity-20 text-metallic-gold';
      case 'failed':
        return 'bg-red-500 bg-opacity-20 text-red-400';
      default:
        return 'bg-gray-500 bg-opacity-20 text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-soft-white mb-2">Withdrawal Requests</h1>
          <p className="text-gray-400">Manage NGN withdrawal requests from users</p>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-400">Loading withdrawal requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-soft-white mb-2">Withdrawal Requests</h1>
          <p className="text-gray-400">Manage NGN withdrawal requests from users</p>
        </div>
        <div className="text-center py-12">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-soft-white mb-2">Withdrawal Requests</h1>
          <p className="text-gray-400">Manage NGN withdrawal requests from users</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-1 bg-yellow-500 bg-opacity-20 rounded-full">
            <Clock className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-400">
              {requests.filter(r => r.status === 'pending').length} Pending
            </span>
          </div>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="bg-dark-gray rounded-xl border border-medium-gray p-12 text-center">
          <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No withdrawal requests found</p>
          <p className="text-gray-500 text-sm mt-2">Withdrawal requests will appear here when users request NGN withdrawals</p>
        </div>
      ) : (
        <div className="bg-dark-gray rounded-xl border border-medium-gray">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-medium-gray">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Currency</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-medium-gray">
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-soft-white">{request.userName}</p>
                        <p className="text-sm text-gray-400">{request.userEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-soft-white">₦{parseFloat(request.ngnAmount).toLocaleString()}</p>
                        <p className="text-xs text-gray-400">{request.cryptoAmount} {request.currency}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-soft-white">
                      <span className="px-2 py-1 bg-electric-blue bg-opacity-20 text-electric-blue rounded text-xs font-medium">
                        {request.currency}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(request.status)}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {request.status === 'pending' ? (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleMarkCompleted(request.id)}
                            disabled={processingId === request.id}
                            className="bg-metallic-gold text-primary-black px-3 py-1 rounded text-xs font-medium hover:bg-gold-hover transition-colors disabled:opacity-50 flex items-center space-x-1"
                          >
                            <CheckCircle className="h-3 w-3" />
                            <span>{processingId === request.id ? 'Processing...' : 'Complete'}</span>
                          </button>
                          <button
                            onClick={() => handleMarkFailed(request.id)}
                            disabled={processingId === request.id}
                            className="bg-red-500 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center space-x-1"
                          >
                            <XCircle className="h-3 w-3" />
                            <span>Failed</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">No actions</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}