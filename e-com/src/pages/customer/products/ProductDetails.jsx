const gallery = ["bg-orange-100", "bg-amber-100", "bg-sky-100", "bg-emerald-100"];

const relatedFeatures = [
  "Active noise cancellation",
  "Up to 36 hours battery life",
  "Memory foam ear cushions",
  "Fast USB-C charging",
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

const HeartIcon = () => (
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
      d="M21 8.25c0 7.25-9 12-9 12s-9-4.75-9-12A5.25 5.25 0 0 1 12 4.5a5.25 5.25 0 0 1 9 3.75Z"
    />
  </svg>
);

const ProductDetails = () => {
  return (
    <div className="space-y-8">
      <section className="grid gap-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <div className="flex min-h-[420px] items-center justify-center rounded-xl bg-orange-100 p-8">
            <div className="flex h-56 w-56 items-center justify-center rounded-full bg-white/80 text-5xl font-bold text-[#cd6615] shadow-sm">
              AT
            </div>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {gallery.map((swatch, index) => (
              <button
                key={swatch}
                className={`h-24 rounded-xl border shadow-sm transition ${
                  index === 0
                    ? "border-[#cd6615] ring-4 ring-orange-100"
                    : "border-gray-200 hover:border-[#cd6615]"
                } ${swatch}`}
                aria-label={`Product image ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <p className="text-sm font-semibold text-[#cd6615]">AudioTech</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Studio Wireless Headphones
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-gray-900">
              <StarIcon />
              4.9
            </span>
            <span className="text-sm text-gray-500">312 reviews</span>
            <span className="text-sm text-gray-500">In stock</span>
          </div>

          <p className="mt-6 text-4xl font-bold text-gray-900">$129.00</p>
          <p className="mt-4 leading-7 text-gray-500">
            Premium wireless headphones tuned for everyday focus, travel, and
            studio-quality listening. Built by AudioTech and fulfilled through
            NexCart's verified vendor network.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {relatedFeatures.map((feature) => (
              <div
                key={feature}
                className="rounded-lg border border-gray-200 bg-[#fafafa] px-4 py-3 text-sm font-semibold text-gray-700"
              >
                {feature}
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button className="rounded-lg bg-[#cd6615] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 sm:flex-1">
              Add to Cart
            </button>
            <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-[#cd6615] hover:text-[#cd6615] sm:flex-1">
              <HeartIcon />
              Wishlist
            </button>
          </div>

          <div className="mt-8 rounded-xl border border-gray-200 bg-[#fafafa] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-500">Vendor Info</p>
                <h2 className="mt-1 text-xl font-bold text-gray-900">AudioTech</h2>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Verified electronics store specializing in sound gear, accessories,
                  and portable tech for modern work.
                </p>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm font-semibold text-gray-900 shadow-sm">
                <StarIcon />
                4.9
              </div>
            </div>
            <a
              href="/stores/audiotech"
              className="mt-5 inline-flex rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-[#cd6615] shadow-sm transition hover:border-[#cd6615]"
            >
              Visit Store
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
