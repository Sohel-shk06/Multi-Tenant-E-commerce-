// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { useAuth } from '../../hooks/useAuth';
// import { changePassword as changePasswordThunk } from '../../app/store/authSlice'; // ✅ Thunk directly import karein
// import { Button } from '../../components/ui/Button';
// import { Input } from '../../components/ui/Input';
// import { Lock, Eye, EyeOff, Shield, CheckCircle } from 'lucide-react';

// export const ChangePassword = () => {
//   const dispatch = useDispatch(); // ✅ Dispatch lein
//   const { isLoading, error, successMessage, clearError } = useAuth();
//   const navigate = useNavigate();
  
//   const [formData, setFormData] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   });
  
//   const [showPasswords, setShowPasswords] = useState({
//     current: false,
//     new: false,
//     confirm: false
//   });
  
//   const [localError, setLocalError] = useState('');

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setLocalError('');
//   };

//   const togglePasswordVisibility = (field) => {
//     setShowPasswords(prev => ({
//       ...prev,
//       [field]: !prev[field]
//     }));
//   };

//   const validatePassword = (password) => {
//     if (password.length < 8) {
//       return 'Password must be at least 8 characters long';
//     }
//     if (!/[A-Z]/.test(password)) {
//       return 'Password must contain at least one uppercase letter';
//     }
//     if (!/[a-z]/.test(password)) {
//       return 'Password must contain at least one lowercase letter';
//     }
//     if (!/[0-9]/.test(password)) {
//       return 'Password must contain at least one number';
//     }
//     if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
//       return 'Password must contain at least one special character';
//     }
//     return null;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLocalError('');

//     // Validation
//     if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
//       setLocalError('All fields are required');
//       return;
//     }

//     if (formData.newPassword !== formData.confirmPassword) {
//       setLocalError('New passwords do not match');
//       return;
//     }

//     const passwordError = validatePassword(formData.newPassword);
//     if (passwordError) {
//       setLocalError(passwordError);
//       return;
//     }

//     if (formData.currentPassword === formData.newPassword) {
//       setLocalError('New password must be different from current password');
//       return;
//     }

//     // ✅ API Call - Thunk directly dispatch karein
//     // ✅ Backend 'oldPassword' expect karta hai, isliye currentPassword ko rename kiya
//     try {
//       const resultAction = await dispatch(changePasswordThunk({
//         oldPassword: formData.currentPassword,  // ✅ Backend ke liye oldPassword
//         newPassword: formData.newPassword
//       }));

//       // ✅ Ab thunk directly import kiya hai, isliye .fulfilled.match() kaam karega
//       if (changePasswordThunk.fulfilled.match(resultAction)) {
//         setFormData({
//           currentPassword: '',
//           newPassword: '',
//           confirmPassword: ''
//         });
        
//         setTimeout(() => {
//           navigate('/admin/dashboard');
//         }, 2000);
//       }
//     } catch (err) {
//       console.error('Change password error:', err);
//     }
//   };

//   const getPasswordStrength = (password) => {
//     if (!password) return { strength: 0, text: '', color: '' };
    
//     let strength = 0;
//     if (password.length >= 8) strength++;
//     if (/[A-Z]/.test(password)) strength++;
//     if (/[a-z]/.test(password)) strength++;
//     if (/[0-9]/.test(password)) strength++;
//     if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;

//     if (strength <= 2) return { strength, text: 'Weak', color: 'bg-red-500' };
//     if (strength <= 3) return { strength, text: 'Fair', color: 'bg-yellow-500' };
//     if (strength <= 4) return { strength, text: 'Good', color: 'bg-blue-500' };
//     return { strength, text: 'Strong', color: 'bg-green-500' };
//   };

//   const passwordStrength = getPasswordStrength(formData.newPassword);

//   return (
//     <div className="max-w-2xl mx-auto p-6">
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
//         {/* Header */}
//         <div className="flex items-center gap-3 mb-6">
//           <div className="p-2 bg-indigo-50 rounded-lg">
//             <Shield className="w-6 h-6 text-indigo-600" />
//           </div>
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900">Change Password</h2>
//             <p className="text-sm text-gray-500 mt-1">Update your password to keep your account secure</p>
//           </div>
//         </div>

//         {/* Error Message */}
//         {(error || localError) && (
//           <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-100">
//             {localError || error}
//           </div>
//         )}

//         {/* Success Message */}
//         {successMessage && (
//           <div className="mb-4 rounded-md bg-green-50 p-4 text-sm text-green-700 border border-green-100 flex items-center gap-2">
//             <CheckCircle className="w-5 h-5" />
//             {successMessage}
//           </div>
//         )}

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Current Password */}
//           <div className="relative">
//             <Input
//               label="Current Password"
//               type={showPasswords.current ? 'text' : 'password'}
//               name="currentPassword"
//               required
//               value={formData.currentPassword}
//               onChange={handleChange}
//               placeholder="Enter your current password"
//             />
//             <button
//               type="button"
//               onClick={() => togglePasswordVisibility('current')}
//               className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
//             >
//               {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
//             </button>
//           </div>
          
//           <div className="border-t border-gray-200 pt-6">
//             <h3 className="text-sm font-medium text-gray-900 mb-4">New Password</h3>
            
