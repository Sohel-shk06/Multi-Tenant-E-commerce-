import { StatsCard } from '../../components/cards/StatsCard';
import { DollarSign, Users, Store, ShoppingCart, TrendingUp, Percent } from 'lucide-react';

export const DashboardStats = ({ stats }) => {
  if (!stats) return null;

  const cards = [
    { title: 'Total Revenue',     value: `₹${stats.totalRevenue?.toLocaleString() || 0}`,     icon: DollarSign,   trend: 'up', trendValue: '12%', color: 'blue'   },
    { title: 'Total Vendors',     value: stats.totalVendors || 0,                              icon: Store,        trend: 'up', trendValue: '5%',  color: 'purple' },
    { title: 'Total Customers',   value: stats.totalCustomers || 0,                            icon: Users,        trend: 'up', trendValue: '8%',  color: 'green'  },
    { title: 'Total Orders',      value: stats.totalOrders || 0,                               icon: ShoppingCart, trend: 'up', trendValue: '15%', color: 'orange' },
    { title: 'Subscription MRR',  value: `₹${stats.subscriptionMRR?.toLocaleString() || 0}`,  icon: TrendingUp,   color: 'blue'   },
    { title: 'Commission Earned', value: `₹${stats.commissionEarned?.toLocaleString() || 0}`, icon: Percent,      color: 'green'  },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((card, index) => (
          <StatsCard key={index} {...card} />
        ))}
      </div>
    </div>
  );
};