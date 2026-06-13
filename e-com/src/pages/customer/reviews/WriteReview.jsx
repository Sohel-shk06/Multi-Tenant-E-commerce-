import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Star, Heart, CheckCircle2, ShieldCheck } from "lucide-react";

export const WriteReview = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId") || "prod_noise_smartwatch";
  const orderId = searchParams.get("orderId") || "NC-2026-9041";

  const [formData, setFormData] = useState({
    rating: 0,
    title: "",
    comment: "",
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (formData.rating === 0) {
      setError("Please select a star rating (1 to 5).");
      return;
    }
    if (!formData.title.trim()) {
      setError("Please provide a summary title for your review.");
      return;
    }
    if (!formData.comment.trim()) {
      setError("Please write comments explaining your feedback.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert("✅ Thank you! Your review has been submitted successfully.");
      navigate("/reviews");
    }, 1000);
  };

  const getProductTitle = () => {
    if (productId === "prod_noise_smartwatch") return "Noise Pulse Go Slim Smartwatch";
    if (productId === "prod_boat_rockerz") return "Boat Rockerz 255 Wireless Earphones";
    if (productId === "prod_oneplus_buds") return "OnePlus Nord Buds 2";
    if (productId === "prod_wings_phantom") return "Wings Phantom Gaming Headphones";
    return "Purchased Product";
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* Back Link */}
      <div className="border-b border-gray-150 pb-4 mb-6">
        <Link 
          to="/orders" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Cancel and Back to Orders
        </Link>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Write a Product Review</h2>
          <p className="text-sm text-gray-500 mt-1">
            Share your experience with this product to help other customers make informed choices
          </p>
        </div>

        {/* Product Card */}
        <div className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
          <div className="h-12 w-12 rounded-lg bg-white border border-gray-150 flex items-center justify-center text-[#cd6615] font-bold text-lg">
            N
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-800">{getProductTitle()}</h4>
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block mt-0.5">
              Order Reference: {orderId}
            </span>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Review Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Interactive Star Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Your Rating *
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none transition transform hover:scale-115 bg-transparent border-none p-1 cursor-pointer"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoverRating || formData.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
              {formData.rating > 0 && (
                <span className="text-xs font-bold text-gray-600 ml-2">
                  {formData.rating} / 5 Stars
                </span>
              )}
            </div>
          </div>

          {/* Review Title */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Review Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Outstanding quality, highly recommended!"
              className="w-full px-3.5 py-2.5 border border-gray-250 rounded-xl text-sm focus:border-[#cd6615] focus:outline-none"
              maxLength={100}
              required
            />
          </div>

          {/* Comment description */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Detailed Feedback *
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              placeholder="What did you like or dislike? How is the sound, build quality, or battery life?"
              className="w-full px-3.5 py-2.5 border border-gray-250 rounded-xl text-sm focus:border-[#cd6615] focus:outline-none"
              rows={5}
              maxLength={1000}
              required
            />
            <div className="flex justify-between mt-1 text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
              <span>Be honest and detailed</span>
              <span>{formData.comment.length} / 1000 chars</span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-gray-100 flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 px-4 bg-[#cd6615] hover:bg-[#b2550f] text-white font-medium rounded-xl text-sm transition shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
            <Link
              to="/orders"
              className="flex-1 py-2.5 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-medium rounded-xl text-sm text-center transition flex items-center justify-center gap-2 cursor-pointer"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>

      <div className="mt-6 p-4 bg-gray-50 border border-gray-150 rounded-2xl flex items-center gap-3 text-xs text-gray-500">
        <ShieldCheck className="w-5 h-5 text-green-600 shrink-0" />
        <span>Your reviews help build a transparent marketplace community. thank you!</span>
      </div>
    </div>
  );
};

export default WriteReview;