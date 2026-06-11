import { useState } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";

const SearchIcon = ({ className = "h-5 w-5 text-gray-400" }) => (
  <svg
    aria-hidden="true"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m21 21-4.35-4.35m1.35-5.15a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
    />
  </svg>
);

const HeartIcon = ({ className = "h-5 w-5", filled = false }) => (
  <svg
    aria-hidden="true"
    className={className}
    fill={filled ? "#cd6615" : "none"}
    viewBox="0 0 24 24"
    stroke={filled ? "#cd6615" : "currentColor"}
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 8.25c0 6.25-9 11.25-9 11.25S3 14.5 3 8.25A4.75 4.75 0 0 1 11.26 5 4.75 4.75 0 0 1 21 8.25Z"
    />
  </svg>
);

const CartIcon = ({ className = "h-5 w-5" }) => (
  <svg
    aria-hidden="true"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 3h2.1l2.05 11.2a2 2 0 0 0 1.98 1.64h8.94a2 2 0 0 0 1.95-1.56l1.16-5.08H6.02M9 20.25h.01M17.25 20.25h.01"
    />
  </svg>
);

const CustomerLayout = ({ children }) => {
  const { wishlistItems } = useWishlist();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [searchCat, setSearchCat] = useState("All");

  const handleCartClick = () => {
    console.log("Handled by Cart Team");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log(`Searching for "${searchVal}" in category "${searchCat}"`);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-md">
        {/* Main Navbar */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            
            {/* Logo */}
            <div className="flex items-center shrink-0">
              <Link to="/" className="flex items-center gap-3" aria-label="NexCart home">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#cd6615] text-lg font-bold text-white shadow-sm hover:scale-105 transition duration-205">
                  N
                </span>
                <span className="text-xl font-extrabold tracking-tight text-gray-900 hidden sm:block">
                  Nex<span className="text-[#cd6615]">Cart</span>
                </span>
              </Link>
            </div>

            {/* Middle Search Input with integrated category dropdown */}
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-lg mx-2 sm:mx-6">
              <div className="relative flex items-center h-10 w-full rounded-xl border border-gray-200 bg-[#fafafa] focus-within:border-[#cd6615] focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-100 transition duration-150">
                <select
                  value={searchCat}
                  onChange={(e) => setSearchCat(e.target.value)}
                  className="h-full px-3 text-xs font-semibold text-gray-600 bg-transparent border-r border-gray-200 outline-none rounded-l-xl cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  <option value="Audio">Audio</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Home">Home</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Pantry">Pantry</option>
                </select>
                <input
                  type="search"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Search products, vendors, categories..."
                  className="w-full h-full pl-3 pr-10 text-xs text-gray-900 bg-transparent outline-none"
                />
                <button type="submit" className="absolute right-3 text-gray-400 hover:text-[#cd6615] transition" aria-label="Submit search">
                  <SearchIcon className="h-4.5 w-4.5" />
                </button>
              </div>
            </form>

            {/* Right side navigation and profile actions */}
            <div className="flex items-center gap-3">
              <nav className="hidden md:flex items-center gap-4 text-xs font-bold text-gray-600">
                <Link to="/products" className="hover:text-[#cd6615] transition">Explore Products</Link>
                <Link to="/stores" className="hover:text-[#cd6615] transition">Browse Stores</Link>
              </nav>

              <span className="h-4 w-px bg-gray-200 hidden md:block"></span>

              {/* Wishlist Link with dynamic badge */}
              <Link
                to="/wishlist"
                className="relative inline-flex items-center justify-center h-10 w-10 rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm hover:border-[#cd6615] hover:text-[#cd6615] transition duration-200 cursor-pointer"
                aria-label="Wishlist"
              >
                <HeartIcon className="h-5 w-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#cd6615] px-1.5 text-xs font-bold text-white shadow-sm">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Teammate Cart Button */}
              <button
                type="button"
                onClick={handleCartClick}
                className="relative inline-flex items-center justify-center h-10 w-10 rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm hover:border-[#cd6615] hover:text-[#cd6615] transition duration-200 cursor-pointer"
                aria-label="Cart"
              >
                <CartIcon className="h-5 w-5" />
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-800 px-1.5 text-xs font-bold text-white shadow-sm">
                  2
                </span>
              </button>

              {/* Profile Avatar Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-1 shadow-sm hover:border-[#cd6615] transition duration-150 cursor-pointer bg-transparent"
                >
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=96&q=80"
                    alt="Aarohi Sharma"
                    className="h-8 w-8 rounded-lg object-cover"
                  />
                </button>

                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
                    <div className="absolute right-0 mt-2 z-20 w-48 rounded-xl border border-gray-200 bg-white p-2 shadow-lg text-xs">
                      <div className="px-3 py-2 border-b border-gray-100 mb-1">
                        <span className="block font-bold text-gray-900">Aarohi Sharma</span>
                        <span className="block text-gray-500 text-[10px]">aarohi@nexcart.in</span>
                      </div>
                      <Link to="/wishlist" className="block rounded-lg px-3 py-2 hover:bg-gray-50 hover:text-[#cd6615] font-semibold transition" onClick={() => setIsProfileOpen(false)}>My Wishlist</Link>
                      <Link to="/products" className="block rounded-lg px-3 py-2 hover:bg-gray-50 hover:text-[#cd6615] font-semibold transition" onClick={() => setIsProfileOpen(false)}>All Products</Link>
                      <Link to="/stores" className="block rounded-lg px-3 py-2 hover:bg-gray-50 hover:text-[#cd6615] font-semibold transition" onClick={() => setIsProfileOpen(false)}>All Stores</Link>
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          console.log("Signing out...");
                        }}
                        className="w-full text-left rounded-lg px-3 py-2 text-red-600 hover:bg-red-50 font-semibold transition bg-transparent"
                      >
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Sub-navigation Row with Category Links */}
        <div className="border-t border-gray-200 bg-white text-xs font-semibold text-gray-600">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-6 overflow-x-auto whitespace-nowrap scrollbar-none">
            <Link to="/products" className="hover:text-[#cd6615] transition font-bold text-gray-900">All Categories</Link>
            <Link to="/categories/electronics" className="hover:text-[#cd6615] transition">Electronics</Link>
            <Link to="/categories/fashion" className="hover:text-[#cd6615] transition">Fashion</Link>
            <Link to="/categories/home-decor" className="hover:text-[#cd6615] transition">Home Decor</Link>
            <Link to="/categories/beauty" className="hover:text-[#cd6615] transition">Beauty</Link>
            <Link to="/categories/pantry" className="hover:text-[#cd6615] transition">Pantry</Link>
            <Link to="/categories/fitness" className="hover:text-[#cd6615] transition">Fitness</Link>
            <span className="h-3 w-px bg-gray-200"></span>
            <Link to="/stores" className="hover:text-[#cd6615] transition">Browse Verified Stores</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default CustomerLayout;
