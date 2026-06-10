const SearchIcon = () => (
  <svg
    aria-hidden="true"
    className="h-5 w-5 text-gray-400"
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

const CartIcon = () => (
  <svg
    aria-hidden="true"
    className="h-5 w-5"
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

const BellIcon = () => (
  <svg
    aria-hidden="true"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.86 17.08a2.99 2.99 0 0 1-5.72 0M18 8.75a6 6 0 0 0-12 0v2.74c0 .72-.26 1.41-.74 1.95L4 14.86h16l-1.26-1.42A2.94 2.94 0 0 1 18 11.49V8.75Z"
    />
  </svg>
);

const CustomerLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <a href="/" className="flex items-center gap-3" aria-label="NexCart home">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#cd6615] text-lg font-bold text-white shadow-sm">
                N
              </span>
              <span className="text-2xl font-bold tracking-tight text-gray-900">
                Nex<span className="text-[#cd6615]">Cart</span>
              </span>
            </a>

            <div className="flex items-center gap-2 lg:hidden">
              <button className="relative inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white p-3 text-gray-700 shadow-sm transition hover:border-[#cd6615] hover:text-[#cd6615]">
                <BellIcon />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#cd6615]" />
              </button>
              <button className="relative inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white p-3 text-gray-700 shadow-sm transition hover:border-[#cd6615] hover:text-[#cd6615]">
                <CartIcon />
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#cd6615] px-1.5 text-xs font-semibold text-white">
                  2
                </span>
              </button>
            </div>
          </div>

          <div className="relative flex-1 lg:mx-8">
            <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
              <SearchIcon />
            </div>
            <input
              type="search"
              placeholder="Search products, stores, and independent brands"
              className="h-12 w-full rounded-xl border border-gray-200 bg-[#fafafa] pl-12 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#cd6615] focus:bg-white focus:ring-4 focus:ring-orange-100"
            />
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <button className="relative inline-flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:border-[#cd6615] hover:text-[#cd6615]">
              <BellIcon />
              <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#cd6615]" />
            </button>
            <button className="relative inline-flex items-center gap-2 rounded-xl bg-[#cd6615] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700">
              <CartIcon />
              <span>Cart</span>
              <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                2
              </span>
            </button>
            <button className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white py-2 pl-2 pr-4 shadow-sm transition hover:border-[#cd6615]">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=96&q=80"
                alt="Aarohi Sharma"
                className="h-9 w-9 rounded-full object-cover"
              />
              <span className="text-left">
                <span className="block text-sm font-semibold leading-5 text-gray-900">
                  Aarohi Sharma
                </span>
                <span className="block text-xs leading-4 text-gray-500">
                  Customer
                </span>
              </span>
            </button>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default CustomerLayout;
