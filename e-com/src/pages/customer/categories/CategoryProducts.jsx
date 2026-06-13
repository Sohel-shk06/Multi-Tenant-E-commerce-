import { useParams, Link } from "react-router-dom";
import { useWishlist } from "../../../context/WishlistContext";

const categoryData = {
  electronics: {
    title: "Electronics & Audio",
    description: "High-fidelity wireless headphones, portable sound gear, and studio equipment from verified vendors.",
    products: [
      {
        id: "studio-headphones",
        name: "Studio Wireless Headphones",
        vendor: "AudioTech",
        price: 12999,
        rating: "4.9",
        badge: "Best seller",
        swatch: "bg-orange-100",
      },
      {
        id: "bluetooth-speaker",
        name: "Portable Bluetooth Speaker",
        vendor: "AudioTech",
        price: 4999,
        rating: "4.6",
        badge: "Travel pick",
        swatch: "bg-violet-100",
      },
      {
        id: "desk-microphone",
        name: "Desk Microphone Kit",
        vendor: "AudioTech",
        price: 9800,
        rating: "4.8",
        badge: "Creator favorite",
        swatch: "bg-sky-100",
      },
      {
        id: "usbc-cable",
        name: "Braided USB-C Cable Set",
        vendor: "AudioTech",
        price: 2200,
        rating: "4.7",
        badge: "Everyday essential",
        swatch: "bg-emerald-100",
      },
    ],
  },
  fashion: {
    title: "Fashion & Apparel",
    description: "Conscious clothing crafted with natural fabrics, organic cotton, and versatile fits for every season.",
    products: [
      {
        id: "linen-shirt",
        name: "Everyday Linen Shirt",
        vendor: "Urban Loom",
        price: 3999,
        rating: "4.8",
        badge: "Organic cotton",
        swatch: "bg-sky-100",
      },
      {
        id: "canvas-tote",
        name: "Canvas Market Tote",
        vendor: "Urban Loom",
        price: 2400,
        rating: "4.5",
        badge: "Eco pick",
        swatch: "bg-sky-100",
      },
      {
        id: "wool-beanie",
        name: "Merino Wool Beanie",
        vendor: "Urban Loom",
        price: 1800,
        rating: "4.7",
        badge: "Winter wear",
        swatch: "bg-orange-100",
      },
    ],
  },
  "home-decor": {
    title: "Home & Decor",
    description: "Elevate your living space with minimal ceramic table lamps, stoneware bowls, and handmade styling pieces.",
    products: [
      {
        id: "table-lamp",
        name: "Ceramic Table Lamp",
        vendor: "Casa Craft",
        price: 6999,
        rating: "4.9",
        badge: "Handmade",
        swatch: "bg-emerald-100",
      },
      {
        id: "stoneware-bowl",
        name: "Stoneware Serving Bowl",
        vendor: "Casa Craft",
        price: 4500,
        rating: "4.6",
        badge: "Limited edition",
        swatch: "bg-violet-100",
      },
      {
        id: "linen-pillow",
        name: "Linen Throw Pillow Cover",
        vendor: "Casa Craft",
        price: 2199,
        rating: "4.8",
        badge: "Premium weave",
        swatch: "bg-amber-100",
      },
    ],
  },
  beauty: {
    title: "Beauty & Wellness",
    description: "Dermatologist-approved skincare serums, glow enhancers, and clean beauty treatments.",
    products: [
      {
        id: "rose-serum",
        name: "Hydrating Rose Serum",
        vendor: "Glow Theory",
        price: 2499,
        rating: "4.7",
        badge: "Clean beauty",
        swatch: "bg-rose-100",
      },
      {
        id: "clay-mask",
        name: "Detoxifying Clay Mask",
        vendor: "Glow Theory",
        price: 1899,
        rating: "4.5",
        badge: "Natural glow",
        swatch: "bg-emerald-100",
      },
    ],
  },
  pantry: {
    title: "Pantry & Brewing",
    description: "Artisanal coffee blends, specialty cold brew kits, and delicious kitchen pantry staples.",
    products: [
      {
        id: "cold-brew",
        name: "Single-Origin Cold Brew Kit",
        vendor: "Bean & Barrel",
        price: 1999,
        rating: "4.8",
        badge: "New arrival",
        swatch: "bg-amber-100",
      },
      {
        id: "roasted-beans",
        name: "House Blend Roasted Beans",
        vendor: "Bean & Barrel",
        price: 1299,
        rating: "4.9",
        badge: "Rich roast",
        swatch: "bg-orange-100",
      },
    ],
  },
  fitness: {
    title: "Fitness & Lifestyle",
    description: "Premium yoga mats, insulated drinking flasks, and high-performance equipment for tracking your goals.",
    products: [
      {
        id: "yoga-mat",
        name: "Eco-Friendly Yoga Mat",
        vendor: "Trail & Table",
        price: 3299,
        rating: "4.8",
        badge: "Non-slip",
        swatch: "bg-lime-100",
      },
      {
        id: "water-flask",
        name: "Insulated Water Flask",
        vendor: "Trail & Table",
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

const CategoryProducts = () => {
  const { categoryName } = useParams();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Normalize parameter
  const key = categoryName ? categoryName.toLowerCase() : "";
  const categoryInfo = categoryData[key] || categoryData["electronics"]; // Fallback to electronics

  return (
    <div className="space-y-8">
      {/* Category header */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
              <Link to="/categories" className="hover:text-[#cd6615] transition">Categories</Link>
              <span>/</span>
              <span className="text-[#cd6615] capitalize">{categoryName || "electronics"}</span>
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {categoryInfo.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
              {categoryInfo.description}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-[#fafafa] px-4 py-3 text-sm font-semibold text-gray-700">
            {categoryInfo.products.length} Products Available
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categoryInfo.products.map((product) => (
          <article
            key={product.id}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
          >
            <Link to={`/products/${product.id}`} className="block">
              <div className={`relative h-48 ${product.swatch}`}>
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
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {product.vendor}
                </p>
                <h3 className="mt-2 text-sm font-bold text-gray-900">{product.name}</h3>
                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="flex items-center gap-1 text-xs font-semibold text-gray-900">
                    <StarIcon />
                    {product.rating}
                  </span>
                  <span className="font-bold text-gray-900">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
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
      </section>
    </div>
  );
};

export default CategoryProducts;
