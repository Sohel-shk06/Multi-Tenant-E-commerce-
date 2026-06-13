import { useState } from "react";
import { Link } from "react-router-dom";
import { StarRating } from "../../../components/customer/StarRating";
import { Trash2, Package, ArrowLeft, Star, Edit } from "lucide-react";

export const MyReviews = () => {
  const [reviews, setReviews] = useState([
    {
      id: "rev_1",
      rating: 4,
      title: "Excellent smartwatch, battery lasts a week!",
      comment: "Super lightweight, tracking features are highly accurate. Screen is bright even under outdoor sunlight.",
      date: "2026-06-12",
      product: {
        id: "prod_noise_smartwatch",
        title: "Noise Pulse Go Slim Smartwatch",
        image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=100&q=80",
      },
    },
    {
      id: "rev_2",
      rating: 5,
      title: "Amazing bass and battery backup!",
      comment: "Very durable neckband. Great sound signature for EDM and Bollywood music. Fast charging works like a charm.",
      date: "2026-06-11",
      product: {
        id: "prod_boat_rockerz",
        title: "Boat Rockerz 255 Wireless Earphones",
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=100&q=80",
      },
    },
  ]);

  const handleDelete = (id) => {
    const confirm = window.confirm("Are you sure you want to delete this review?");
    if (confirm) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Product Reviews</h2>
          <p className="text-sm text-gray-500 mt-1">
            Browse and manage all feedback you have shared on purchased items
          </p>
        </div>
        <div className="bg-orange-50 text-[#cd6615] border border-orange-100 rounded-xl px-3 py-1.5 text-xs font-bold flex items-center gap-1.5">
          <Star className="w-4 h-4 fill-[#cd6615]" />
          <span>{reviews.length} Total Reviews</span>
        </div>
      </div>

      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm hover:shadow-md transition duration-200"
            >
              <div className="flex flex-col sm:flex-row gap-4 items-start justify-between">
                <div className="flex-1 space-y-3">
                  {/* Product Header */}
                  <div className="flex gap-3 items-center">
                    <img
                      src={review.product.image}
                      alt={review.product.title}
                      className="w-12 h-12 rounded-lg object-cover border border-gray-100 shrink-0"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 leading-tight">
                        {review.product.title}
                      </h4>
                      <Link
                        to={`/products/${review.product.id}`}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#cd6615] hover:underline mt-1"
                      >
                        <Package className="w-3.5 h-3.5" />
                        View Product Details
                      </Link>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-2">
                    <StarRating rating={review.rating} size="sm" />
                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 uppercase tracking-wider">
                      Verified Buyer
                    </span>
                  </div>

                  {/* Review text */}
                  <div>
                    <h5 className="text-sm font-bold text-gray-800">{review.title}</h5>
                    <p className="text-xs sm:text-sm text-gray-605 mt-1 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                </div>

                {/* Date and Delete actions */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100 gap-4">
                  <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider font-mono">
                    {new Date(review.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => alert("Review editing is handled inside write-review workflow.")}
                      className="text-gray-400 hover:text-[#cd6615] p-2 rounded-lg hover:bg-gray-50 transition cursor-pointer"
                      title="Edit Review"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition cursor-pointer"
                      title="Delete Review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-gray-150 border-dashed rounded-2xl">
          <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-bold text-gray-850">No Reviews Written</h3>
          <p className="text-xs text-gray-400 mt-1 mb-4">You have not submitted any product reviews yet.</p>
          <Link
            to="/orders"
            className="px-4 py-2 bg-[#cd6615] text-white font-medium rounded-xl text-xs hover:bg-[#b2550f] transition inline-block"
          >
            Review Purchases
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyReviews;