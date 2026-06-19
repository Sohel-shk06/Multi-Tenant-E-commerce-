import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { vendorService } from '../../../services/vendor.service';
import { DollarSign, TrendingUp, Wallet, ArrowRight, AlertCircle } from 'lucide-react';

export const EarningsOverview = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await vendorService.getEarningsOverview();
      setOverview(data);
    } catch (err) {
      console.error('Failed to load overview', err);
      setError(err.response?.data?.message || 'Failed to load earnings data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
        <button onClick={loadData} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Retry
        </button>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="p-6">
        <p className="text-gray-500">No data available.</p>
      </div>
    );
  }

  const cards = [
    { 
      title: 'Total Revenue', 
      value: overview.totalRevenue || 0, 
      icon: DollarSign, 
      color: 'blue', 
      sub: 'From completed orders' 
    },
    { 
      title: 'Platform Commission (10%)', 
      value: overview.platformCommission || 0, 
      icon: TrendingUp, 
      color: 'orange', 
      sub: 'Deducted by platform' 
    },
    { 
      title: 'Total Paid Out', 
      value: overview.totalPaid || 0, 
      icon: Wallet, 
      color: 'green', 
      sub: 'Successfully withdrawn' 
    },
    { 
      title: 'Available Balance', 
      value: overview.availableBalance || 0, 
      icon: Wallet, 
      color: 'emerald', 
      sub: 'Ready for withdrawal', 
      isHighlight: true 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Earnings Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Track your revenue and available balance.</p>
        </div>
        <Link to="/vendor/earnings/payouts" className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          <span>Request Payout</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div 
              key={idx} 
              className={`p-6 rounded-xl shadow-sm border ${
                card.isHighlight 
                  ? 'bg-gradient-to-br from-green-500 to-teal-600 text-white border-transparent' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`text-sm font-medium ${card.isHighlight ? 'text-green-100' : 'text-gray-500'}`}>
                  {card.title}
                </span>
                <div className={`p-2 rounded-lg ${card.isHighlight ? 'bg-white/20' : `bg-${card.color}-50`}`}>
                  <Icon className={`w-5 h-5 ${card.isHighlight ? 'text-white' : `text-${card.color}-600`}`} />
                </div>
              </div>
              <p className="text-2xl font-bold">
                ₹{(card.value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className={`text-xs mt-1 ${card.isHighlight ? 'text-green-100' : 'text-gray-500'}`}>
                {card.sub}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};