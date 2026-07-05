import { Link } from "react-router-dom";
import { useState } from "react";

export default function ListingCard({ listing }) {
  const [currentImage, setCurrentImage] = useState(0);

  return (
    <Link to={`/listings/${listing.id}`} className="group cursor-pointer">
      {/* Image */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
        <img
          src={listing.images[currentImage]}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />

        {/* Image dots */}
        {listing.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {listing.images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentImage(i);
                }}
                className={`w-1.5 h-1.5 rounded-full transition ${
                  i === currentImage ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}

        {/* Wishlist button */}
        <button
          onClick={(e) => e.preventDefault()}
          className="absolute top-3 right-3 text-white hover:scale-110 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 drop-shadow"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      {/* Info */}
      <div className="mt-2">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-gray-900 truncate">
            {listing.city}, {listing.country}
          </h3>
          <div className="flex items-center gap-1 ml-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-900"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm text-gray-900">4.9</span>
          </div>
        </div>
        <p className="text-sm text-gray-400">{listing.category}</p>
        <p className="text-sm text-gray-400">
          {listing.bedrooms} bed · {listing.bathrooms} bath · {listing.guests}{" "}
          guests
        </p>
        <p className="mt-1 text-sm">
          <span className="font-semibold text-gray-900">${listing.price}</span>
          <span className="text-gray-500"> / night</span>
        </p>
      </div>
    </Link>
  );
}
