import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const DisputeForm = ({ onDisputeCreated }) => {
    const { authToken } = useAuth();
    const [disputeData, setDisputeData] = useState({
        type: 'unauthorized',
        description: '',
        transactionId: '',
        amount: ''
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch('${import.meta.env.t}/api/disputes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(disputeData)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to create dispute');
            }

            const data = await response.json();
            setDisputeData({
                type: 'unauthorized',
                description: '',
                transactionId: '',
                amount: ''
            });
            if (onDisputeCreated) {
                onDisputeCreated(data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Submit a Dispute</h2>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 mb-2">Type of Dispute</label>
                    <select
                        value={disputeData.type}
                        onChange={(e) => setDisputeData({...disputeData, type: e.target.value})}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="unauthorized">Unauthorized Transaction</option>
                        <option value="wrong_amount">Wrong Amount</option>
                        <option value="service_not_received">Service Not Received</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700 mb-2">Transaction ID</label>
                    <input
                        type="text"
                        value={disputeData.transactionId}
                        onChange={(e) => setDisputeData({...disputeData, transactionId: e.target.value})}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-2">Amount</label>
                    <input
                        type="number"
                        value={disputeData.amount}
                        onChange={(e) => setDisputeData({...disputeData, amount: e.target.value})}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-2">Description</label>
                    <textarea
                        value={disputeData.description}
                        onChange={(e) => setDisputeData({...disputeData, description: e.target.value})}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="4"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors ${
                        isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Dispute'}
                </button>
            </form>
        </div>
    );
};

export default DisputeForm; 