import { useState, useEffect } from "react";
import api from "../api/axios";
import ListingCard from "../components/listings/ListingCard";
import CategoryFilter from "../components/listings/CategoryFilter";

export default function HomePage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const params = {};
        if (category) params.category = category;
        const res = await api.get("/listings", { params });
        setListings(res.data.listings);
      } catch (err) {
        setError("Failed to load listings");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [category]);

  return (
    <div>
      {/* Category filter */}
      <CategoryFilter selected={category} onSelect={setCategory} />

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-500" />
          </div>
        )}

        {error && <div className="text-center text-red-500 py-10">{error}</div>}

        {!loading && !error && listings.length === 0 && (
          <div className="text-center text-gray-400 py-20">
            <p className="text-xl">No listings found</p>
            <p className="text-sm mt-2">Try a different category</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
