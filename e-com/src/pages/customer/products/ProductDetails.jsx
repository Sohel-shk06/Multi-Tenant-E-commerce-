import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useWishlist } from "../../../context/WishlistContext";

const productsDb = {
  "studio-headphones": {
    id: "studio-headphones",
    name: "Studio Wireless Headphones",
    vendor: "AudioTech",
    vendorSlug: "audiotech",
    category: "Electronics",
    price: 12999,
    rating: "4.9",
    reviewsCount: "312",
    badge: "Best seller",
    swatch: "bg-orange-100",
    description: "Premium wireless headphones tuned for everyday focus, travel, and studio-quality listening. Built by AudioTech and fulfilled through NexCart's verified vendor network.",
    gallery: ["bg-orange-100", "bg-amber-100", "bg-sky-100", "bg-emerald-100"],
    features: [
      "Active noise cancellation",
      "Up to 36 hours battery life",
      "Memory foam ear cushions",
      "Fast USB-C charging",
    ],
    vendorRating: "4.9",
    vendorDescription: "Verified electronics store specializing in sound gear, accessories, and portable tech for modern work.",
  },
  "bluetooth-speaker": {
    id: "bluetooth-speaker",
    name: "Portable Bluetooth Speaker",
    vendor: "AudioTech",
    vendorSlug: "audiotech",
    category: "Electronics",
    price: 4999,
    rating: "4.6",
    reviewsCount: "185",
    badge: "Travel pick",
    swatch: "bg-violet-100",
    description: "Compact, water-resistant speaker with 360-degree room-filling sound. Designed to go wherever the adventure takes you.",
    gallery: ["bg-violet-100", "bg-sky-100", "bg-amber-100", "bg-rose-100"],
    features: [
      "IPX7 waterproof rating",
      "15-hour battery life",
      "Dual passive radiators",
      "Bluetooth 5.0 connection",
    ],
    vendorRating: "4.9",
    vendorDescription: "Verified electronics store specializing in sound gear, accessories, and portable tech for modern work.",
  },
  "desk-microphone": {
    id: "desk-microphone",
    name: "Desk Microphone Kit",
    vendor: "AudioTech",
    vendorSlug: "audiotech",
    category: "Electronics",
    price: 9800,
    rating: "4.8",
    reviewsCount: "96",
    badge: "Creator favorite",
    swatch: "bg-sky-100",
    description: "Studio-quality USB condenser microphone kit. Includes boom arm, shock mount, and pop filter for professional recording and streaming.",
    gallery: ["bg-sky-100", "bg-orange-100", "bg-emerald-100", "bg-violet-100"],
    features: [
      "Cardioid polar pattern",
      "Plug-and-play USB connection",
      "Adjustable scissor arm",
      "High-res 24-bit/192kHz audio",
    ],
    vendorRating: "4.9",
    vendorDescription: "Verified electronics store specializing in sound gear, accessories, and portable tech for modern work.",
  },
  "usbc-cable": {
    id: "usbc-cable",
    name: "Braided USB-C Cable Set",
    vendor: "AudioTech",
    vendorSlug: "audiotech",
    category: "Electronics",
    price: 2200,
    rating: "4.7",
    reviewsCount: "440",
    badge: "Everyday essential",
    swatch: "bg-emerald-100",
    description: "Ultra-durable double-braided nylon cables. High-speed charging and sync compatibility for all USB-C devices.",
    gallery: ["bg-emerald-100", "bg-violet-100", "bg-amber-100", "bg-orange-100"],
    features: [
      "Reinforced cable joints",
      "Supports Power Delivery (PD)",
      "Tangle-free design",
      "Includes 3ft, 6ft, and 10ft cables",
    ],
    vendorRating: "4.9",
    vendorDescription: "Verified electronics store specializing in sound gear, accessories, and portable tech for modern work.",
  },
  "linen-shirt": {
    id: "linen-shirt",
    name: "Everyday Linen Shirt",
    vendor: "Urban Loom",
    vendorSlug: "urban-loom",
    category: "Fashion",
    price: 3999,
    rating: "4.8",
    reviewsCount: "128",
    badge: "Organic cotton",
    swatch: "bg-sky-100",
    description: "Comfortable, relaxed fit shirt constructed from organic European linen. Pre-washed for extra softness and durability.",
    gallery: ["bg-sky-100", "bg-orange-100", "bg-emerald-100", "bg-amber-100"],
    features: [
      "100% organic European linen",
      "Coconut shell buttons",
      "Highly breathable fabric",
      "Relaxed camp collar styling",
    ],
    vendorRating: "4.8",
    vendorDescription: "Consciously crafted clothing, linen wear, and everyday accessories made from organic fibers.",
  },
  "canvas-tote": {
    id: "canvas-tote",
    name: "Canvas Market Tote",
    vendor: "Urban Loom",
    vendorSlug: "urban-loom",
    category: "Fashion",
    price: 2400,
    rating: "4.5",
    reviewsCount: "67",
    badge: "Eco pick",
    swatch: "bg-sky-100",
    description: "Heavy-duty organic canvas tote with reinforced handles. Features internal pockets to keep your items organized during daily market runs.",
    gallery: ["bg-sky-100", "bg-amber-100", "bg-rose-100", "bg-emerald-100"],
    features: [
      "100% organic cotton canvas",
      "Interior zip pocket",
      "Reinforced shoulder straps",
      "Eco-friendly natural dyes",
    ],
    vendorRating: "4.8",
    vendorDescription: "Consciously crafted clothing, linen wear, and everyday accessories made from organic fibers.",
  },
  "wool-beanie": {
    id: "wool-beanie",
    name: "Merino Wool Beanie",
    vendor: "Urban Loom",
    vendorSlug: "urban-loom",
    category: "Fashion",
    price: 1800,
    rating: "4.7",
    reviewsCount: "83",
    badge: "Winter wear",
    swatch: "bg-orange-100",
    description: "Classic knit beanie made from ultra-soft merino wool. Features a double-cuffed design for extra warmth.",
    gallery: ["bg-orange-100", "bg-sky-100", "bg-emerald-100", "bg-violet-100"],
    features: [
      "100% premium merino wool",
      "Naturally temperature regulating",
      "Ribbed knit pattern",
      "One size fits all comfort",
    ],
    vendorRating: "4.8",
    vendorDescription: "Consciously crafted clothing, linen wear, and everyday accessories made from organic fibers.",
  },
  "table-lamp": {
    id: "table-lamp",
    name: "Ceramic Table Lamp",
    vendor: "Casa Craft",
    vendorSlug: "casa-craft",
    category: "Home Decor",
    price: 6999,
    rating: "4.9",
    reviewsCount: "154",
    badge: "Handmade",
    swatch: "bg-emerald-100",
    description: "Earthy, minimal ceramic base with a linen drum shade. Hand-thrown by local artisans to bring warm, texturized lighting to any room.",
    gallery: ["bg-emerald-100", "bg-amber-100", "bg-violet-100", "bg-rose-100"],
    features: [
      "Hand-thrown stoneware base",
      "100% natural linen shade",
      "Solid brass components",
      "Includes warm LED bulb",
    ],
    vendorRating: "4.9",
    vendorDescription: "Warm, earthy home decor, hand-thrown ceramics, custom lighting, and hosting essentials.",
  },
  "stoneware-bowl": {
    id: "stoneware-bowl",
    name: "Stoneware Serving Bowl",
    vendor: "Casa Craft",
    vendorSlug: "casa-craft",
    category: "Home Decor",
    price: 4500,
    rating: "4.6",
    reviewsCount: "72",
    badge: "Limited edition",
    swatch: "bg-violet-100",
    description: "A beautiful center-piece bowl featuring a food-safe reactive glaze. Perfect for family-style serving or displaying fruit.",
    gallery: ["bg-violet-100", "bg-emerald-100", "bg-orange-100", "bg-sky-100"],
    features: [
      "Durable stoneware ceramic",
      "Unique reactive glaze finish",
      "Dishwasher and microwave safe",
      "Food-safe materials",
    ],
    vendorRating: "4.9",
    vendorDescription: "Warm, earthy home decor, hand-thrown ceramics, custom lighting, and hosting essentials.",
  },
  "linen-pillow": {
    id: "linen-pillow",
    name: "Linen Throw Pillow Cover",
    vendor: "Casa Craft",
    vendorSlug: "casa-craft",
    category: "Home Decor",
    price: 2199,
    rating: "4.8",
    reviewsCount: "93",
    badge: "Premium weave",
    swatch: "bg-amber-100",
    description: "Woven from thick Belgian flax linen with a hidden zipper closure. Adds a cozy, organic texture to your sofa or bed.",
    gallery: ["bg-amber-100", "bg-sky-100", "bg-rose-100", "bg-emerald-100"],
    features: [
      "100% Belgian flax linen",
      "Hidden zipper design",
      "Coordinating cotton backing",
      "Insert not included",
    ],
    vendorRating: "4.9",
    vendorDescription: "Warm, earthy home decor, hand-thrown ceramics, custom lighting, and hosting essentials.",
  },
  "rose-serum": {
    id: "rose-serum",
    name: "Hydrating Rose Serum",
    vendor: "Glow Theory",
    vendorSlug: "glow-theory",
    category: "Beauty",
    price: 2499,
    rating: "4.7",
    reviewsCount: "105",
    badge: "Clean beauty",
    swatch: "bg-rose-100",
    description: "A lightweight, moisture-boosting serum formulated with rosewater and hyaluronic acid to instantly plump and soothe dry skin.",
    gallery: ["bg-rose-100", "bg-emerald-100", "bg-sky-100", "bg-amber-100"],
    features: [
      "Pure organic rosewater extract",
      "Multi-weight hyaluronic acid",
      "Cruelty-free & vegan formula",
      "Soothes redness and dry spots",
    ],
    vendorRating: "4.7",
    vendorDescription: "Clean organic skincare formulas for minimal but highly effective daily routines.",
  },
  "clay-mask": {
    id: "clay-mask",
    name: "Detoxifying Clay Mask",
    vendor: "Glow Theory",
    vendorSlug: "glow-theory",
    category: "Beauty",
    price: 1899,
    rating: "4.5",
    reviewsCount: "54",
    badge: "Natural glow",
    swatch: "bg-emerald-100",
    description: "A purifying bentonite clay mask infused with green tea extract. Unclogs pores and sweeps away impurities without stripping moisture.",
    gallery: ["bg-emerald-100", "bg-rose-100", "bg-amber-100", "bg-sky-100"],
    features: [
      "Bentonite and Kaolin clays",
      "Green tea antioxidant extract",
      "Deep pore clearing action",
      "Non-drying, creamy formula",
    ],
    vendorRating: "4.7",
    vendorDescription: "Clean organic skincare formulas for minimal but highly effective daily routines.",
  },
  "cold-brew": {
    id: "cold-brew",
    name: "Single-Origin Cold Brew Kit",
    vendor: "Bean & Barrel",
    vendorSlug: "bean-barrel",
    category: "Pantry",
    price: 1999,
    rating: "4.8",
    reviewsCount: "135",
    badge: "New arrival",
    swatch: "bg-amber-100",
    description: "Simple cold brew kit containing a durable glass pitcher and two bags of coarse-ground, organic single-origin coffee.",
    gallery: ["bg-amber-100", "bg-orange-100", "bg-violet-100", "bg-emerald-100"],
    features: [
      "Coarse ground cold brew beans",
      "Borosilicate glass pitcher",
      "Stainless steel mesh filter",
      "Includes brewing guide card",
    ],
    vendorRating: "4.8",
    vendorDescription: "Direct-trade, small-batch roasted specialty coffee, brewing supplies, and pantry treats.",
  },
  "roasted-beans": {
    id: "roasted-beans",
    name: "House Blend Roasted Beans",
    vendor: "Bean & Barrel",
    vendorSlug: "bean-barrel",
    category: "Pantry",
    price: 1299,
    rating: "4.9",
    reviewsCount: "112",
    badge: "Rich roast",
    swatch: "bg-orange-100",
    description: "Rich, aromatic medium roast blend with chocolate and caramel notes. Sourced sustainably from local Chikmagalur estates.",
    gallery: ["bg-orange-100", "bg-amber-100", "bg-emerald-100", "bg-sky-100"],
    features: [
      "Medium roast profile",
      "Sustainably sourced beans",
      "Rich chocolate & caramel notes",
      "Whole beans for fresh grind",
    ],
    vendorRating: "4.8",
    vendorDescription: "Direct-trade, small-batch roasted specialty coffee, brewing supplies, and pantry treats.",
  },
  "yoga-mat": {
    id: "yoga-mat",
    name: "Eco-Friendly Yoga Mat",
    vendor: "Trail & Table",
    vendorSlug: "trail-table",
    category: "Fitness",
    price: 3299,
    rating: "4.8",
    reviewsCount: "68",
    badge: "Non-slip",
    swatch: "bg-lime-100",
    description: "Biodegradable, non-slip natural tree rubber yoga mat. Provides high-cushion support for all floor exercises and yoga styles.",
    gallery: ["bg-lime-100", "bg-violet-100", "bg-sky-100", "bg-amber-100"],
    features: [
      "Biodegradable tree rubber",
      "Laser-etched alignment guides",
      "6mm high-cushion thickness",
      "Textured non-slip surface",
    ],
    vendorRating: "4.6",
    vendorDescription: "Rugged but highly aesthetic outdoor lifestyle gear, kitchen equipment, and travel packs.",
  },
  "water-flask": {
    id: "water-flask",
    name: "Insulated Water Flask",
    vendor: "Trail & Table",
    vendorSlug: "trail-table",
    category: "Fitness",
    price: 2499,
    rating: "4.7",
    reviewsCount: "148",
    badge: "Hot & Cold",
    swatch: "bg-violet-100",
    description: "Double-walled vacuum insulated stainless steel bottle. Keeps cold drinks chilled up to 24 hours and hot coffee warm for 12.",
    gallery: ["bg-violet-100", "bg-lime-100", "bg-amber-100", "bg-orange-100"],
    features: [
      "Double-wall vacuum insulation",
      "18/8 food-grade stainless steel",
      "Leak-proof flex cap loop",
      "Condensation-free powder coat",
    ],
    vendorRating: "4.6",
    vendorDescription: "Rugged but highly aesthetic outdoor lifestyle gear, kitchen equipment, and travel packs.",
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

const ProductDetails = () => {
  const { id } = useParams();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Normalize product ID
  const key = id ? id.toLowerCase() : "";
  const product = productsDb[key] || productsDb["studio-headphones"]; // Default fallback

  // Active gallery image swatch state
  const [activeSwatch, setActiveSwatch] = useState(product.gallery[0] || product.swatch);

  const saved = isInWishlist(product.id);

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-gray-500">
        <Link to="/" className="hover:text-[#cd6615] transition">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-[#cd6615] transition">Products</Link>
        <span>/</span>
        <span className="text-[#cd6615] capitalize">{product.id.replaceAll("-", " ")}</span>
      </nav>

      <section className="grid gap-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 lg:grid-cols-[1fr_0.9fr]">
        {/* Gallery Display */}
        <div>
          <div className={`flex min-h-[420px] items-center justify-center rounded-xl p-8 transition-colors duration-200 ${activeSwatch}`}>
            <div className="flex h-56 w-56 items-center justify-center rounded-full bg-white/80 text-5xl font-bold text-[#cd6615] shadow-sm">
              {product.vendor.split(" ").map(w => w[0]).join("")}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {product.gallery.map((swatch, index) => (
              <button
                key={swatch}
                onClick={() => setActiveSwatch(swatch)}
                className={`h-24 rounded-xl border shadow-sm transition-all duration-200 cursor-pointer ${
                  swatch === activeSwatch
                    ? "border-[#cd6615] ring-4 ring-orange-100"
                    : "border-gray-200 hover:border-[#cd6615]"
                } ${swatch}`}
                aria-label={`Product image ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Product Details Specs */}
        <div className="flex flex-col">
          <p className="text-sm font-semibold text-[#cd6615] uppercase tracking-wide">
            <Link to={`/stores/${product.vendorSlug}`} className="hover:underline">
              {product.vendor}
            </Link>
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {product.name}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-gray-900">
              <StarIcon />
              {product.rating}
            </span>
            <span className="text-sm text-gray-500">{product.reviewsCount} reviews</span>
            <span className="text-sm text-green-600 font-semibold">• In stock</span>
          </div>

          <p className="mt-6 text-4xl font-bold text-gray-900">
            ₹{product.price.toLocaleString("en-IN")}
          </p>
          <p className="mt-4 leading-7 text-gray-500 text-sm sm:text-base">
            {product.description}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {product.features.map((feature) => (
              <div
                key={feature}
                className="rounded-lg border border-gray-200 bg-[#fafafa] px-4 py-3 text-xs font-semibold text-gray-700"
              >
                {feature}
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => console.log("Handled by Cart Team")}
              className="rounded-lg bg-[#cd6615] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 sm:flex-1 cursor-pointer"
            >
              Add to Cart
            </button>
            <button
              onClick={() => toggleWishlist(product)}
              className={`inline-flex items-center justify-center gap-2 rounded-lg border px-6 py-3 text-sm font-semibold shadow-sm transition duration-200 sm:flex-1 cursor-pointer ${
                saved
                  ? "border-[#cd6615] bg-orange-50 text-[#cd6615]"
                  : "border-gray-200 bg-white text-gray-700 hover:border-[#cd6615] hover:text-[#cd6615]"
              }`}
            >
              <HeartIcon filled={saved} className="h-5 w-5" />
              {saved ? "Saved in Wishlist" : "Save to Wishlist"}
            </button>
          </div>

          {/* Vendor profile badge */}
          <div className="mt-8 rounded-xl border border-gray-200 bg-[#fafafa] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase">Vendor Info</p>
                <h2 className="mt-1 text-lg font-bold text-gray-900">{product.vendor}</h2>
                <p className="mt-2 text-xs leading-5 text-gray-500">
                  {product.vendorDescription}
                </p>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-900 shadow-sm shrink-0">
                <StarIcon />
                {product.vendorRating}
              </div>
            </div>
            <Link
              to={`/stores/${product.vendorSlug}`}
              className="mt-5 inline-flex rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-[#cd6615] shadow-sm transition hover:border-[#cd6615]"
            >
              Visit Store
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
