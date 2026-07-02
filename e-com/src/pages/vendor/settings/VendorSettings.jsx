import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../../services/user.service';
import { ChangePassword } from '../profile/ChangePassword';
import { 
  User as UserIcon, Building2, Bell, Shield, CreditCard, 
  Save, AlertTriangle, Trash2, Eye, EyeOff 
} from 'lucide-react';

export const VendorSettings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [settings, setSettings] = useState(null);

  // Form states
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
  const [businessInfo, setBusinessInfo] = useState({
    businessName: '', gstNumber: '', panNumber: '',
    businessAddress: { address: '', city: '', state: '', zipCode: '', country: 'India' }
  });
  const [bankDetails, setBankDetails] = useState({
    accountHolder: '', accountNumber: '', ifscCode: '', bankName: ''
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: true, orderUpdates: true, newReviews: true,
    payoutUpdates: true, promotionalEmails: false, lowStockAlerts: true
  });
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await userService.getVendorSettings();
      setSettings(data);
      setProfile(data.profile || {});
      setBusinessInfo(data.businessInfo || {});
      setNotifications(data.notificationPreferences || {});
      if (data.businessInfo?.bankDetails) {
        setBankDetails(data.businessInfo.bankDetails);
      }
    } catch (error) {
      showMessage('error', 'Failed to load settings');
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  // ===== Profile Update =====
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await userService.updateProfile(profile);
      showMessage('success', 'Profile updated successfully!');
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // ===== Business Info Update =====
  const handleBusinessInfoUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await userService.updateBusinessInfo(businessInfo);
      showMessage('success', 'Business information updated successfully!');
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to update business info');
    } finally {
      setLoading(false);
    }
  };

  // ===== Bank Details Update =====
  const handleBankDetailsUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await userService.updateBankDetails(bankDetails);
      showMessage('success', 'Bank details updated successfully!');
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to update bank details');
    } finally {
      setLoading(false);
    }
  };

  // ===== Notification Preferences Update =====
  const handleNotificationUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await userService.updateNotificationPreferences(notifications);
      showMessage('success', 'Notification preferences updated!');
    } catch (error) {
      showMessage('error', 'Failed to update preferences');
    } finally {
      setLoading(false);
    }
  };

  // ===== Delete Account =====
  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      return showMessage('error', 'Please enter your password');
    }
    setLoading(true);
    try {
      await userService.deleteVendorAccount(deletePassword);
      showMessage('success', 'Account deleted. Redirecting...');
      setTimeout(() => {
        localStorage.clear();
        navigate('/login');
      }, 2000);
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'business', label: 'Business Info', icon: Building2 },
    { id: 'bank', label: 'Bank Details', icon: CreditCard },
    // { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
  ];

  if (!settings) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Vendor Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account, business information, and preferences.</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-lg border flex items-center space-x-2 ${
          message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {message.type === 'success' ? <Save className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 sticky top-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-green-50 text-green-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  } ${tab.id === 'danger' ? 'text-red-600 hover:bg-red-50' : ''}`}
                >
                  <Icon className={`w-5 h-5 ${tab.id === 'danger' ? 'text-red-600' : ''}`} />
                  <span className="text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* ===== PROFILE TAB ===== */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h2>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text" value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email" value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel" value={profile.phone || ''}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      placeholder="+91 9876543210"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
  <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      settings.status === 'active' ? 'bg-green-100 text-green-800' :
      settings.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
      'bg-red-100 text-red-800'
    }`}>
      {settings.status === 'active' ? '✓ Active' :
       settings.status === 'pending' ? '⏳ Pending Approval' :
       '⚠ Suspended'}
    </span>
  </div>
