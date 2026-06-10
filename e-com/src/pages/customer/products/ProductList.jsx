const categories = ["All", "Audio", "Fashion", "Home", "Beauty", "Pantry"];
const vendors = ["AudioTech", "Urban Loom", "Casa Craft", "Glow Theory", "Bean & Barrel"];

const products = [
  {
    name: "Studio Wireless Headphones",
    vendor: "AudioTech",
    category: "Audio",
    price: "$129.00",
    rating: "4.9",
    badge: "Best seller",
    swatch: "bg-orange-100",
  },
  {
    name: "Everyday Linen Shirt",
    vendor: "Urban Loom",
    category: "Fashion",
    price: "$48.00",
    rating: "4.8",
    badge: "Organic cotton",
    swatch: "bg-sky-100",
  },
  {
    name: "Ceramic Table Lamp",
    vendor: "Casa Craft",
    category: "Home",
    price: "$86.00",
    rating: "4.9",
    badge: "Handmade",
    swatch: "bg-emerald-100",
  },
  {
    name: "Hydrating Rose Serum",
    vendor: "Glow Theory",
    category: "Beauty",
    price: "$29.00",
    rating: "4.7",
    badge: "Clean beauty",
    swatch: "bg-rose-100",
  },
  {
    name: "Single-Origin Cold Brew Kit",
    vendor: "Bean & Barrel",
    category: "Pantry",
    price: "$32.00",
    rating: "4.8",
    badge: "New arrival",
    swatch: "bg-amber-100",
  },
  {
    name: "Portable Bluetooth Speaker",
    vendor: "AudioTech",
    category: "Audio",
    price: "$74.00",
    rating: "4.6",
    badge: "Travel pick",
    swatch: "bg-violet-100",
  },
];

const StarIcon = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4 fill-[#cd6615] text-[#cd6615]"
    viewBox="0 0 20 20"
  >
    <path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.18 3.63a1 1 0 0 0 .95.69h3.82c.97 0 1.37 1.24.59 1.81l-3.09 2.24a1 1 0 0 0-.36 1.12l1.18 3.63c.3.92-.76 1.69-1.54 1.12l-3.09-2.24a1 1 0 0 0-1.18 0l-3.09 2.24c-.78.57-1.84-.2-1.54-1.12l1.18-3.63a1 1 0 0 0-.36-1.12L2.51 9.06c-.78-.57-.38-1.81.59-1.81h3.82a1 1 0 0 0 .95-.69l1.18-3.63Z" />
  </svg>
);

const ProductList = () => {
  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-semibold text-[#cd6615]">Browsing & Discovery</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Explore products across NexCart
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
              Compare products from verified vendors, filter by category, and find the
              right item without leaving the marketplace.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-[#fafafa] px-4 py-3 text-sm font-semibold text-gray-700">
            248 products from verified stores
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Filters</h2>
            <button className="text-sm font-semibold text-[#cd6615]">Reset</button>
          </div>

          <div className="mt-6 space-y-6">
            <div>
              <label className="text-sm font-semibold text-gray-900">Category</label>
              <div className="mt-3 flex flex-wrap gap-2 lg:flex-col">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`rounded-lg border px-4 py-2 text-left text-sm font-semibold transition ${
                      category === "All"
                        ? "border-[#cd6615] bg-orange-50 text-[#cd6615]"
                        : "border-gray-200 bg-white text-gray-700 hover:border-[#cd6615] hover:text-[#cd6615]"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-900">Price Range</label>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value="$0"
                  readOnly
                  className="rounded-lg border border-gray-200 bg-[#fafafa] px-3 py-2 text-sm text-gray-700 outline-none"
                />
                <input
                  type="text"
                  value="$150"
                  readOnly
                  className="rounded-lg border border-gray-200 bg-[#fafafa] px-3 py-2 text-sm text-gray-700 outline-none"
                />
              </div>
              <input
                type="range"
                min="0"
                max="150"
                defaultValue="120"
                className="mt-4 w-full accent-[#cd6615]"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-900">Vendor</label>
              <div className="mt-3 space-y-3">
                {vendors.map((vendor) => (
                  <label key={vendor} className="flex items-center gap-3 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 accent-[#cd6615]"
                      defaultChecked={vendor === "AudioTech"}
                    />
                    {vendor}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <section className="space-y-5">
          <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <input
              type="search"
              placeholder="Search products"
              className="h-11 flex-1 rounded-lg border border-gray-200 bg-[#fafafa] px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#cd6615] focus:bg-white focus:ring-4 focus:ring-orange-100"
            />
            <select className="h-11 rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 outline-none focus:border-[#cd6615] focus:ring-4 focus:ring-orange-100">
              <option>Sort by relevance</option>
              <option>Price: low to high</option>
              <option>Top rated</option>
            </select>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <article
                key={`${product.vendor}-${product.name}`}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
              >
                <div className={`h-48 ${product.swatch}`}>
                  <div className="flex h-full items-start justify-end p-4">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#cd6615] shadow-sm">
                      {product.badge}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        {product.category}
                      </p>
                      <h3 className="mt-2 font-bold text-gray-900">{product.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">Sold by {product.vendor}</p>
                    </div>
                    <p className="shrink-0 font-bold text-gray-900">{product.price}</p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                    <span className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                      <StarIcon />
                      {product.rating}
                    </span>
                    <button className="rounded-lg bg-[#cd6615] px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductList;
