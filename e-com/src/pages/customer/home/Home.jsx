const stores = [
  {
    name: "Urban Loom",
    category: "Handmade apparel",
    rating: "4.9",
    orders: "2.4k",
    accent: "bg-orange-50 text-[#cd6615]",
    initial: "UL",
  },
  {
    name: "Bean & Barrel",
    category: "Coffee and pantry",
    rating: "4.8",
    orders: "1.8k",
    accent: "bg-amber-50 text-amber-700",
    initial: "BB",
  },
  {
    name: "Casa Craft",
    category: "Home decor",
    rating: "4.9",
    orders: "3.1k",
    accent: "bg-emerald-50 text-emerald-700",
    initial: "CC",
  },
  {
    name: "Glow Theory",
    category: "Clean beauty",
    rating: "4.7",
    orders: "980",
    accent: "bg-rose-50 text-rose-700",
    initial: "GT",
  },
];

const products = [
  {
    name: "Everyday Linen Shirt",
    vendor: "Urban Loom",
    price: "$48.00",
    tag: "Best seller",
    swatch: "bg-orange-100",
  },
  {
    name: "Single-Origin Cold Brew Kit",
    vendor: "Bean & Barrel",
    price: "$32.00",
    tag: "New",
    swatch: "bg-amber-100",
  },
  {
    name: "Ceramic Table Lamp",
    vendor: "Casa Craft",
    price: "$86.00",
    tag: "Trending",
    swatch: "bg-emerald-100",
  },
  {
    name: "Hydrating Rose Serum",
    vendor: "Glow Theory",
    price: "$29.00",
    tag: "Popular",
    swatch: "bg-rose-100",
  },
  {
    name: "Canvas Market Tote",
    vendor: "Urban Loom",
    price: "$24.00",
    tag: "Eco pick",
    swatch: "bg-sky-100",
  },
  {
    name: "Stoneware Serving Bowl",
    vendor: "Casa Craft",
    price: "$54.00",
    tag: "Limited",
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

const Home = () => {
  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.15fr_0.85fr] lg:p-10">
          <div className="flex flex-col justify-center">
            <span className="mb-4 w-fit rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-[#cd6615]">
              Multi-vendor marketplace
            </span>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Shop top independent brands in one trusted cart.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-500 sm:text-lg">
              Discover curated products from verified NexCart vendors, compare
              store ratings, and checkout across multiple shops without losing
              the simple storefront experience.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button className="rounded-xl bg-[#cd6615] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700">
                Explore products
              </button>
              <button className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-[#cd6615] hover:text-[#cd6615]">
                Browse stores
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-[#fafafa] p-5">
            <div className="grid grid-cols-2 gap-4">
              {["Fashion", "Coffee", "Decor", "Beauty"].map((label, index) => (
                <div
                  key={label}
                  className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div
                    className={`mb-8 h-20 rounded-lg ${
                      ["bg-orange-100", "bg-amber-100", "bg-emerald-100", "bg-rose-100"][
                        index
                      ]
                    }`}
                  />
                  <p className="text-sm font-semibold text-gray-900">{label}</p>
                  <p className="mt-1 text-xs text-gray-500">Verified vendors</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-[#cd6615]">Top rated stores</p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              Independent sellers customers love
            </h2>
          </div>
          <button className="w-fit rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-[#cd6615] hover:text-[#cd6615]">
            View all stores
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stores.map((store) => (
            <article
              key={store.name}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
            >
              <div
                className={`mb-5 flex h-14 w-14 items-center justify-center rounded-xl text-sm font-bold ${store.accent}`}
              >
                {store.initial}
              </div>
              <h3 className="text-lg font-bold text-gray-900">{store.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{store.category}</p>
              <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                  <StarIcon />
                  {store.rating}
                </span>
                <span className="text-sm text-gray-500">{store.orders} orders</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-[#cd6615]">Trending products</p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              Popular picks across NexCart
            </h2>
          </div>
          <button className="w-fit rounded-lg bg-[#cd6615] px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700">
            Shop trending
          </button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <article
              key={`${product.vendor}-${product.name}`}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
            >
              <div className={`h-44 ${product.swatch}`}>
                <div className="flex h-full items-end justify-end p-4">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#cd6615] shadow-sm">
                    {product.tag}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900">{product.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Sold by {product.vendor}
                    </p>
                  </div>
                  <p className="shrink-0 font-bold text-gray-900">{product.price}</p>
                </div>
                <button className="mt-5 w-full rounded-xl border border-gray-200 bg-[#fafafa] px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#cd6615] hover:bg-white hover:text-[#cd6615]">
                  Add to cart
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