</div>
                </div>
                <div className="pt-4 border-t">
                  <button type="submit" disabled={loading}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2">
                    <Save className="w-4 h-4" />
                    <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ===== BUSINESS INFO TAB ===== */}
          {activeTab === 'business' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Business Information</h2>
              <form onSubmit={handleBusinessInfoUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                    <input
                      type="text" value={businessInfo.businessName || ''}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, businessName: e.target.value })}
                      placeholder="Your registered business name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                    <input
                      type="text" value={businessInfo.gstNumber || ''}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, gstNumber: e.target.value.toUpperCase() })}
                      placeholder="22AAAAA0000A1Z5"
                      maxLength={15}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 font-mono"
                    />
                    <p className="text-xs text-gray-500 mt-1">Format: 22AAAAA0000A1Z5</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
                    <input
                      type="text" value={businessInfo.panNumber || ''}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, panNumber: e.target.value.toUpperCase() })}
                      placeholder="ABCDE1234F"
                      maxLength={10}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 font-mono"
                    />
                    <p className="text-xs text-gray-500 mt-1">Format: ABCDE1234F</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                      <input
                        type="text" value={businessInfo.businessAddress?.address || ''}
                        onChange={(e) => setBusinessInfo({
                          ...businessInfo,
                          businessAddress: { ...businessInfo.businessAddress, address: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text" value={businessInfo.businessAddress?.city || ''}
                        onChange={(e) => setBusinessInfo({
                          ...businessInfo,
                          businessAddress: { ...businessInfo.businessAddress, city: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text" value={businessInfo.businessAddress?.state || ''}
                        onChange={(e) => setBusinessInfo({
                          ...businessInfo,
                          businessAddress: { ...businessInfo.businessAddress, state: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                      <input
                        type="text" value={businessInfo.businessAddress?.zipCode || ''}
                        onChange={(e) => setBusinessInfo({
                          ...businessInfo,
                          businessAddress: { ...businessInfo.businessAddress, zipCode: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                      <input
                        type="text" value={businessInfo.businessAddress?.country || 'India'}
                        onChange={(e) => setBusinessInfo({
                          ...businessInfo,
                          businessAddress: { ...businessInfo.businessAddress, country: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <button type="submit" disabled={loading}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2">
                    <Save className="w-4 h-4" />
                    <span>{loading ? 'Saving...' : 'Save Business Info'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ===== BANK DETAILS TAB ===== */}
          {activeTab === 'bank' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Bank Details</h2>
              <p className="text-sm text-gray-500 mb-6">These details will be used for payout processing.</p>
              
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start space-x-2">
                <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">Your bank information is encrypted and securely stored.</p>
              </div>

              <form onSubmit={handleBankDetailsUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
                    <input
                      type="text" value={bankDetails.accountHolder || ''}
                      onChange={(e) => setBankDetails({ ...bankDetails, accountHolder: e.target.value })}
                      placeholder="As per bank records"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                    <input
                      type="text" value={bankDetails.accountNumber || ''}
                      onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                      placeholder="Your bank account number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                    <input
                      type="text" value={bankDetails.ifscCode || ''}
                      onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value.toUpperCase() })}
                      placeholder="SBIN0001234"
                      maxLength={11}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 font-mono"
                    />
                    <p className="text-xs text-gray-500 mt-1">Format: SBIN0001234</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                    <input
                      type="text" value={bankDetails.bankName || ''}
                      onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                      placeholder="State Bank of India"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <button type="submit" disabled={loading}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2">
                    <Save className="w-4 h-4" />
                    <span>{loading ? 'Saving...' : 'Save Bank Details'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ===== NOTIFICATIONS TAB ===== */}
          {/* {activeTab === 'notifications' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Notification Preferences</h2>
              <p className="text-sm text-gray-500 mb-6">Choose how you want to be notified.</p>

              <form onSubmit={handleNotificationUpdate} className="space-y-4">
                <div className="space-y-3">
                  {[
                    { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive all email notifications from the platform' },
                    { key: 'orderUpdates', label: 'Order Updates', desc: 'Get notified when new orders are placed or status changes' },
                    { key: 'newReviews', label: 'New Reviews', desc: 'Get notified when customers leave reviews on your products' },
                    { key: 'payoutUpdates', label: 'Payout Updates', desc: 'Get notified about payout processing and completion' },
                    { key: 'lowStockAlerts', label: 'Low Stock Alerts', desc: 'Get alerted when product stock falls below threshold' },
                    { key: 'promotionalEmails', label: 'Promotional Emails', desc: 'Receive marketing and promotional emails' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.label}</p>
                        <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer ml-4">
                        <input
                          type="checkbox"
                          checked={notifications[item.key] || false}
                          onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t">
                  <button type="submit" disabled={loading}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2">
                    <Save className="w-4 h-4" />
                    <span>{loading ? 'Saving...' : 'Save Preferences'}</span>
                  </button>
                </div>
              </form>
            </div>
          )} */}

          {/* ===== SECURITY TAB ===== */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Security Settings</h2>
              <p className="text-sm text-gray-500 mb-6">Keep your account secure with a strong password.</p>
              
              <ChangePassword />

              <div className="mt-8 pt-6 border-t">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Information</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">Account created: <span className="font-medium">{new Date(settings.createdAt).toLocaleDateString()}</span></p>
                  <p className="text-gray-600">Account status: <span className={`font-medium ${
                    settings.status === 'active' ? 'text-green-600' :
                    settings.status === 'pending' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {settings.status === 'active' ? 'Active' :
                     settings.status === 'pending' ? 'Pending Approval' :
                     'Suspended'}
                  </span></p>
                </div>
              </div>
            </div>
          )}

          {/* ===== DANGER ZONE TAB ===== */}
          {activeTab === 'danger' && (
            <div className="bg-white rounded-xl shadow-sm border-2 border-red-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <h2 className="text-xl font-bold text-red-600">Danger Zone</h2>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                These actions are irreversible. Please be certain before proceeding.
              </p>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-semibold text-red-900 mb-2">Delete Account</h3>
                <p className="text-sm text-red-700 mb-4">
                  Once you delete your account, there is no going back. All your data, products, stores, and order history will be permanently removed.
                </p>
                
                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>I want to delete my account</span>
                  </button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-red-900">To confirm, enter your password:</p>
                    <input
                      type="password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                    <div className="flex space-x-3">
                      <button
                        onClick={handleDeleteAccount}
                        disabled={loading || !deletePassword}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm font-medium"
                      >
                        {loading ? 'Deleting...' : 'Confirm Delete'}
                      </button>
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeletePassword('');
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};