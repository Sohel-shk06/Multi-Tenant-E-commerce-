import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, deleteCategory } from '../../app/store/categorySlice';
import { PageLoader } from '../../components/loaders/PageLoader';
import { Search, Plus, Trash2, Edit, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CategoryList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories, isLoading, error, currentPage, totalPages } = useSelector((state) => state.categories);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchCategories({ page: currentPage, search: searchTerm }));
  }, [dispatch, currentPage, searchTerm]);

  const handleDelete = (categoryId, categoryName) => {
    if (window.confirm(`Are you sure you want to delete "${categoryName}"?`)) {
      dispatch(deleteCategory(categoryId));
    }
  };

  if (isLoading && categories.length === 0) return <PageLoader />;

  return (
    <div className="p-6 space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-gray-900">Category Management</h1>
          <p className="text-[12px] text-gray-400 mt-0.5">Organize products into categories for better navigation.</p>
        </div>
        <button
          onClick={() => navigate('/admin/categories/create')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-white rounded-lg transition-colors"
          style={{ backgroundColor: '#4338CA' }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#312E81'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#4338CA'}
        >
          <Plus className="w-3.5 h-3.5" />
          Add Category
        </button>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-[13px] border border-red-100">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Slug</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Parent</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Created</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: '#EEF2FF' }}
                        >
                          <Tag className="w-4 h-4" style={{ color: '#4338CA' }} />
                        </div>
                        <span className="text-[13px] font-medium text-gray-900">{category.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[12px] font-mono text-gray-500">{category.slug}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      {category.parent ? (
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border"
                          style={{ backgroundColor: '#EEF2FF', color: '#4338CA', borderColor: '#C7D2FE' }}
                        >
                          {category.parent.name}
                        </span>
                      ) : (
                        <span className="text-[13px] text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border"
                        style={
                          category.isActive
                            ? { backgroundColor: '#DCFCE7', color: '#15803D', borderColor: '#86EFAC' }
                            : { backgroundColor: '#F3F4F6', color: '#374151', borderColor: '#D1D5DB' }
                        }
                      >
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-500">
                      {new Date(category.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate(`/admin/categories/edit/${category._id}`)}
                          className="w-7 h-7 inline-flex items-center justify-center rounded-md border border-gray-200 hover:bg-blue-50 transition-colors"
                          style={{ color: '#2563EB' }}
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(category._id, category.name)}
                          className="w-7 h-7 inline-flex items-center justify-center rounded-md border border-gray-200 hover:bg-red-50 transition-colors"
                          style={{ color: '#DC2626' }}
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 border border-dashed border-gray-200"
                      style={{ backgroundColor: '#EEF2FF' }}
                    >
                      <Tag className="w-5 h-5" style={{ color: '#818CF8' }} />
                    </div>
                    <p className="text-[13px] font-medium text-gray-500">No categories found</p>
                    <p className="text-[12px] text-gray-400 mt-1">Try adjusting your search</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between">
            <p className="text-[12px] text-gray-400">Page {currentPage} of {totalPages}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => dispatch(fetchCategories({ page: currentPage - 1, search: searchTerm }))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium border border-gray-200 rounded-md disabled:opacity-40 hover:bg-gray-50 transition-colors text-gray-600"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </button>
              <button
                onClick={() => dispatch(fetchCategories({ page: currentPage + 1, search: searchTerm }))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium border border-gray-200 rounded-md disabled:opacity-40 hover:bg-gray-50 transition-colors text-gray-600"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};