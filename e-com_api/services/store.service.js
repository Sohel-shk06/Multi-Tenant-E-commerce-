import { Store } from '../models/Store.js';
import { ApiError } from '../utils/ApiError.js';

export const getAllStores = async (query, userId, userRole) => {
  const { page = 1, limit = 10, search, status } = query;
  const skip = (page - 1) * limit;
  const filter = {};

  // Role-based filtering
  if (userRole === 'vendor') {
    filter.vendor = userId;
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { slug: { $regex: search, $options: 'i' } }
    ];
  }

  if (status) {
    filter.status = status;
  }

  const stores = await Store.find(filter)
    .populate('vendor', 'name email')
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const totalStores = await Store.countDocuments(filter);

  return {
    stores,
    totalPages: Math.ceil(totalStores / limit),
    currentPage: Number(page),
    totalStores
  };
};

export const getStoreById = async (storeId, userId, userRole) => {
  const store = await Store.findById(storeId).populate('vendor', 'name email');
  if (!store) throw new ApiError(404, 'Store not found');

  if (userRole === 'vendor' && store.vendor._id.toString() !== userId) {
    throw new ApiError(403, 'You are not authorized to view this store');
  }
  return store;
};

export const createStore = async (storeData, vendorId) => {
  const existingStore = await Store.findOne({ slug: storeData.slug });
  if (existingStore) {
    throw new ApiError(409, 'Store with this slug already exists');
  }

  const store = await Store.create({
    ...storeData,
    vendor: vendorId
  });
  return store;
};

export const updateStore = async (storeId, updateData, userId, userRole) => {
  const store = await Store.findById(storeId);
  if (!store) throw new ApiError(404, 'Store not found');

  if (userRole === 'vendor' && store.vendor.toString() !== userId) {
    throw new ApiError(403, 'You are not authorized to update this store');
  }

  Object.assign(store, updateData);
  await store.save();
  return store;
};

export const deleteStore = async (storeId, userId, userRole) => {
  const store = await Store.findById(storeId);
  if (!store) throw new ApiError(404, 'Store not found');

  if (userRole === 'vendor' && store.vendor.toString() !== userId) {
    throw new ApiError(403, 'You are not authorized to delete this store');
  }

  await Store.findByIdAndDelete(storeId);
  return true;
};