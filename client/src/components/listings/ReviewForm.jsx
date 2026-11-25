import { useState } from "react";
import StarRating from "../ui/StarRating";
import api from "../../api/axios";

export default function ReviewForm({ bookingId, onSubmitted }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!rating) return setError("Please select a star rating");
    if (!comment.trim()) return setError("Please write a short comment");

    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/reviews", { bookingId, rating, comment });
      onSubmitted(res.data.review);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 border-t border-gray-100 pt-4">
      <p className="text-sm font-medium text-gray-900 mb-2">
        How was your stay?
      </p>
      <StarRating value={rating} onChange={setRating} size="text-2xl" />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        placeholder="Tell future guests about your experience..."
        className="mt-3 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-3 bg-rose-500 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-rose-600 transition disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit review"}
      </button>
    </div>
  );
}
