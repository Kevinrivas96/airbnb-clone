import { useState, useEffect } from "react";
import api from "../../api/axios";
import StarRating from "../ui/StarRating";

export default function ReviewsSection({ listingId }) {
  const [data, setData] = useState({ reviews: [], average: null, count: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/reviews/listing/${listingId}`)
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [listingId]);

  if (loading) return null;

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        {data.count > 0
          ? `★ ${data.average} · ${data.count} review${data.count !== 1 ? "s" : ""}`
          : "No reviews yet"}
      </h3>

      <div className="space-y-6">
        {data.reviews.map((review) => (
          <div key={review.id}>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold">
                {review.author.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">
                  {review.author.name}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <StarRating value={review.rating} size="text-sm" />
            <p className="text-gray-700 text-sm mt-1">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
