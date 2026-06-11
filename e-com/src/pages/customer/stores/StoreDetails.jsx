import { useParams, Link } from "react-router-dom";
import { useWishlist } from "../../../context/WishlistContext";

const storeData = {
  "audiotech": {
    name: "AudioTech",
    initials: "AT",
    accent: "bg-orange-50 text-[#cd6615]",
    description: "Premium audio gear, creator tools, and portable accessories from a verified electronics seller.",
    rating: "4.9",
    sales: "8.2k",
    shipsFrom: "Austin, TX",
    products: [
      {
        id: "studio-headphones",
        name: "Studio Wireless Headphones",
        price: 12999,
        rating: "4.9",
        badge: "Best seller",
        swatch: "bg-orange-100",
      },
      {
        id: "bluetooth-speaker",
        name: "Portable Bluetooth Speaker",
        price: 4999,
        rating: "4.6",
        badge: "Travel pick",
        swatch: "bg-violet-100",
      },
      {
        id: "desk-microphone",
        name: "Desk Microphone Kit",
        price: 9800,
        rating: "4.8",
        badge: "Creator favorite",
        swatch: "bg-sky-100",
      },
      {
        id: "usbc-cable",
        name: "Braided USB-C Cable Set",
        price: 2200,
        rating: "4.7",
        badge: "Everyday essential",
        swatch: "bg-emerald-100",
      },
    ],
  },
  "urban-loom": {
    name: "Urban Loom",
    initials: "UL",
    accent: "bg-sky-50 text-sky-700",
    description: "Consciously crafted clothing, linen wear, and everyday accessories made from organic fibers.",
    rating: "4.8",
    sales: "2.4k",
    shipsFrom: "Jaipur, India",
    products: [
      {
        id: "linen-shirt",
        name: "Everyday Linen Shirt",
        price: 3999,
        rating: "4.8",
        badge: "Organic cotton",
        swatch: "bg-sky-100",
      },
      {
        id: "canvas-tote",
        name: "Canvas Market Tote",
        price: 2400,
        rating: "4.5",
        badge: "Eco pick",
        swatch: "bg-sky-100",
      },
      {
        id: "wool-beanie",
        name: "Merino Wool Beanie",
        price: 1800,
        rating: "4.7",
        badge: "Winter wear",
        swatch: "bg-orange-100",
      },
    ],
  },
  "casa-craft": {
    name: "Casa Craft",
    initials: "CC",
    accent: "bg-emerald-50 text-emerald-700",
    description: "Warm, earthy home decor, hand-thrown ceramics, custom lighting, and hosting essentials.",
    rating: "4.9",
    sales: "3.1k",
    shipsFrom: "Khurja, India",
    products: [
      {
        id: "table-lamp",
        name: "Ceramic Table Lamp",
        price: 6999,
        rating: "4.9",
        badge: "Handmade",
        swatch: "bg-emerald-100",
      },
      {
        id: "stoneware-bowl",
        name: "Stoneware Serving Bowl",
        price: 4500,
        rating: "4.6",
        badge: "Limited edition",
        swatch: "bg-violet-100",
      },
      {
        id: "linen-pillow",
        name: "Linen Throw Pillow Cover",
        price: 2199,
        rating: "4.8",
        badge: "Premium weave",
        swatch: "bg-amber-100",
      },
    ],
  },
  "glow-theory": {
    name: "Glow Theory",
    initials: "GT",
    accent: "bg-rose-50 text-rose-700",
    description: "Clean organic skincare formulas for minimal but highly effective daily routines.",
    rating: "4.7",
    sales: "980",
    shipsFrom: "Seoul, Korea",
    products: [
      {
        id: "rose-serum",
        name: "Hydrating Rose Serum",
        price: 2499,
        rating: "4.7",
        badge: "Clean beauty",
        swatch: "bg-rose-100",
      },
      {
        id: "clay-mask",
        name: "Detoxifying Clay Mask",
        price: 1899,
        rating: "4.5",
        badge: "Natural glow",
        swatch: "bg-emerald-100",
      },
    ],
  },
  "bean-barrel": {
    name: "Bean & Barrel",
    initials: "BB",
    accent: "bg-amber-50 text-amber-700",
    description: "Direct-trade, small-batch roasted specialty coffee, brewing supplies, and pantry treats.",
    rating: "4.8",
    sales: "1.8k",
    shipsFrom: "Chikmagalur, India",
    products: [
      {
        id: "cold-brew",
        name: "Single-Origin Cold Brew Kit",
        price: 1999,
        rating: "4.8",
        badge: "New arrival",
        swatch: "bg-amber-100",
      },
      {
        id: "roasted-beans",
        name: "House Blend Roasted Beans",
        price: 1299,
        rating: "4.9",
        badge: "Rich roast",
        swatch: "bg-orange-100",
      },
    ],
  },
  "trail-table": {
    name: "Trail & Table",
    initials: "TT",
    accent: "bg-lime-50 text-lime-700",
    description: "Rugged but highly aesthetic outdoor lifestyle gear, kitchen equipment, and travel packs.",
    rating: "4.6",
    sales: "760",
    shipsFrom: "Dehradun, India",
    products: [
      {
        id: "yoga-mat",
        name: "Eco-Friendly Yoga Mat",
        price: 3299,
        rating: "4.8",
        badge: "Non-slip",
        swatch: "bg-lime-100",
      },
      {
        id: "water-flask",
        name: "Insulated Water Flask",
        price: 2499,
        rating: "4.7",
        badge: "Hot & Cold",
        swatch: "bg-violet-100",
      },
    ],
  },
};

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

