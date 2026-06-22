import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Store, Users, Package, ShoppingCart,
  DollarSign, CreditCard, Percent, AlertCircle, BarChart3,
  Settings, LogOut, ChevronDown, X, Menu, TrendingUp
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState({});

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
    },
    {
      title: 'Vendors',
      icon: Store,
      children: [
        { title: 'All Vendors', path: '/admin/vendors' },
        { title: 'Pending Approval', path: '/admin/vendors/pending' },
        { title: 'Suspended', path: '/admin/vendors/suspended' },
      ],
    },
    {
      title: 'Stores',
      icon: Package,
      path: '/admin/stores',
    },
    {
      title: 'Products',
      icon: Package,
      children: [
        { title: 'All Products', path: '/admin/products' },
        { title: 'Categories', path: '/admin/categories' },
        { title: 'Moderation', path: '/admin/products/moderation' },
      ],
    },
    {
      title: 'Orders',
      icon: ShoppingCart,
      children: [
        { title: 'All Orders', path: '/admin/orders' },
        { title: 'Pending', path: '/admin/orders/pending' },
        { title: 'Completed', path: '/admin/orders/completed' },
        { title: 'Cancelled', path: '/admin/orders/cancelled' },
      ],
    },
    {
      title: 'Payments',
      icon: CreditCard,
      children: [
        { title: 'Transactions', path: '/admin/payments' },
        { title: 'Payouts', path: '/admin/payments/payouts' },
        { title: 'Refunds', path: '/admin/payments/refunds' },
        { title: 'Failed', path: '/admin/payments/failed' },
        { title: 'Analytics', path: '/admin/payments/analytics' },
      ],
    },
    // {
    //   title: 'Subscriptions',
    //   icon: DollarSign,
    //   children: [
    //     { title: 'Plans', path: '/admin/subscriptions/plans' },
    //     { title: 'Active Subscriptions', path: '/admin/subscriptions/active' },
    //     { title: 'Billing History', path: '/admin/subscriptions/billing' },
    //   ],
    // },
    {
      title: 'Commissions',
      icon: Percent,
      path: '/admin/commissions',
    },
    {
      title: 'Disputes',
      icon: AlertCircle,
      path: '/admin/disputes',
    },
    {
      title: 'Analytics',
      icon: TrendingUp,
      children: [
        { title: 'Vendors', path: '/admin/analytics/vendors' },
        { title: 'Customers', path: '/admin/analytics/customers' },
        { title: 'Sales', path: '/admin/analytics/sales' },
        { title: 'Products', path: '/admin/analytics/products' },
        { title: 'Orders', path: '/admin/analytics/orders' },
        { title: 'Commissions', path: '/admin/analytics/commissions' },
        { title: 'Subscriptions', path: '/admin/analytics/subscriptions' },
        { title: 'Revenue', path: '/admin/analytics/revenue' },
      ],
    },
    {
      title: 'Settings',
      icon: Settings,
      children: [
        { title: 'General', path: '/admin/settings/general'},
        { title: 'Security', path: '/admin/settings/security' },
        { title: 'Commission', path: '/admin/settings/commission' },
        { title: 'Payment', path: '/admin/settings/payment' },
        { title: 'Email', path: '/admin/settings/email' },
        { title: 'Notifications', path: '/admin/settings/notifications' },
        { title: 'Storage', path: '/admin/settings/storage' },
        { title: 'System', path: '/admin/settings/system' },
      ]
    }
  ];

  const toggleMenu = (title) => {
    setExpandedMenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const isActive = (path) => location.pathname === path;
  const isParentActive = (children) => children?.some(child => location.pathname.startsWith(child.path));

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Marketplace</span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-md hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* User Info */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@marketplace.com'}</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = expandedMenus[item.title];
              const parentActive = isParentActive(item.children);

              if (hasChildren) {
                return (
                  <div key={item.title}>
                    <button
                      onClick={() => toggleMenu(item.title)}
                      className={`
                        w-full flex items-center justify-between px-3 py-2.5 rounded-lg
                        transition-colors text-left
                        ${parentActive
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-5 h-5 ${parentActive ? 'text-blue-600' : 'text-gray-500'}`} />
                        <span className="text-sm font-medium">{item.title}</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>

                    {isExpanded && (
                      <div className="ml-8 mt-1 space-y-1">
                        {item.children.map((child) => (
                          <NavLink
                            key={child.path}
                            to={child.path}
                            onClick={onClose}
                            className={`
                              block px-3 py-2 rounded-lg text-sm transition-colors
                              ${isActive(child.path)
                                ? 'bg-blue-600 text-white font-medium'
                                : 'text-gray-600 hover:bg-gray-100'
                              }
                            `}
                          >
                            {child.title}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`
                    flex items-center space-x-3 px-3 py-2.5 rounded-lg
                    transition-colors
                    ${isActive(item.path)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive(item.path) ? 'text-white' : 'text-gray-500'}`} />
                  <span className="text-sm font-medium">{item.title}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={logout}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};