import { useState } from "react";
import { Save, X, Phone, Mail, User, Camera } from "lucide-react";

export const EditProfile = ({ profile, onSave, onCancel }) => {
  const [formData, setFormData] = useState({ ...profile });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Name cannot be empty");
      return;
    }
    if (!formData.email.trim()) {
      setError("Email cannot be empty");
      return;
    }
    if (!formData.phone.trim()) {
      setError("Phone cannot be empty");
      return;
    }
    setError("");
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
          {error}
        </div>
      )}

      <div className="flex flex-col items-center mb-6">
        <div className="relative group">
          <img
            src={formData.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"}
            alt={formData.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-gray-100 shadow-sm"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition duration-200">
            <Camera className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="w-full mt-4">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Avatar Image URL
          </label>
          <input
            type="text"
            name="avatar"
            value={formData.avatar}
            onChange={handleChange}
            placeholder="https://example.com/avatar.jpg"
            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:border-[#cd6615] focus:outline-none focus:ring-1 focus:ring-[#cd6615]"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-[#cd6615] focus:outline-none focus:ring-1 focus:ring-[#cd6615]"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-[#cd6615] focus:outline-none focus:ring-1 focus:ring-[#cd6615]"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-[#cd6615] focus:outline-none focus:ring-1 focus:ring-[#cd6615]"
              required
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <button
          type="submit"
          className="flex-1 py-2.5 px-4 bg-[#cd6615] hover:bg-[#b2550f] text-white font-medium rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-medium rounded-xl text-sm flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditProfile;
