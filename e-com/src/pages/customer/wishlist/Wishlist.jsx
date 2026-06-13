import { Link } from "react-router-dom";
import { useWishlist } from "../../../context/WishlistContext";

const StarIcon = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4 fill-[#cd6615] text-[#cd6615]"
    viewBox="0 0 20 20"
  >
    <path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.18 3.63a1 1 0 0 0 .95.69h3.82c.97 0 1.37 1.24.59 1.81l-3.09 2.24a1 1 0 0 0-.36 1.12l1.18 3.63c.3.92-.76 1.69-1.54 1.12l-3.09-2.24a1 1 0 0 0-1.18 0l-3.09 2.24c-.78.57-1.84-.2-1.54-1.12l1.18-3.63a1 1 0 0 0-.36-1.12L2.51 9.06c-.78-.57-.38-1.81.59-1.81h3.82a1 1 0 0 0 .95-.69l1.18-3.63Z" />
  </svg>
);

const TrashIcon = () => (
  <svg
    aria-hidden="true"
    className="h-4.5 w-4.5 text-red-500 hover:text-red-700"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m14.74 9-.34 9m-4.78 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
    />
  </svg>
);

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();

  return (
    <div className="space-y-8">
      {/* Page Title Section */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div>
          <p className="text-sm font-semibold text-[#cd6615]">My Account</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            My Wishlist
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
            Keep track of items you want to buy. Items in your wishlist are saved to your account.
          </p>
        </div>
      </section>

      {wishlistItems.length === 0 ? (
        /* Empty State */
        <section className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-[#cd6615]">
            <svg
              className="h-8 w-8"
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
          </div>
          <h2 className="mt-5 text-xl font-bold text-gray-900">Your wishlist is empty</h2>
          <p className="mt-2 text-sm text-gray-500">
            Browse our catalogue to add items to your wishlist and save them for later.
          </p>
          <div className="mt-8">
            <Link
              to="/products"
              className="rounded-xl bg-[#cd6615] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 inline-block"
            >
              Explore Products
            </Link>
          </div>
        </section>
      ) : (
        /* Saved Items Grid */
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlistItems.map((product) => (
            <article
              key={product.id}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
            >
              <Link to={`/products/${product.id}`} className="block">
                <div className={`relative h-48 ${product.swatch || "bg-gray-100"}`}>
                  <div className="absolute top-4 left-4">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#cd6615] shadow-sm">
                      {product.badge || "Saved"}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        removeFromWishlist(product.id);
                      }}
                      className="rounded-full bg-white/90 p-2 text-red-500 shadow-sm cursor-pointer hover:scale-110 hover:bg-red-50 transition-all duration-200"
                      aria-label="Remove from wishlist"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {product.vendor}
                  </p>
                  <h3 className="mt-2 text-sm font-bold text-gray-900 min-h-10">{product.name}</h3>
                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                    <span className="flex items-center gap-1 text-xs font-semibold text-gray-900">
                      <StarIcon />
                      {product.rating || "4.8"}
                    </span>
                    <span className="font-bold text-gray-900 text-sm">
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
      )}
    </div>
  );
};

export default Wishlist;
