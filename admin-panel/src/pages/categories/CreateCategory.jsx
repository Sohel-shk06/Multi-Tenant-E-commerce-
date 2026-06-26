import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createCategory, updateCategory, fetchCategory } from '../../app/store/categorySlice';
import { PageLoader } from '../../components/loaders/PageLoader';
import { ArrowLeft, Save, Edit, Plus, Tag } from 'lucide-react';

export const CreateCategory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const isEditMode = Boolean(categoryId);

  const { categories, currentCategory, isLoading } = useSelector((state) => state.categories);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parent: ''
  });
  const [localError, setLocalError] = useState('');
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch({ type: 'categories/fetchCategories/pending' });
    import('../../services/category.service').then(({ categoryService }) => {
      categoryService.getCategories({ page: 1, limit: 100 })
        .then(data => dispatch({ type: 'categories/fetchCategories/fulfilled', payload: data }))
        .catch(err => dispatch({ type: 'categories/fetchCategories/rejected', payload: err.message }));
    });
  }, [dispatch]);

  useEffect(() => {
    if (isEditMode) {
      setLoadingCategory(true);
      dispatch(fetchCategory(categoryId)).unwrap()
        .catch(() => setLocalError('Failed to load category data'))
        .finally(() => setLoadingCategory(false));
    }
  }, [categoryId]);

  useEffect(() => {
    if (isEditMode && currentCategory) {
      setFormData({
        name: currentCategory.name || '',
        description: currentCategory.description || '',
        parent: currentCategory.parent?._id || currentCategory.parent || ''
      });
    }
  }, [currentCategory, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) { setLocalError('Category name is required'); return; }

    setIsSubmitting(true);
    const resultAction = isEditMode
      ? await dispatch(updateCategory({ categoryId, categoryData: formData }))
      : await dispatch(createCategory(formData));
    setIsSubmitting(false);

    if (resultAction.type.endsWith('/fulfilled')) {
      navigate('/admin/categories');
    } else {
      setLocalError(resultAction.payload || `Failed to ${isEditMode ? 'update' : 'create'} category`);
    }
  };

  if (isEditMode && loadingCategory) return <PageLoader />;

  const inputClass = "w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white text-gray-900 placeholder:text-gray-400";
  const labelClass = "block text-[12px] font-medium text-gray-600 mb-1.5";

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/admin/categories')}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
        <div>
          <h1 className="text-[18px] font-semibold text-gray-900">
            {isEditMode ? 'Edit Category' : 'Create New Category'}
          </h1>
          <p className="text-[12px] text-gray-400 mt-0.5">
            {isEditMode ? 'Update category details' : 'Add a new product category'}
          </p>
        </div>
      </div>

      {localError && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-[13px] border border-red-100">
          {localError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Category Info */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#EEF2FF' }}>
              <Tag className="w-4 h-4" style={{ color: '#4338CA' }} />
            </div>
            <p className="text-[13px] font-semibold text-gray-900">Category Details</p>
          </div>
          <div className="p-5 space-y-4">

            <div>
              <label className={labelClass}>Category Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Electronics, Fashion, Books"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Brief description of the category..."
                className={inputClass}
                style={{ resize: 'none' }}
              />
            </div>

            <div>
              <label className={labelClass}>Parent Category (Optional)</label>
              <select
                name="parent"
                value={formData.parent}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">No Parent (Top Level)</option>
                {categories
                  .filter(cat => cat._id !== categoryId)
                  .map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
              </select>
            </div>

          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 text-[13px] font-semibold text-white rounded-lg transition-colors disabled:opacity-50"
            style={{ backgroundColor: '#4338CA' }}
            onMouseEnter={e => !(isSubmitting || isLoading) && (e.currentTarget.style.backgroundColor = '#312E81')}
            onMouseLeave={e => !(isSubmitting || isLoading) && (e.currentTarget.style.backgroundColor = '#4338CA')}
          >
            <Save className="w-3.5 h-3.5" />
            {isSubmitting || isLoading
              ? (isEditMode ? 'Updating...' : 'Creating...')
              : (isEditMode ? 'Update Category' : 'Create Category')
            }
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/categories')}
            className="flex-1 py-2.5 text-[13px] font-medium text-gray-700 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
};