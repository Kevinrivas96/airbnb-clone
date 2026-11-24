import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function TripsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    api
      .get("/bookings/my-trips")
      .then((res) => setBookings(res.data.bookings))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const handleCancel = async (bookingId) => {
    try {
      await api.delete(`/bookings/${bookingId}`);
      setBookings(
        bookings.map((b) =>
          b.id === bookingId ? { ...b, status: "cancelled" } : b,
        ),
      );
    } catch (err) {
      alert(err.response?.data?.error || "Failed to cancel booking");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-500" />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Trips</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-400">No trips yet</p>
          <p className="text-sm text-gray-400 mt-2">Time to start exploring</p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 bg-rose-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-rose-600 transition"
          >
            Explore listings
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="flex gap-4 border border-gray-200 rounded-2xl p-4 hover:shadow-md transition"
            >
              <img
                src={booking.listing.images[0]}
                alt={booking.listing.title}
                className="w-32 h-32 object-cover rounded-xl"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {booking.listing.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {booking.listing.city}, {booking.listing.country}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(booking.startDate).toLocaleDateString()} →{" "}
                  {new Date(booking.endDate).toLocaleDateString()}
                </p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  Total: ${booking.totalPrice}
                </p>
                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                    booking.status === "confirmed"
                      ? "bg-green-100 text-green-700"
                      : booking.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {booking.status}
                </span>
              </div>
              {booking.status === "confirmed" && (
                <button
                  onClick={() => handleCancel(booking.id)}
                  className="self-start text-sm text-red-500 hover:underline"
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