const StoreDetails = () => {
  const { id } = useParams();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Normalize slug name
  const key = id ? id.toLowerCase() : "";
  const storeInfo = storeData[key] || storeData["audiotech"]; // Default fallback

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
              <div className={`flex h-28 w-28 items-center justify-center rounded-full border-4 border-white text-2xl font-bold shadow-sm ${storeInfo.accent}`}>
                {storeInfo.initials}
              </div>
              <div className="pb-1">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  {storeInfo.name}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                  {storeInfo.description}
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
                {storeInfo.rating}
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-[#fafafa] p-4">
              <p className="text-sm text-gray-500">Total Sales</p>
              <p className="mt-2 text-xl font-bold text-gray-900">{storeInfo.sales}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-[#fafafa] p-4">
              <p className="text-sm text-gray-500">Ships From</p>
              <p className="mt-2 text-xl font-bold text-gray-900">{storeInfo.shipsFrom}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-[#cd6615]">{storeInfo.name} Products</p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              Featured from this store
            </h2>
          </div>
          <select className="h-11 rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 outline-none focus:border-[#cd6615] focus:ring-4 focus:ring-orange-100 cursor-pointer">
            <option>Sort by featured</option>
            <option>Top rated</option>
            <option>Newest</option>
          </select>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {storeInfo.products.map((product) => {
            const productWithVendor = { ...product, vendor: storeInfo.name };
            return (
              <article
                key={product.id || product.name}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
              >
                <Link to={`/products/${product.id}`} className="block">
                  <div className={`relative h-44 ${product.swatch}`}>
                    <div className="absolute top-4 left-4">
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#cd6615] shadow-sm">
                        {product.badge}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleWishlist(productWithVendor);
                        }}
                        className="rounded-full bg-white/90 p-2 text-[#cd6615] shadow-sm cursor-pointer hover:scale-110 hover:bg-gray-50 transition-all duration-200"
                        aria-label="Toggle wishlist"
                      >
                        <HeartIcon className="h-4 w-4" filled={isInWishlist(product.id)} />
                      </button>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 text-sm min-h-10">{product.name}</h3>
                    <p className="mt-1 text-xs text-gray-500">Sold by {storeInfo.name}</p>
                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                      <span className="flex items-center gap-1 text-xs font-semibold text-gray-900">
                        <StarIcon />
                        {product.rating}
                      </span>
                      <span className="font-bold text-gray-900 text-sm">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="px-5 pb-5">
                  <button
                    onClick={() => console.log("Handled by Cart Team")}
                    className="w-full rounded-lg bg-[#cd6615] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-orange-700 cursor-pointer"
                  >
                    Add to Cart
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default StoreDetails;