//             <div className="space-y-4">
//               {/* New Password */}
//               <div className="relative">
//                 <Input
//                   label="New Password"
//                   type={showPasswords.new ? 'text' : 'password'}
//                   name="newPassword"
//                   required
//                   value={formData.newPassword}
//                   onChange={handleChange}
//                   placeholder="Enter new password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => togglePasswordVisibility('new')}
//                   className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
//                 >
//                   {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
//                 </button>

//                 {/* Password Strength Indicator */}
//                 {formData.newPassword && (
//                   <div className="mt-2">
//                     <div className="flex gap-1 mb-1">
//                       {[1, 2, 3, 4, 5].map((index) => (
//                         <div
//                           key={index}
//                           className={`h-1 flex-1 rounded-full ${
//                             index <= passwordStrength.strength
//                               ? passwordStrength.color
//                               : 'bg-gray-200'
//                           }`}
//                         />
//                       ))}
//                     </div>
//                     <p className={`text-xs ${
//                       passwordStrength.strength <= 2 ? 'text-red-600' :
//                       passwordStrength.strength <= 3 ? 'text-yellow-600' :
//                       passwordStrength.strength <= 4 ? 'text-blue-600' :
//                       'text-green-600'
//                     }`}>
//                       Password strength: {passwordStrength.text}
//                     </p>
//                   </div>
//                 )}
//               </div>

//               {/* Confirm Password */}
//               <div className="relative">
//                 <Input
//                   label="Confirm New Password"
//                   type={showPasswords.confirm ? 'text' : 'password'}
//                   name="confirmPassword"
//                   required
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   placeholder="Confirm new password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => togglePasswordVisibility('confirm')}
//                   className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
//                 >
//                   {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Password Requirements */}
//           <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
//             <h4 className="text-sm font-medium text-gray-900 mb-2">Password Requirements:</h4>
//             <ul className="space-y-1 text-xs text-gray-600">
//               <li className="flex items-center gap-2">
//                 <div className={`w-1.5 h-1.5 rounded-full ${formData.newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`} />
//                 At least 8 characters long
//               </li>
//               <li className="flex items-center gap-2">
//                 <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`} />
//                 One uppercase letter (A-Z)
//               </li>
//               <li className="flex items-center gap-2">
//                 <div className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`} />
//                 One lowercase letter (a-z)
//               </li>
//               <li className="flex items-center gap-2">
//                 <div className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`} />
//                 One number (0-9)
//               </li>
//               <li className="flex items-center gap-2">
//                 <div className={`w-1.5 h-1.5 rounded-full ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`} />
//                 One special character (!@#$%^&*)
//               </li>
//             </ul>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex justify-end gap-3 pt-4">
//             <button
//               type="button"
//               onClick={() => navigate(-1)}
//               disabled={isLoading}
//               className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
//             >
//               Cancel
//             </button>
//             <Button type="submit" disabled={isLoading}>
//               {isLoading ? 'Updating...' : 'Update Password'}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };





import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../hooks/useAuth';
import { changePassword as changePasswordThunk } from '../../app/store/authSlice';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Eye, EyeOff, Shield, CheckCircle } from 'lucide-react';

export const ChangePassword = () => {
  const dispatch = useDispatch();
  const { isLoading, error, successMessage } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [localError, setLocalError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLocalError('');
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    // 🔍 DEBUG LOG - Ye check karein browser console mein
    console.log('=== FRONTEND DEBUG ===');
    console.log('formData:', formData);
    console.log('currentPassword value:', formData.currentPassword);
    console.log('currentPassword length:', formData.currentPassword?.length);

    // Validation
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setLocalError('All fields are required');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setLocalError('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 8) {
      setLocalError('Password must be at least 8 characters');
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setLocalError('New password must be different from current password');
      return;
    }

    // ✅ IMPORTANT: Yahan hum backend ko 'oldPassword' bhej rahe hain
    // Backend expects: { oldPassword, newPassword }
    const payload = {
      oldPassword: formData.currentPassword,  // ✅ currentPassword ko oldPassword ke naam se bhej rahe hain
      newPassword: formData.newPassword
    };

    console.log('=== SENDING TO BACKEND ===');
    console.log('payload:', payload);
    console.log('oldPassword value:', payload.oldPassword);
    console.log('oldPassword length:', payload.oldPassword?.length);

    try {
      const resultAction = await dispatch(changePasswordThunk(payload));

      if (changePasswordThunk.fulfilled.match(resultAction)) {
        console.log('✅ Password changed successfully!');
        
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 2000);
      } else {
        console.log('❌ Failed:', resultAction.payload);
        setLocalError(resultAction.payload || 'Failed to change password');
      }
    } catch (err) {
      console.error('❌ Change password error:', err);
      setLocalError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Shield className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Change Password</h2>
            <p className="text-sm text-gray-500 mt-1">Update your password to keep your account secure</p>
          </div>
        </div>

        {/* Error Message */}
        {(error || localError) && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-100">
            {localError || error}
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 rounded-md bg-green-50 p-4 text-sm text-green-700 border border-green-100 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            {successMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password */}
          <div className="relative">
            <Input
              label="Current Password"
              type={showPasswords.current ? 'text' : 'password'}
              name="currentPassword"
              required
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Enter your current password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">New Password</h3>
            
            <div className="space-y-4">
              {/* New Password */}
              <div className="relative">
                <Input
                  label="New Password"
                  type={showPasswords.new ? 'text' : 'password'}
                  name="newPassword"
                  required
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password (min 8 characters)"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <Input
                  label="Confirm New Password"
                  type={showPasswords.confirm ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={isLoading}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};