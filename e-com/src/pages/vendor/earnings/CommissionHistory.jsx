import { useEffect, useState } from 'react';
import { vendorService } from '../../../services/vendor.service';
import { TrendingDown } from 'lucide-react';

export const CommissionHistory = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await vendorService.getMonthlyEarnings();
      // Calculate commission (10%) for each month
      const formatted = data.map(d => ({
        month: d.month,
        revenue: d.revenue,
        commission: d.revenue * 0.10
      })).reverse(); // Show newest first
      setMonthlyData(formatted);
    } catch (error) {
      console.error('Failed to load monthly data', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Commission History</h1>
        <p className="text-sm text-gray-500 mt-1">Monthly breakdown of platform commissions deducted.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {monthlyData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Month</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Total Revenue</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Platform Commission (10%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {monthlyData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 capitalize">
                      {new Date(row.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right">₹{row.revenue.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-red-600 text-right flex items-center justify-end">
                      <TrendingDown className="w-4 h-4 mr-1" />
                      ₹{row.commission.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">No commission history available yet.</div>
        )}
      </div>
    </div>
  );
};