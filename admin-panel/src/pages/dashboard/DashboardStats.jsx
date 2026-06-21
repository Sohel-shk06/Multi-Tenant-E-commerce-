import { StatsCard } from '../../components/cards/StatsCard';

export const DashboardStats = ({ stats }) => {
  if (!stats) return null;

  const cards = [
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue?.toLocaleString() || 0}`,
      trend: 'up',
      trendValue: '12%',
      pct: 72,
      color: '#4338CA',
    },
    {
      title: 'Total Vendors',
      value: stats.totalVendors || 0,
      trend: 'up',
      trendValue: '5%',
      pct: 58,
      color: '#6366F1',
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers || 0,
      trend: 'up',
      trendValue: '8%',
      pct: 64,
      color: '#312E81',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders || 0,
      trend: 'up',
      trendValue: '15%',
      pct: 81,
      color: '#4338CA',
    },
    {
      title: 'Subscription MRR',
      value: `₹${stats.subscriptionMRR?.toLocaleString() || 0}`,
      pct: 53,
      color: '#818CF8',
    },
    {
      title: 'Commission Earned',
      value: `₹${stats.commissionEarned?.toLocaleString() || 0}`,
      pct: 44,
      color: '#312E81',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {cards.map((card, index) => (
        <StatsCard key={index} {...card} />
      ))}
    </div>
  );
};