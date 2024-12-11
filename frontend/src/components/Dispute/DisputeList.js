import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const DisputeList = () => {
    const { authToken, user } = useAuth();
    const [disputes, setDisputes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDisputes();
    }, [authToken]);

    const fetchDisputes = async () => {
        try {
            const response = await fetch(`/api/disputes`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch disputes');
            }

            const data = await response.json();
            setDisputes(data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const updateDisputeStatus = async (disputeId, newStatus) => {
        try {
            const response = await fetch(`/api/disputes/${disputeId}/status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) {
                throw new Error('Failed to update dispute status');
            }

            // Refresh the disputes list
            fetchDisputes();
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return <div className="text-center py-4">Loading disputes...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center py-4">Error: {error}</div>;
    }

    if (!disputes.length) {
        return (
            <div className="text-center py-4">
                <p>No disputes found {user?.role === 'admin' ? 'in the system' : 'for your account'}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">
                {user?.role === 'admin' ? 'All Disputes' : 'Your Disputes'} ({disputes.length})
            </h2>
            
            {disputes.map((dispute) => (
                <div key={dispute._id} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold text-lg">Transaction ID: {dispute.transactionId}</h3>
                            {user?.role === 'admin' && (
                                <p className="text-gray-600">User: {dispute.username}</p>
                            )}
                            <p className="text-gray-600">Type: {dispute.type}</p>
                            <p className="text-gray-600">Amount: ${dispute.amount}</p>
                            <p className="mt-2">{dispute.description}</p>
                            <p className="text-sm text-gray-500 mt-2">
                                Created: {new Date(dispute.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className={`px-3 py-1 rounded-full text-sm ${
                                dispute.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                dispute.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                dispute.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                                {dispute.status}
                            </span>
                            {user?.role === 'admin' && dispute.status === 'pending' && (
                                <div className="flex flex-col gap-2 mt-2">
                                    <button
                                        onClick={() => updateDisputeStatus(dispute._id, 'resolved')}
                                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                    >
                                        Resolve
                                    </button>
                                    <button
                                        onClick={() => updateDisputeStatus(dispute._id, 'rejected')}
                                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DisputeList; 