import { Link } from "react-router-dom";

const categories = [
  {
    slug: "electronics",
    name: "Electronics",
    description: "High-performance wireless audio, smart speakers, creator microphones, and tech accessories.",
    itemCount: 12,
    swatch: "bg-orange-100",
    textCol: "text-[#cd6615]",
    borderCol: "hover:border-orange-300",
  },
  {
    slug: "fashion",
    name: "Fashion & Apparel",
    description: "Relaxed shirts, breathable linen wear, canvas market bags, and organic everyday cotton garments.",
    itemCount: 8,
    swatch: "bg-sky-100",
    textCol: "text-sky-700",
    borderCol: "hover:border-sky-300",
  },
  {
    slug: "home-decor",
    name: "Home & Living",
    description: "Warm table lamps, handmade ceramics, aesthetic serving bowls, and hosting essentials.",
    itemCount: 15,
    swatch: "bg-emerald-100",
    textCol: "text-emerald-700",
    borderCol: "hover:border-emerald-300",
  },
  {
    slug: "beauty",
    name: "Beauty & Skincare",
    description: "Clean organic serums, hydrating mist sprays, daily routines, and dermatologically tested care.",
    itemCount: 6,
    swatch: "bg-rose-100",
    textCol: "text-rose-700",
    borderCol: "hover:border-rose-300",
  },
  {
    slug: "pantry",
    name: "Pantry & Coffee",
    description: "Artisanal cold brew kits, single-origin whole bean coffee bags, and healthy kitchen staples.",
    itemCount: 9,
    swatch: "bg-amber-100",
    textCol: "text-amber-700",
    borderCol: "hover:border-amber-300",
  },
  {
    slug: "fitness",
    name: "Fitness & Wellness",
    description: "Premium yoga mats, smart resistance bands, water flasks, and personal tracking gadgets.",
    itemCount: 5,
    swatch: "bg-violet-100",
    textCol: "text-violet-700",
    borderCol: "hover:border-violet-300",
  },
];

const CategoryList = () => {
  return (
    <div className="space-y-8">
      {/* Banner */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div>
          <p className="text-sm font-semibold text-[#cd6615]">NexCart Catalog</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Browse by Category
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
            Explore curated selections from our verified vendors. Find premium electronics, 
            natural clothing, hand-crafted decor, and organic beauty products in their dedicated corners.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <article
            key={cat.slug}
            className={`overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${cat.borderCol}`}
          >
            <div className={`h-24 w-full rounded-lg ${cat.swatch} mb-5 flex items-center justify-center`}>
              <span className={`text-2xl font-extrabold tracking-wide uppercase ${cat.textCol}`}>
                {cat.name.split(" ")[0]}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{cat.name}</h2>
              <span className="rounded-full bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-600 border border-gray-100">
                {cat.itemCount} Items
              </span>
            </div>
            <p className="mt-3 min-h-12 text-xs leading-5 text-gray-500">
              {cat.description}
            </p>
            <Link
              to={`/categories/${cat.slug}`}
              className="mt-6 flex w-full items-center justify-center rounded-lg border border-gray-200 bg-[#fafafa] py-2.5 text-xs font-bold text-gray-700 transition hover:border-[#cd6615] hover:bg-white hover:text-[#cd6615]"
            >
              Explore Category &rarr;
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
};

export default CategoryList;
