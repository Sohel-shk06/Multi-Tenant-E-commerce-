const DashboardHero = ({ user, recentOrders = [] }) => {
  // Today Analytics
  const today = new Date().toDateString();

  // Today's Orders
  const todayOrders = recentOrders.filter(
    (order) => new Date(order.createdAt).toDateString() === today,
  );

  const todayOrdersCount = todayOrders.length;

  // Today's Revenue
  const todayRevenue = todayOrders.reduce(
    (total, order) => total + order.totalAmount,
    0,
  );

  // Yesterday Analytics
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const yesterdayOrders = recentOrders.filter((order) => {
    const orderDate = new Date(order.createdAt);

    return (
      orderDate.getDate() === yesterday.getDate() &&
      orderDate.getMonth() === yesterday.getMonth() &&
      orderDate.getFullYear() === yesterday.getFullYear()
    );
  });

  const yesterdayRevenue = yesterdayOrders.reduce(
    (sum, order) => sum + order.totalAmount,
    0,
  );

  // Revenue Growth %
  const growth =
    yesterdayRevenue > 0
      ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100
      : todayRevenue > 0
        ? 100
        : 0;
  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-700 to-blue-500 p-8 text-white shadow-xl">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-purple-400/15 rounded-full blur-3xl"></div>

      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        {/* Left Content */}
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name}! 👋</h1>

          <p className="text-white/80 mt-2">
            Here's what's happening with your store today.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8">
            <div>
              <p className="text-sm text-white/70">Today's Revenue</p>
              <h3 className="text-2xl font-bold">{todayRevenue}</h3>
            </div>

            <div>
              <p className="text-sm text-white/70">Today's Orders</p>
              <h3 className="text-2xl font-bold">{todayOrdersCount}</h3>
            </div>

            <div>
              <p className="text-sm text-white/70">Conversion Rate</p>
              <h3 className="text-2xl font-bold">0%</h3>
            </div>

            <div>
              <p className="text-sm text-white/70">Store Visitors</p>
              <h3 className="text-2xl font-bold">0</h3>
            </div>
          </div>
        </div>

        {/* Right Illustration */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="relative">
            <div className="relative w-44 h-44 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl flex items-center justify-center">
              <div className="absolute -right-5 top-6 w-14 h-14 rounded-full bg-purple-400/20 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-lg"></div>

              <svg
                className="relative z-10"
                width="95"
                height="95"
                viewBox="0 0 100 100"
                fill="none"
              >
                <path
                  d="M15 70 L35 50 L50 60 L80 30"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="35" cy="50" r="4" fill="white" />
                <circle cx="50" cy="60" r="4" fill="white" />
                <circle cx="80" cy="30" r="4" fill="white" />
              </svg>
            </div>

            <div className="absolute -right-5 top-6 w-14 h-14 rounded-full bg-emerald-400/20 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-lg">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
              >
                <path d="M7 17L17 7" />
                <path d="M9 7H17V15" />
              </svg>
            </div>

            <div className="absolute -left-6 bottom-5 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg">
              <p className="text-xs text-white">Revenue</p>

              <p
                className={`text-xs font-medium ${
                  growth >= 0 ? "text-emerald-300" : "text-red-300"
                }`}
              >
                {growth >= 0 ? "+" : ""}
                {growth.toFixed(1)}%
              </p>
            </div>

            <div className="absolute left-1/2 -translate-x-1/2 -bottom-8 w-32 h-8 bg-purple-400/40 blur-2xl rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHero;
