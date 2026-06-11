import { Link } from "react-router-dom";
import { useWishlist } from "../../../context/WishlistContext";

const stores = [
  {
    name: "Urban Loom",
    slug: "urban-loom",
    category: "Handmade apparel",
    rating: "4.9",
    orders: "2.4k",
    accent: "bg-orange-50 text-[#cd6615]",
    initial: "UL",
  },
  {
    name: "Bean & Barrel",
    slug: "bean-barrel",
    category: "Coffee and pantry",
    rating: "4.8",
    orders: "1.8k",
    accent: "bg-amber-50 text-amber-700",
    initial: "BB",
  },
  {
    name: "Casa Craft",
    slug: "casa-craft",
    category: "Home decor",
    rating: "4.9",
    orders: "3.1k",
    accent: "bg-emerald-50 text-emerald-700",
    initial: "CC",
  },
  {
    name: "Glow Theory",
    slug: "glow-theory",
    category: "Clean beauty",
    rating: "4.7",
    orders: "980",
    accent: "bg-rose-50 text-rose-700",
    initial: "GT",
  },
];

const products = [
  {
    id: "linen-shirt",
    name: "Everyday Linen Shirt",
    vendor: "Urban Loom",
    price: 3999,
    tag: "Best seller",
    swatch: "bg-sky-100",
    rating: "4.8",
    category: "Fashion",
  },
  {
    id: "cold-brew",
    name: "Single-Origin Cold Brew Kit",
    vendor: "Bean & Barrel",
    price: 1999,
    tag: "New",
    swatch: "bg-amber-100",
    rating: "4.8",
    category: "Pantry",
  },
  {
    id: "table-lamp",
    name: "Ceramic Table Lamp",
    vendor: "Casa Craft",
    price: 6999,
    tag: "Trending",
    swatch: "bg-emerald-100",
    rating: "4.9",
    category: "Home Decor",
  },
  {
    id: "rose-serum",
    name: "Hydrating Rose Serum",
    vendor: "Glow Theory",
    price: 2499,
    tag: "Popular",
    swatch: "bg-rose-100",
    rating: "4.7",
    category: "Beauty",
  },
  {
    id: "canvas-tote",
    name: "Canvas Market Tote",
    vendor: "Urban Loom",
    price: 2400,
    tag: "Eco pick",
    swatch: "bg-sky-100",
    rating: "4.5",
    category: "Fashion",
  },
  {
    id: "stoneware-bowl",
    name: "Stoneware Serving Bowl",
    vendor: "Casa Craft",
    price: 4500,
    tag: "Limited",
    swatch: "bg-violet-100",
    rating: "4.6",
    category: "Home Decor",
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

const Home = () => {
  const { toggleWishlist, isInWishlist } = useWishlist();

  return (
    <div className="space-y-8">
      {/* Hero Section */}
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
              <Link
                to="/products"
                className="inline-flex justify-center rounded-xl bg-[#cd6615] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 items-center"
              >
                Explore products
              </Link>
              <Link
                to="/stores"
                className="inline-flex justify-center rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-[#cd6615] hover:text-[#cd6615] items-center"
              >
                Browse stores
              </Link>
            </div>
          </div>

          {/* Quick Categories Display */}
          <div className="rounded-xl border border-gray-200 bg-[#fafafa] p-5">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Fashion", slug: "fashion", color: "bg-sky-100" },
                { label: "Coffee", slug: "pantry", color: "bg-amber-100" },
                { label: "Decor", slug: "home-decor", color: "bg-emerald-100" },
                { label: "Beauty", slug: "beauty", color: "bg-rose-100" }
              ].map((cat) => (
                <Link
                  key={cat.label}
                  to={`/categories/${cat.slug}`}
                  className="block rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:border-[#cd6615] transition"
                >
                  <div className={`mb-8 h-20 rounded-lg ${cat.color}`} />
                  <p className="text-sm font-semibold text-gray-900">{cat.label}</p>
                  <p className="mt-1 text-xs text-gray-500">Verified vendors &rarr;</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Top Rated Stores */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-[#cd6615]">Top rated stores</p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              Independent sellers customers love
            </h2>
          </div>
          <Link
            to="/stores"
            className="w-fit rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-[#cd6615] hover:text-[#cd6615]"
          >
            View all stores
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stores.map((store) => (
            <Link
              key={store.slug}
              to={`/stores/${store.slug}`}
              className="block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
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
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-[#cd6615]">Trending products</p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              Popular picks across NexCart
            </h2>
          </div>
          <Link
            to="/products"
            className="w-fit rounded-lg bg-[#cd6615] px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700"
          >
            Shop trending
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.id}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
            >
              <Link to={`/products/${product.id}`} className="block">
                <div className={`relative h-44 ${product.swatch}`}>
                  <div className="absolute top-4 left-4">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#cd6615] shadow-sm">
                      {product.tag}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(product);
                      }}
                      className="rounded-full bg-white/90 p-2 text-[#cd6615] shadow-sm cursor-pointer hover:scale-110 hover:bg-gray-50 transition-all duration-200"
                      aria-label="Toggle wishlist"
                    >
                      <HeartIcon className="h-4 w-4" filled={isInWishlist(product.id)} />
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{product.name}</h3>
                      <p className="mt-1 text-xs text-gray-500">
                        Sold by {product.vendor}
                      </p>
                    </div>
                    <p className="shrink-0 font-bold text-gray-900 text-sm">
                      ₹{product.price.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </Link>
              <div className="px-5 pb-5">
                <button
                  type="button"
                  onClick={() => console.log("Handled by Cart Team")}
                  className="w-full rounded-lg bg-[#cd6615] py-2.5 text-xs font-semibold text-white transition hover:bg-orange-700 cursor-pointer"
                >
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

export default Home;
