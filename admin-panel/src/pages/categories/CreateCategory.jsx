import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createCategory, updateCategory, fetchCategory } from '../../app/store/categorySlice';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { PageLoader } from '../../components/loaders/PageLoader';
import { ArrowLeft, Save, Edit, Plus } from 'lucide-react';

export const CreateCategory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categoryId } = useParams();  // ✅ URL se categoryId milega agar edit mode hai
  const isEditMode = Boolean(categoryId);  // ✅ Edit mode detect karein
  
  const { categories, currentCategory, isLoading } = useSelector((state) => state.categories);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parent: ''
  });
  const [localError, setLocalError] = useState('');
  const [loadingCategory, setLoadingCategory] = useState(false);

  // ✅ Categories load karein (parent dropdown ke liye)
  useEffect(() => {
    dispatch({ type: 'categories/fetchCategories/pending' });
    import('../../services/category.service').then(({ categoryService }) => {
      categoryService.getCategories({ page: 1, limit: 100 })
        .then(data => {
          dispatch({ type: 'categories/fetchCategories/fulfilled', payload: data });
        })
        .catch(err => {
          dispatch({ type: 'categories/fetchCategories/rejected', payload: err.message });
        });
    });
  }, [dispatch]);

  // ✅ Edit mode mein category data load karein
  useEffect(() => {
    if (isEditMode) {
      loadCategoryData();
    }
  }, [categoryId]);

  // ✅ Category data form mein populate karein
  useEffect(() => {
    if (isEditMode && currentCategory) {
      setFormData({
        name: currentCategory.name || '',
        description: currentCategory.description || '',
        parent: currentCategory.parent?._id || currentCategory.parent || ''
      });
    }
  }, [currentCategory, isEditMode]);

  const loadCategoryData = async () => {
    setLoadingCategory(true);
    try {
      await dispatch(fetchCategory(categoryId)).unwrap();
    } catch (err) {
      setLocalError('Failed to load category data');
      console.error(err);
    } finally {
      setLoadingCategory(false);
    }
  };

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

    let resultAction;
    
    if (isEditMode) {
      // ✅ Edit mode - updateCategory call karein
      resultAction = await dispatch(updateCategory({ 
        categoryId, 
        categoryData: formData 
      }));
    } else {
      // ✅ Create mode - createCategory call karein
      resultAction = await dispatch(createCategory(formData));
    }
    
    if (resultAction.type.endsWith('/fulfilled')) {
      alert(`✅ Category ${isEditMode ? 'updated' : 'created'} successfully!`);
      navigate('/admin/categories');
    } else {
      setLocalError(resultAction.payload || `Failed to ${isEditMode ? 'update' : 'create'} category`);
    }
  };

  // ✅ Loading state
  if (isEditMode && loadingCategory) {
    return <PageLoader />;
  }

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
        {/* ✅ Dynamic Title */}
        <div className="flex items-center space-x-3 mb-6">
          {isEditMode ? (
            <Edit className="w-6 h-6 text-blue-600" />
          ) : (
            <Plus className="w-6 h-6 text-blue-600" />
          )}
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Edit Category' : 'Create New Category'}
          </h1>
        </div>

        {localError && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
            {localError}
          </div>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">No Parent (Top Level)</option>
              {categories
                .filter(cat => cat._id !== categoryId)  // ✅ Edit mode mein khud ko parent nahi bana sakte
                .map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1" disabled={isLoading}>
              <div className="flex items-center justify-center space-x-2">
                <Save className="w-4 h-4" />
                <span>
                  {isLoading 
                    ? (isEditMode ? 'Updating...' : 'Creating...') 
                    : (isEditMode ? 'Update Category' : 'Create Category')
                  }
                </span>
              </div>
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