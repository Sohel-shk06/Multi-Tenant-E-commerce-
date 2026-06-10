const vendorProducts = [
  {
    name: "Studio Wireless Headphones",
    price: "$129.00",
    rating: "4.9",
    badge: "Best seller",
    swatch: "bg-orange-100",
  },
  {
    name: "Portable Bluetooth Speaker",
    price: "$74.00",
    rating: "4.6",
    badge: "Travel pick",
    swatch: "bg-violet-100",
  },
  {
    name: "Desk Microphone Kit",
    price: "$98.00",
    rating: "4.8",
    badge: "Creator favorite",
    swatch: "bg-sky-100",
  },
  {
    name: "Braided USB-C Cable Set",
    price: "$22.00",
    rating: "4.7",
    badge: "Everyday essential",
    swatch: "bg-emerald-100",
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

const StoreDetails = () => {
  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="h-56 bg-gradient-to-r from-orange-100 via-amber-100 to-sky-100 sm:h-72">
          <div className="flex h-full items-end justify-end p-6">
            <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#cd6615] shadow-sm">
              Verified NexCart Vendor
            </span>
          </div>
        </div>

        <div className="px-6 pb-6 sm:px-8 sm:pb-8">
          <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-orange-50 text-2xl font-bold text-[#cd6615] shadow-sm">
                AT
              </div>
              <div className="pb-1">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  AudioTech
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                  Premium audio gear, creator tools, and portable accessories from a
                  verified electronics seller.
                </p>
              </div>
            </div>
            <button className="w-fit rounded-lg bg-[#cd6615] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700">
              Follow Store
            </button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-[#fafafa] p-4">
              <p className="text-sm text-gray-500">Store Rating</p>
              <p className="mt-2 flex items-center gap-1 text-xl font-bold text-gray-900">
                <StarIcon />
                4.9
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-[#fafafa] p-4">
              <p className="text-sm text-gray-500">Total Sales</p>
              <p className="mt-2 text-xl font-bold text-gray-900">8.2k</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-[#fafafa] p-4">
              <p className="text-sm text-gray-500">Ships From</p>
              <p className="mt-2 text-xl font-bold text-gray-900">Austin, TX</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-[#cd6615]">AudioTech products</p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              Featured from this store
            </h2>
          </div>
          <select className="h-11 rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 outline-none focus:border-[#cd6615] focus:ring-4 focus:ring-orange-100">
            <option>Sort by featured</option>
            <option>Top rated</option>
            <option>Newest</option>
          </select>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {vendorProducts.map((product) => (
            <article
              key={product.name}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
            >
              <div className={`h-44 ${product.swatch}`}>
                <div className="flex h-full items-start justify-end p-4">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#cd6615] shadow-sm">
                    {product.badge}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-gray-900">{product.name}</h3>
                <p className="mt-1 text-sm text-gray-500">Sold by AudioTech</p>
                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                    <StarIcon />
                    {product.rating}
                  </span>
                  <span className="font-bold text-gray-900">{product.price}</span>
                </div>
                <button className="mt-5 w-full rounded-lg bg-[#cd6615] px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-700">
                  Add to Cart
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default StoreDetails;
