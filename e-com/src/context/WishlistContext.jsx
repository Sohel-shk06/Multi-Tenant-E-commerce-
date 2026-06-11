import React, { createContext, useContext, useState } from "react";

const WishlistContext = createContext(null);

const initialWishlist = [
  {
    id: "studio-headphones",
    name: "Studio Wireless Headphones",
    vendor: "AudioTech",
    price: 12999,
    badge: "Best seller",
    swatch: "bg-orange-100",
  },
  {
    id: "linen-shirt",
    name: "Everyday Linen Shirt",
    vendor: "Urban Loom",
    price: 3999,
    badge: "Saved for later",
    swatch: "bg-sky-100",
  },
];

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(initialWishlist);

  const addToWishlist = (product) => {
    setWishlistItems((prev) => {
      if (prev.some((item) => item.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const toggleWishlist = (product) => {
    setWishlistItems((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
