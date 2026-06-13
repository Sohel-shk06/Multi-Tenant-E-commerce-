import { useState } from "react";
import { EditProfile } from "./EditProfile";
import { Edit2, Mail, Phone, User, CheckCircle2 } from "lucide-react";

export const MyProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [profile, setProfile] = useState({
    name: "Aarohi Sharma",
    email: "aarohi@nexcart.in",
    phone: "+91 98765 43210",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
  });

  const handleSave = (updatedProfile) => {
    setProfile(updatedProfile);
    setIsEditing(false);
    setSuccessMessage("Profile updated successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">My Profile</h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage your personal information and contact details
        </p>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-2.5 text-sm font-medium animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        {isEditing ? (
          <EditProfile
            profile={profile}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex flex-col items-center pb-6 border-b border-gray-100">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 shadow-sm"
              />
              <h3 className="text-lg font-bold text-gray-900 mt-3">{profile.name}</h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-[#cd6615] mt-1 border border-orange-100">
                Premium Customer
              </span>
            </div>

            {/* Fields */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Full Name
                  </span>
                  <span className="text-sm font-medium text-gray-800">{profile.name}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Email Address
                  </span>
                  <span className="text-sm font-medium text-gray-800">{profile.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Phone Number
                  </span>
                  <span className="text-sm font-medium text-gray-800">{profile.phone}</span>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="pt-4">
              <button
                onClick={() => setIsEditing(true)}
                className="w-full py-2.5 px-4 bg-[#cd6615] hover:bg-[#b2550f] text-white font-medium rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition duration-200 cursor-pointer"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;