const stores = [
  {
    name: "AudioTech",
    rating: "4.9",
    sales: "8.2k",
    description: "Premium headphones, speakers, and everyday tech accessories.",
    initials: "AT",
    accent: "bg-orange-50 text-[#cd6615]",
  },
  {
    name: "Urban Loom",
    rating: "4.8",
    sales: "2.4k",
    description: "Modern apparel made with natural fabrics and relaxed fits.",
    initials: "UL",
    accent: "bg-sky-50 text-sky-700",
  },
  {
    name: "Casa Craft",
    rating: "4.9",
    sales: "3.1k",
    description: "Warm home decor, ceramics, lighting, and hosting essentials.",
    initials: "CC",
    accent: "bg-emerald-50 text-emerald-700",
  },
  {
    name: "Glow Theory",
    rating: "4.7",
    sales: "980",
    description: "Clean beauty formulas for simple daily skincare routines.",
    initials: "GT",
    accent: "bg-rose-50 text-rose-700",
  },
  {
    name: "Bean & Barrel",
    rating: "4.8",
    sales: "1.8k",
    description: "Small-batch coffee, pantry staples, and brewing kits.",
    initials: "BB",
    accent: "bg-amber-50 text-amber-700",
  },
  {
    name: "Trail & Table",
    rating: "4.6",
    sales: "760",
    description: "Durable outdoor goods for picnics, camp kitchens, and travel.",
    initials: "TT",
    accent: "bg-lime-50 text-lime-700",
  },
];

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

const StarIcon = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4 fill-[#cd6615] text-[#cd6615]"
    viewBox="0 0 20 20"
  >
    <path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.18 3.63a1 1 0 0 0 .95.69h3.82c.97 0 1.37 1.24.59 1.81l-3.09 2.24a1 1 0 0 0-.36 1.12l1.18 3.63c.3.92-.76 1.69-1.54 1.12l-3.09-2.24a1 1 0 0 0-1.18 0l-3.09 2.24c-.78.57-1.84-.2-1.54-1.12l1.18-3.63a1 1 0 0 0-.36-1.12L2.51 9.06c-.78-.57-.38-1.81.59-1.81h3.82a1 1 0 0 0 .95-.69l1.18-3.63Z" />
  </svg>
);

const StoreList = () => {
  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#cd6615]">Verified vendors</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Shop by store
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
              Browse trusted NexCart vendors, review store ratings, and discover
              independent brands with reliable fulfillment.
            </p>
          </div>
          <div className="relative w-full lg:max-w-sm">
            <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
              <SearchIcon />
            </div>
            <input
              type="search"
              placeholder="Search Stores"
              className="h-12 w-full rounded-lg border border-gray-200 bg-[#fafafa] pl-12 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#cd6615] focus:bg-white focus:ring-4 focus:ring-orange-100"
            />
          </div>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stores.map((store) => (
          <article
            key={store.name}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div
                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-base font-bold ${store.accent}`}
              >
                {store.initials}
              </div>
              <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-[#cd6615]">
                Verified
              </span>
            </div>
            <h2 className="mt-5 text-xl font-bold text-gray-900">{store.name}</h2>
            <p className="mt-2 min-h-12 text-sm leading-6 text-gray-500">
              {store.description}
            </p>
            <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
              <span className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                <StarIcon />
                {store.rating}
              </span>
              <span className="text-sm text-gray-500">{store.sales} sales</span>
            </div>
            <a
              href={`/stores/${store.name.toLowerCase().replaceAll(" ", "-")}`}
              className="mt-5 inline-flex w-full justify-center rounded-lg border border-gray-200 bg-[#fafafa] px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#cd6615] hover:bg-white hover:text-[#cd6615]"
            >
              Visit Store
            </a>
          </article>
        ))}
      </section>
    </div>
  );
};

export default StoreList;
