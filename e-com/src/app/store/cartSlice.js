import { createSlice } from '@reduxjs/toolkit';

// Helper to get currently logged-in user's ID
const getCurrentUserId = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    const user = JSON.parse(userStr);
    return user._id || user.id || null;
  } catch {
    return null;
  }
};

// LocalStorage se user-specific cart load karna
const loadCart = () => {
  try {
    const userId = getCurrentUserId();
    const key = userId ? `cart_${userId}` : 'cart';
    const serialized = localStorage.getItem(key);
    return serialized ? JSON.parse(serialized) : [];
  } catch {
    return [];
  }
};

const loadWishlist = () => {
  try {
    const userId = getCurrentUserId();
    const key = userId ? `wishlist_${userId}` : 'wishlist';
    const serialized = localStorage.getItem(key);
    return serialized ? JSON.parse(serialized) : [];
  } catch {
    return [];
  }
};

const saveCart = (items) => {
  try {
    const userId = getCurrentUserId();
    const key = userId ? `cart_${userId}` : 'cart';
    localStorage.setItem(key, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save cart:', err);
  }
};

const saveWishlist = (wishlist) => {
  try {
    const userId = getCurrentUserId();
    const key = userId ? `wishlist_${userId}` : 'wishlist';
    localStorage.setItem(key, JSON.stringify(wishlist));
  } catch (err) {
    console.error('Failed to save wishlist:', err);
  }
};

const initialState = {
  items: loadCart(),
  wishlist: loadWishlist(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const userId = getCurrentUserId();
      
      const itemWithUser = {
        ...product,
        userId: userId || null
      };

      const existingItem = state.items.find(item => item.productId === product.productId);
      
      if (existingItem) {
        existingItem.quantity += product.quantity;
        existingItem.userId = userId || null;
      } else {
        state.items.push(itemWithUser);
      }
      saveCart(state.items);
    },
    
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.productId !== action.payload);
      saveCart(state.items);
    },
    
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.productId === productId);
      if (item) {
        item.quantity = Math.max(1, quantity); // Minimum quantity 1
      }
      saveCart(state.items);
    },
    
    clearCart: (state) => {
      state.items = [];
      const userId = getCurrentUserId();
      const key = userId ? `cart_${userId}` : 'cart';
      localStorage.removeItem(key);
    },

    toggleWishlist: (state, action) => {
      const product = action.payload;
      const userId = getCurrentUserId();
      const exists = state.wishlist.find(item => item.productId === product.productId);
      
      if (exists) {
        state.wishlist = state.wishlist.filter(item => item.productId !== product.productId);
      } else {
        const itemWithUser = {
          ...product,
          userId: userId || null
        };
        state.wishlist.push(itemWithUser);
      }
      saveWishlist(state.wishlist);
    },
    
    clearWishlist: (state) => {
      state.wishlist = [];
      const userId = getCurrentUserId();
      const key = userId ? `wishlist_${userId}` : 'wishlist';
      localStorage.removeItem(key);
    }
  },
  extraReducers: (builder) => {
    builder
      // Load user-specific cart when user logs in successfully
      .addCase('auth/login/fulfilled', (state, action) => {
        const userId = action.payload.user?._id || action.payload.user?.id;
        if (userId) {
          const keyCart = `cart_${userId}`;
          const keyWishlist = `wishlist_${userId}`;
          try {
            const serializedCart = localStorage.getItem(keyCart);
            state.items = serializedCart ? JSON.parse(serializedCart) : [];
          } catch {
            state.items = [];
          }
          try {
            const serializedWishlist = localStorage.getItem(keyWishlist);
            state.wishlist = serializedWishlist ? JSON.parse(serializedWishlist) : [];
          } catch {
            state.wishlist = [];
          }
        }
      })
      // Load user-specific cart when registration completes successfully
      .addCase('auth/register/fulfilled', (state, action) => {
        const userId = action.payload.user?._id || action.payload.user?.id;
        if (userId) {
          const keyCart = `cart_${userId}`;
          const keyWishlist = `wishlist_${userId}`;
          try {
            const serializedCart = localStorage.getItem(keyCart);
            state.items = serializedCart ? JSON.parse(serializedCart) : [];
          } catch {
            state.items = [];
          }
          try {
            const serializedWishlist = localStorage.getItem(keyWishlist);
            state.wishlist = serializedWishlist ? JSON.parse(serializedWishlist) : [];
          } catch {
            state.wishlist = [];
          }
        }
      })
      // Clear cart state when user logs out
      .addCase('auth/logout', (state) => {
        state.items = [];
        state.wishlist = [];
      });
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, toggleWishlist, clearWishlist } = cartSlice.actions;
export default cartSlice.reducer;