import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import BookingWidget from "../components/listings/BookingWidget";

export default function ListingPage() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await api.get(`/listings/${id}`);
        setListing(res.data.listing || res.data);
      } catch (err) {
        setError("listing not found");
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center item-center h-96">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="max-w-7xl mx-auto px-6 py-6 text-center text-red-500">
        {error}
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{listing.title}</h1>
      <p className="text-gray-500 mb-6">
        {listing.location}, {listing.city}, {listing.country}
      </p>

      {/* Photo Gallery */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-96 rounded-2xl overflow-hidden mb-8">
        <div className="col-span-2 row-span-2">
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-full object-cover cursor-pointer hover:brightness-95 transition"
            onClick={() => setCurrentImage(0)}
          />
        </div>
        {listing.images.slice(1, 5).map((img, i) => (
          <div key={i} className="col-span-1 row-span-1">
            <img
              src={img}
              alt={`${listing.title} ${i + 2}`}
              className="w-full h-full object-cover cursor-pointer hover:brightness-95 transition"
              onClick={() => setCurrentImage(i + 1)}
            />
          </div>
        ))}
      </div>

      {/* Main content + booking widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left side — listing details */}
        <div className="lg:col-span-2">
          {/* Host info */}
          <div className="flex items-center justify-between pb-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Hosted by {listing.host?.name}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {listing.guests} guests · {listing.bedrooms} bedrooms ·{" "}
                {listing.bathrooms} bathrooms
              </p>
            </div>
            <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {listing.host?.name?.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Description */}
          <div className="py-6 border-b border-gray-200">
            <p className="text-gray-700 leading-relaxed">
              {listing.description}
            </p>
          </div>

          {/* Amenities */}
          <div className="py-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              What this place offers
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {listing.amenities?.map((amenity) => (
                <div
                  key={amenity}
                  className="flex items-center gap-3 text-gray-700"
                >
                  <span className="text-xl">✓</span>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="py-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              About this space
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-gray-700">
                <span className="text-2xl">👥</span>
                <div>
                  <p className="font-medium">Guests</p>
                  <p className="text-sm text-gray-500">
                    Up to {listing.guests} guests
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <span className="text-2xl">🛏</span>
                <div>
                  <p className="font-medium">Bedrooms</p>
                  <p className="text-sm text-gray-500">
                    {listing.bedrooms} bedrooms
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <span className="text-2xl">🚿</span>
                <div>
                  <p className="font-medium">Bathrooms</p>
                  <p className="text-sm text-gray-500">
                    {listing.bathrooms} bathrooms
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <span className="text-2xl">📍</span>
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-sm text-gray-500">
                    {listing.city}, {listing.country}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side — booking widget */}
        <div className="lg:col-span-1">
          <BookingWidget listing={listing} />
        </div>
      </div>
    </div>
  );
}
