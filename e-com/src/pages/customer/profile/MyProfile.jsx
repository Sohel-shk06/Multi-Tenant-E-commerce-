import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { userService } from '../../../services/user.service';
import { ChangePassword } from './ChangePassword';
import { 
  User as UserIcon, MapPin, Lock, Save, Plus, Edit, Trash2, 
  Check, Mail, Phone, Shield, Home as HomeIcon, Star, 
  ChevronRight, X, Menu, Camera, Award, Package, Heart,
  TrendingUp, Calendar
} from 'lucide-react';

export const Profile = () => {
  const navigate = useNavigate();
  const { user: authUser } = useSelector((state) => state.auth);
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ type: '', text: '', show: false });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Profile state
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: ''
  });

  // Addresses state
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    label: 'Home',
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    isDefault: false
  });

  useEffect(() => {
    if (!authUser) {
      navigate('/login');
      return;
    }
    loadProfile();
    loadAddresses();
  }, [authUser, navigate]);

  const loadProfile = async () => {
    try {
      const data = await userService.getProfile();
      setProfile({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        avatar: data.avatar || ''
      });
    } catch (error) {
      showToast('error', 'Failed to load profile');
    }
  };

  const loadAddresses = async () => {
    try {
      const data = await userService.getAddresses();
      setAddresses(data || []);
    } catch (error) {
      console.error('Failed to load addresses', error);
    }
  };

  const showToast = (type, text) => {
    setToast({ type, text, show: true });
    setTimeout(() => setToast({ type: '', text: '', show: false }), 3000);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await userService.updateProfile(profile);
      showToast('success', 'Profile updated successfully!');
    } catch (error) {
      showToast('error', error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingAddressId) {
        await userService.updateAddress(editingAddressId, addressForm);
        showToast('success', 'Address updated successfully!');
      } else {
        await userService.addAddress(addressForm);
        showToast('success', 'Address added successfully!');
      }
      await loadAddresses();
      resetAddressForm();
    } catch (error) {
      showToast('error', error.response?.data?.message || 'Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await userService.deleteAddress(addressId);
      await loadAddresses();
      showToast('success', 'Address deleted successfully!');
    } catch (error) {
      showToast('error', error.response?.data?.message || 'Failed to delete address');
    }
  };

  const handleEditAddress = (address) => {
    setAddressForm({
      label: address.label || 'Home',
      fullName: address.fullName || '',
      phone: address.phone || '',
      address: address.address || '',
      city: address.city || '',
      state: address.state || '',
      zipCode: address.zipCode || '',
      country: address.country || 'India',
      isDefault: address.isDefault || false
    });
    setEditingAddressId(address._id);
    setShowAddressForm(true);
  };

  const resetAddressForm = () => {
    setAddressForm({
      label: 'Home',
      fullName: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India',
      isDefault: false
    });
    setEditingAddressId(null);
    setShowAddressForm(false);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: UserIcon, description: 'Personal information' },
    { id: 'addresses', label: 'Addresses', icon: MapPin, description: 'Delivery addresses' },
    { id: 'password', label: 'Password', icon: Lock, description: 'Change password' },
    { id: 'reviews', label: 'My Reviews', icon: Star, description: 'Your reviews' }
  ];

  const currentTab = tabs.find(t => t.id === activeTab);

  return (
    <div className="min-h-screen bg-[#F8F7FC] pb-16 md:pb-8">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-sm animate-in slide-in-from-top duration-300 ${
          toast.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center space-x-2">
            {toast.type === 'success' ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <X className="w-5 h-5 text-red-600" />
            )}
            <span className="text-sm font-semibold">{toast.text}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 lg:py-10">
        
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1E1E2F] tracking-tight">
            My Account
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1.5 font-medium">
            Manage your profile, addresses, and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-4">
              {/* User Card */}
              <div className="bg-white rounded-2xl border border-[#E9E7F5] p-6 shadow-sm">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-[#6C4EFF] to-[#9477FF] rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                      {profile.avatar ? (
                        <img src={profile.avatar} alt={profile.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        profile.name?.charAt(0).toUpperCase() || 'U'
                      )}
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-[#E9E7F5] hover:bg-[#F8F7FC] transition-colors">
                      <Camera className="w-4 h-4 text-[#6C4EFF]" />
                    </button>
                  </div>
                  <h3 className="text-lg font-bold text-[#1E1E2F]">{profile.name || 'User'}</h3>
                  <p className="text-sm text-[#6B7280] mt-1">{profile.email}</p>
                  <div className="flex items-center space-x-1 mt-3 px-3 py-1 bg-green-50 rounded-full">
                    <Shield className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-xs font-bold text-green-700 capitalize">
                      {authUser?.role || 'customer'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="bg-white rounded-2xl border border-[#E9E7F5] p-2 shadow-sm">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-[#6C4EFF] to-[#9477FF] text-white shadow-md'
                          : 'text-[#6B7280] hover:bg-[#F8F7FC]'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#6C4EFF]'}`} />
                      <div className="flex-1">
                        <p className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-[#1E1E2F]'}`}>
                          {tab.label}
                        </p>
                        <p className={`text-[10px] ${isActive ? 'text-white/80' : 'text-[#6B7280]'}`}>
                          {tab.description}
                        </p>
                      </div>
                      {isActive && <ChevronRight className="w-4 h-4 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="lg:hidden">
            {/* User Card - Mobile */}
            <div className="bg-white rounded-2xl border border-[#E9E7F5] p-4 mb-4 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#6C4EFF] to-[#9477FF] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt={profile.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      profile.name?.charAt(0).toUpperCase() || 'U'
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-md border border-[#E9E7F5]">
                    <Camera className="w-3 h-3 text-[#6C4EFF]" />
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-[#1E1E2F] truncate">{profile.name || 'User'}</h3>
                  <p className="text-xs text-[#6B7280] truncate">{profile.email}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Shield className="w-3 h-3 text-green-600" />
                    <span className="text-[10px] font-bold text-green-700 capitalize">
                      {authUser?.role || 'customer'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Tabs */}
            <div className="bg-white rounded-2xl border border-[#E9E7F5] p-2 mb-4 shadow-sm overflow-x-auto no-scrollbar">
              <div className="flex space-x-2 min-w-max">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-[#6C4EFF] to-[#9477FF] text-white shadow-md'
                          : 'bg-[#F8F7FC] text-[#6B7280]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#6C4EFF]'}`} />
                      <span className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-[#1E1E2F]'}`}>
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            {/* Content Header */}
            <div className="bg-white rounded-2xl border border-[#E9E7F5] p-4 sm:p-6 mb-4 shadow-sm">
              <div className="flex items-center space-x-3">
                {currentTab && (
                  <>
                    <div className="p-2.5 bg-[#EEE9FF] rounded-xl">
                      <currentTab.icon className="w-5 h-5 text-[#6C4EFF]" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-[#1E1E2F]">
                        {currentTab.label}
                      </h2>
                      <p className="text-xs sm:text-sm text-[#6B7280]">
                        {currentTab.description}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* ===== PROFILE TAB ===== */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl border border-[#E9E7F5] p-4 sm:p-6 shadow-sm">
                <form onSubmit={handleProfileUpdate} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#1E1E2F] uppercase tracking-wider mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="w-full px-4 py-3 bg-[#F8F7FC] border border-[#E9E7F5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C4EFF]/25 focus:border-[#6C4EFF] transition-all"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#1E1E2F] uppercase tracking-wider mb-2">
                        <Mail className="w-3.5 h-3.5 inline mr-1" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full px-4 py-3 bg-[#F8F7FC] border border-[#E9E7F5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C4EFF]/25 focus:border-[#6C4EFF] transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-[#1E1E2F] uppercase tracking-wider mb-2">
                        <Phone className="w-3.5 h-3.5 inline mr-1" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        placeholder="+91 9876543210"
                        className="w-full px-4 py-3 bg-[#F8F7FC] border border-[#E9E7F5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C4EFF]/25 focus:border-[#6C4EFF] transition-all"
                      />
                    </div>
                  </div>
                  <div className="pt-4 border-t border-[#E9E7F5]">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 bg-gradient-to-r from-[#6C4EFF] to-[#9477FF] text-white rounded-xl font-bold hover:shadow-lg hover:shadow-[#6C4EFF]/30 transition-all disabled:opacity-50 flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ===== ADDRESSES TAB ===== */}
            {activeTab === 'addresses' && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-[#E9E7F5] p-4 sm:p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-base sm:text-lg font-bold text-[#1E1E2F]">
                      Saved Addresses ({addresses.length})
                    </h3>
                    {!showAddressForm && (
                      <button
                        onClick={() => { resetAddressForm(); setShowAddressForm(true); }}
                        className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-[#6C4EFF] to-[#9477FF] text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">Add Address</span>
                        <span className="sm:hidden">Add</span>
                      </button>
                    )}
                  </div>

                  {/* Address Form */}
                  {showAddressForm && (
                    <div className="mb-6 p-4 sm:p-5 bg-[#F8F7FC] rounded-2xl border border-[#E9E7F5]">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-base font-bold text-[#1E1E2F]">
                          {editingAddressId ? 'Edit Address' : 'New Address'}
                        </h4>
                        <button
                          onClick={resetAddressForm}
                          className="p-2 hover:bg-white rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4 text-[#6B7280]" />
                        </button>
                      </div>
                      
                      <form onSubmit={handleAddressSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-[#1E1E2F] uppercase tracking-wider mb-2">Label</label>
                            <select
                              value={addressForm.label}
                              onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                              className="w-full px-4 py-3 bg-white border border-[#E9E7F5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C4EFF]/25"
                            >
                              <option value="Home">🏠 Home</option>
                              <option value="Work">💼 Work</option>
                              <option value="Other">📍 Other</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#1E1E2F] uppercase tracking-wider mb-2">Full Name *</label>
                            <input
                              type="text"
                              value={addressForm.fullName}
                              onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                              required
                              className="w-full px-4 py-3 bg-white border border-[#E9E7F5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C4EFF]/25"
                              placeholder="Recipient name"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#1E1E2F] uppercase tracking-wider mb-2">Phone *</label>
                            <input
                              type="tel"
                              value={addressForm.phone}
                              onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                              required
                              className="w-full px-4 py-3 bg-white border border-[#E9E7F5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C4EFF]/25"
                              placeholder="+91 9876543210"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-[#1E1E2F] uppercase tracking-wider mb-2">Address *</label>
                            <input
                              type="text"
                              value={addressForm.address}
                              onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                              required
                              placeholder="Street, house no., landmark"
                              className="w-full px-4 py-3 bg-white border border-[#E9E7F5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C4EFF]/25"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#1E1E2F] uppercase tracking-wider mb-2">City *</label>
                            <input
                              type="text"
                              value={addressForm.city}
                              onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                              required
                              className="w-full px-4 py-3 bg-white border border-[#E9E7F5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C4EFF]/25"
                              placeholder="City"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#1E1E2F] uppercase tracking-wider mb-2">State *</label>
                            <input
                              type="text"
                              value={addressForm.state}
                              onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                              required
                              className="w-full px-4 py-3 bg-white border border-[#E9E7F5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C4EFF]/25"
                              placeholder="State"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#1E1E2F] uppercase tracking-wider mb-2">ZIP Code *</label>
                            <input
                              type="text"
                              value={addressForm.zipCode}
                              onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                              required
                              className="w-full px-4 py-3 bg-white border border-[#E9E7F5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C4EFF]/25"
                              placeholder="123456"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#1E1E2F] uppercase tracking-wider mb-2">Country</label>
                            <input
                              type="text"
                              value={addressForm.country}
                              onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                              className="w-full px-4 py-3 bg-white border border-[#E9E7F5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C4EFF]/25"
                              placeholder="India"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="flex items-center space-x-3 cursor-pointer p-3 bg-white rounded-xl border border-[#E9E7F5] hover:border-[#6C4EFF] transition-colors">
                              <input
                                type="checkbox"
                                checked={addressForm.isDefault}
                                onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                                className="w-4 h-4 text-[#6C4EFF] rounded focus:ring-[#6C4EFF]"
                              />
                              <span className="text-sm font-semibold text-[#1E1E2F]">Set as default address</span>
                            </label>
                          </div>
                        </div>
                        <div className="flex space-x-3 pt-2">
                          <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-gradient-to-r from-[#6C4EFF] to-[#9477FF] text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all disabled:opacity-50"
                          >
                            {loading ? 'Saving...' : (editingAddressId ? 'Update Address' : 'Add Address')}
                          </button>
                          <button
                            type="button"
                            onClick={resetAddressForm}
                            className="px-6 py-3 bg-white border border-[#E9E7F5] text-[#6B7280] rounded-xl font-bold text-sm hover:bg-[#F8F7FC] transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Addresses List */}
                  {addresses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map((addr) => (
                        <div
                          key={addr._id}
                          className={`relative p-4 rounded-2xl border-2 transition-all hover:shadow-md ${
                            addr.isDefault 
                              ? 'border-[#6C4EFF] bg-gradient-to-br from-[#EEE9FF] to-white' 
                              : 'border-[#E9E7F5] bg-white'
                          }`}
                        >
                          {addr.isDefault && (
                            <div className="absolute top-3 right-3 flex items-center space-x-1 px-2.5 py-1 bg-gradient-to-r from-[#6C4EFF] to-[#9477FF] text-white text-[10px] font-bold rounded-full shadow-sm">
                              <Check className="w-3 h-3" />
                              <span>Default</span>
                            </div>
                          )}
                          
                          <div className="flex items-start space-x-2 mb-3">
                            <div className={`p-2 rounded-lg ${addr.isDefault ? 'bg-[#6C4EFF]/10' : 'bg-[#F8F7FC]'}`}>
                              <HomeIcon className={`w-4 h-4 ${addr.isDefault ? 'text-[#6C4EFF]' : 'text-[#6B7280]'}`} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-[#1E1E2F]">{addr.label}</p>
                              <p className="text-xs text-[#6B7280]">{addr.fullName}</p>
                            </div>
                          </div>

                          <div className="space-y-1.5 mb-4">
                            <p className="text-sm text-[#1E1E2F] font-medium">{addr.address}</p>
                            <p className="text-xs text-[#6B7280]">
                              {addr.city}, {addr.state} - {addr.zipCode}
                            </p>
                            <p className="text-xs text-[#6B7280] flex items-center space-x-1">
                              <Phone className="w-3 h-3" />
                              <span>{addr.phone}</span>
                            </p>
                          </div>
                          
                          <div className="flex space-x-2 pt-3 border-t border-[#E9E7F5]">
                            <button
                              onClick={() => handleEditAddress(addr)}
                              className="flex-1 flex items-center justify-center space-x-1.5 py-2 bg-[#F8F7FC] text-[#6C4EFF] rounded-lg text-xs font-bold hover:bg-[#EEE9FF] transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(addr._id)}
                              className="flex-1 flex items-center justify-center space-x-1.5 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : !showAddressForm && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-[#EEE9FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-8 h-8 text-[#6C4EFF]" />
                      </div>
                      <p className="text-base font-bold text-[#1E1E2F] mb-1">No addresses saved</p>
                      <p className="text-sm text-[#6B7280] mb-4">Add your first delivery address</p>
                      <button
                        onClick={() => setShowAddressForm(true)}
                        className="px-6 py-2.5 bg-gradient-to-r from-[#6C4EFF] to-[#9477FF] text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all"
                      >
                        + Add Address
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ===== PASSWORD TAB ===== */}
            {activeTab === 'password' && (
              <div className="bg-white rounded-2xl border border-[#E9E7F5] p-4 sm:p-6 shadow-sm">
                <ChangePassword />
              </div>
            )}

            {/* ===== REVIEWS TAB ===== */}
            {activeTab === 'reviews' && (
              <div className="bg-white rounded-2xl border border-[#E9E7F5] p-6 sm:p-8 text-center shadow-sm">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Star className="w-10 h-10 text-white fill-white" />
                </div>
                <h3 className="text-xl font-bold text-[#1E1E2F] mb-2">Your Reviews</h3>
                <p className="text-sm text-[#6B7280] mb-6 max-w-md mx-auto">
                  View, edit, or delete the reviews you have written for products
                </p>
                <Link 
                  to="/customer/reviews" 
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#6C4EFF] to-[#9477FF] text-white rounded-xl font-bold hover:shadow-lg hover:shadow-[#6C4EFF]/30 transition-all"
                >
                  <Star className="w-4 h-4" />
                  <span>Go to My Reviews</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};