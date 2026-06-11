import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createCategory } from '../../app/store/categorySlice';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ArrowLeft } from 'lucide-react';

export const CreateCategory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories } = useSelector((state) => state.categories);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parent: ''
  });
  const [localError, setLocalError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setLocalError('Category name is required');
      return;
    }

    const resultAction = await dispatch(createCategory(formData));
    if (resultAction.type === 'categories/createCategory/fulfilled') {
      navigate('/admin/categories');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/admin/categories')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Categories</span>
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Category</h1>

        {localError && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm">{localError}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Category Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., Electronics, Fashion, Books"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of the category..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category (Optional)</label>
            <select
              name="parent"
              value={formData.parent}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">No Parent (Top Level)</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1">
              Create Category
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/admin/categories')}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};