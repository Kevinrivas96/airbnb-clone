import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/axios";

export default function BookingSuccessPage() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }
    api
      .get(`/payments/verify/${sessionId}`)
      .then((res) => setStatus(res.data.status))
      .catch(() => setStatus("error"));
  }, [sessionId]);

  return (
    <div className="max-w-md mx-auto px-6 py-24 text-center">
      {status === "checking" && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-500" />
        </div>
      )}

      {status === "confirmed" && (
        <>
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment successful
          </h1>
          <p className="text-gray-500 mb-6">
            Your booking is confirmed. Pack your bags!
          </p>
        </>
      )}

      {status === "pending" && (
        <>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment processing
          </h1>
          <p className="text-gray-500 mb-6">
            Your payment is still being processed. Check My Trips in a moment.
          </p>
        </>
      )}

      {(status === "cancelled" || status === "error") && (
        <>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Something went wrong
          </h1>
          <p className="text-gray-500 mb-6">
            We couldn't confirm this booking. Check My Trips for its status.
          </p>
        </>
      )}

      {status !== "checking" && (
        <Link
          to="/trips"
          className="inline-block bg-rose-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-rose-600 transition"
        >
          View my trips
        </Link>
      )}
    </div>
  );
}
