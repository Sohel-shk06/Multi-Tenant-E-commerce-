import { useState } from "react";
import { Plus, Home, Briefcase, MapPin, Check, Trash2 } from "lucide-react";

export const AddressBook = () => {
  const [addresses, setAddresses] = useState([
    {
      id: "addr_1",
      label: "Home",
      fullName: "Aarohi Sharma",
      phone: "+91 98765 43210",
      street: "Flat 402, Royal Residency, Sector 62",
      city: "Noida",
      state: "Uttar Pradesh",
      zipCode: "201301",
      country: "India",
      isDefault: true,
    },
    {
      id: "addr_2",
      label: "Work",
      fullName: "Aarohi Sharma",
      phone: "+91 98765 43210",
      street: "NexCart Headquarters, Tower B, 12th Floor",
      city: "Gurugram",
      state: "Haryana",
      zipCode: "122018",
      country: "India",
      isDefault: false,
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: "Home",
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  });

  const handleSetDefault = (id) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  const handleDelete = (id) => {
    const confirm = window.confirm("Are you sure you want to delete this address?");
    if (confirm) {
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!newAddress.fullName || !newAddress.phone || !newAddress.street || !newAddress.city || !newAddress.zipCode) {
      alert("Please fill out all required fields.");
      return;
    }
    const created = {
      id: `addr_${Date.now()}`,
      ...newAddress,
      isDefault: addresses.length === 0, // make default if it is the first address
    };
    setAddresses((prev) => [...prev, created]);
    setIsAdding(false);
    // Reset form
    setNewAddress({
      label: "Home",
      fullName: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Address Book</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your delivery locations and shipping preferences
          </p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#cd6615] hover:bg-[#b2550f] text-white font-medium rounded-xl text-sm shadow-sm transition duration-200 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add New Address
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-gray-50/50 border border-gray-150 rounded-2xl p-6 mb-6">
          <h3 className="text-base font-bold text-gray-900 mb-4">Add a New Address</h3>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Address Type
                </label>
                <select
                  name="label"
                  value={newAddress.label}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-250 rounded-xl text-sm focus:border-[#cd6615] focus:outline-none bg-white"
                >
                  <option value="Home">Home Address</option>
                  <option value="Work">Work Address</option>
                  <option value="Other">Other Address</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={newAddress.fullName}
                  onChange={handleInputChange}
                  placeholder="e.g. Aarohi Sharma"
                  className="w-full px-3 py-2 border border-gray-250 rounded-xl text-sm focus:border-[#cd6615] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={newAddress.phone}
                  onChange={handleInputChange}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-3 py-2 border border-gray-250 rounded-xl text-sm focus:border-[#cd6615] focus:outline-none"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="street"
                  value={newAddress.street}
                  onChange={handleInputChange}
                  placeholder="e.g. Flat, House no., Building, Company, Apartment"
                  className="w-full px-3 py-2 border border-gray-250 rounded-xl text-sm focus:border-[#cd6615] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={newAddress.city}
                  onChange={handleInputChange}
                  placeholder="e.g. Noida"
                  className="w-full px-3 py-2 border border-gray-250 rounded-xl text-sm focus:border-[#cd6615] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  State / Province *
                </label>
                <input
                  type="text"
                  name="state"
                  value={newAddress.state}
                  onChange={handleInputChange}
                  placeholder="e.g. Uttar Pradesh"
                  className="w-full px-3 py-2 border border-gray-250 rounded-xl text-sm focus:border-[#cd6615] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  ZIP / Postal Code *
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={newAddress.zipCode}
                  onChange={handleInputChange}
                  placeholder="e.g. 201301"
                  className="w-full px-3 py-2 border border-gray-250 rounded-xl text-sm focus:border-[#cd6615] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={newAddress.country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-250 rounded-xl text-sm focus:border-[#cd6615] focus:outline-none bg-gray-100"
                  disabled
                />
              </div>
            </div>

            <div className="flex gap-3 pt-3 border-t border-gray-200">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#cd6615] hover:bg-[#b2550f] text-white font-medium rounded-xl text-sm transition cursor-pointer"
              >
                Add Address
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl text-sm transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Addresses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`relative p-5 rounded-2xl border-2 transition duration-200 flex flex-col justify-between ${
              addr.isDefault
                ? "border-[#cd6615] bg-[#cd6615]/5 shadow-sm"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500">
                  {addr.label === "Home" ? (
                    <Home className="w-4 h-4 text-gray-400" />
                  ) : addr.label === "Work" ? (
                    <Briefcase className="w-4 h-4 text-gray-400" />
                  ) : (
                    <MapPin className="w-4 h-4 text-gray-400" />
                  )}
                  {addr.label}
                </span>

                {addr.isDefault && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-[#cd6615] text-white">
                    <Check className="w-3 h-3" />
                    Default
                  </span>
                )}
              </div>

              <h4 className="font-bold text-gray-900 text-sm">{addr.fullName}</h4>
              <p className="text-sm text-gray-600 mt-1">{addr.street}</p>
              <p className="text-sm text-gray-600">
                {addr.city}, {addr.state} - {addr.zipCode}
              </p>
              <p className="text-sm text-gray-500 mt-2 font-medium">📞 {addr.phone}</p>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
              {/* Custom Radio Button */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="radio"
                  name="default_address"
                  checked={addr.isDefault}
                  onChange={() => handleSetDefault(addr.id)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                    addr.isDefault ? "border-[#cd6615]" : "border-gray-350"
                  }`}
                >
                  {addr.isDefault && <div className="w-2 h-2 rounded-full bg-[#cd6615]"></div>}
                </div>
                <span className="text-xs font-semibold text-gray-650 hover:text-gray-900">
                  Set as Default
                </span>
              </label>

              {!addr.isDefault && (
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer"
                  title="Delete Address"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressBook;
