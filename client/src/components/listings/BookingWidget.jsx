import { useState } from "react";
import {
  differenceInCalendarDays,
  addDays,
  format,
  isBefore,
  startOfDay,
} from "date-fns";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

export default function BookingWidget({ listing }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const today = startOfDay(new Date());

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [activeField, setActiveField] = useState(null); // 'checkin' | 'checkout' | null
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Which month the calendar is showing
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const nights =
    startDate && endDate ? differenceInCalendarDays(endDate, startDate) : 0; // Calculate number of nights
  const totalPrice = nights * listing.price;
  const serviceFee = Math.round(totalPrice * 0.12);

  // Build the calendar days grid
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    // Empty slots before the first day
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    // Actual days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const handleDayClick = (day) => {
    if (!day) return;
    if (isBefore(day, today)) return; // Can't pick past dates

    if (activeField === "checkin") {
      setStartDate(day);
      // If new start is after existing end, clear end
      if (endDate && !isBefore(day, endDate)) {
        setEndDate(null);
      }
      setActiveField("checkout"); // Auto advance to checkout
    } else if (activeField === "checkout") {
      if (startDate && isBefore(day, startDate)) {
        // If they pick a checkout before checkin, swap to checkin
        setStartDate(day);
        setEndDate(null);
        setActiveField("checkout");
      } else {
        setEndDate(day);
        setActiveField(null); // Done — close calendar
      }
    }
  };

  const getDayStyle = (day) => {
    if (!day) return "";
    const isPast = isBefore(day, today);
    if (isPast) return "text-gray-300 cursor-not-allowed";

    const isStart =
      startDate && day.toDateString() === startDate.toDateString();
    const isEnd = endDate && day.toDateString() === endDate.toDateString();
    const isInRange = startDate && endDate && day > startDate && day < endDate;

    if (isStart || isEnd) {
      return "bg-gray-900 text-white rounded-full font-semibold";
    }
    if (isInRange) {
      return "bg-gray-100 text-gray-900";
    }
    return "hover:bg-gray-100 rounded-full cursor-pointer text-gray-800";
  };

  const prevMonth = () => {
    setCalendarMonth(
      new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1),
    );
  };

  const nextMonth = () => {
    setCalendarMonth(
      new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1),
    );
  };

  const handleBooking = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!startDate || !endDate) {
      setError("Please select check-in and check-out dates");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/payments/checkout", {
        listingId: listing.id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
      window.location.href = res.data.url; // redirect to Stripe
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
      setLoading(false);
    }
  };

  const handleClearDates = () => {
    setStartDate(null);
    setEndDate(null);
    setActiveField(null);
    setError(null);
  };

  const days = getDaysInMonth(calendarMonth);
  const monthLabel = format(calendarMonth, "MMMM yyyy");
  const showCalendar = activeField !== null;

  return (
    <div className="border border-gray-200 rounded-2xl p-6 shadow-lg sticky top-24">
      {/* Price */}
      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-2xl font-bold text-gray-900">
          ${listing.price}
        </span>
        <span className="text-gray-500">/ night</span>
      </div>

      {/* Check-in / Check-out fields */}
      <div className="border border-gray-300 rounded-xl overflow-hidden mb-3">
        <div className="grid grid-cols-2 divide-x divide-gray-300">
          {/* Check-in */}
          <button
            onClick={() =>
              setActiveField(activeField === "checkin" ? null : "checkin")
            }
            className={`p-3 text-left transition ${
              activeField === "checkin"
                ? "bg-gray-50 ring-2 ring-inset ring-gray-800"
                : "hover:bg-gray-50"
            }`}
          >
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Check-in
            </p>
            <p
              className={`text-sm mt-0.5 ${startDate ? "text-gray-900 font-medium" : "text-gray-400"}`}
            >
              {startDate ? format(startDate, "MMM d, yyyy") : "Add date"}
            </p>
          </button>

          {/* Check-out */}
          <button
            onClick={() =>
              setActiveField(activeField === "checkout" ? null : "checkout")
            }
            className={`p-3 text-left transition ${
              activeField === "checkout"
                ? "bg-gray-50 ring-2 ring-inset ring-gray-800"
                : "hover:bg-gray-50"
            }`}
          >
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Check-out
            </p>
            <p
              className={`text-sm mt-0.5 ${endDate ? "text-gray-900 font-medium" : "text-gray-400"}`}
            >
              {endDate ? format(endDate, "MMM d, yyyy") : "Add date"}
            </p>
          </button>
        </div>
      </div>

      {/* Calendar */}
      {showCalendar && (
        <div className="border border-gray-200 rounded-xl p-4 mb-3">
          {/* Calendar header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="p-1 hover:bg-gray-100 rounded-full transition text-gray-600"
            >
              ‹
            </button>
            <p className="text-sm font-semibold text-gray-900">{monthLabel}</p>
            <button
              onClick={nextMonth}
              className="p-1 hover:bg-gray-100 rounded-full transition text-gray-600"
            >
              ›
            </button>
          </div>

          {/* Instruction */}
          <p className="text-xs text-center text-gray-400 mb-3">
            {activeField === "checkin"
              ? "Select your check-in date"
              : "Select your check-out date"}
          </p>

          {/* Day labels */}
          <div className="grid grid-cols-7 mb-1">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div
                key={d}
                className="text-center text-xs text-gray-400 font-medium py-1"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-y-1">
            {days.map((day, i) => (
              <div
                key={i}
                onClick={() => day && handleDayClick(day)}
                className={`
                  text-center text-sm py-1.5 select-none transition
                  ${getDayStyle(day)}
                `}
              >
                {day ? day.getDate() : ""}
              </div>
            ))}
          </div>

          {/* Clear dates */}
          {(startDate || endDate) && (
            <button
              onClick={handleClearDates}
              className="mt-3 text-xs text-gray-400 hover:text-gray-600 underline w-full text-center"
            >
              Clear dates
            </button>
          )}
        </div>
      )}

      {/* Price breakdown */}
      {nights > 0 && (
        <div className="mb-4 space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>
              ${listing.price} × {nights} night{nights !== 1 ? "s" : ""}
            </span>
            <span>${totalPrice}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Service fee</span>
            <span>${serviceFee}</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between font-semibold text-gray-900">
            <span>Total</span>
            <span>${totalPrice + serviceFee}</span>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg mb-3">
          {error}
        </div>
      )}

      {/* Book button */}
      <button
        onClick={handleBooking}
        disabled={loading || !startDate || !endDate}
        className="w-full bg-rose-500 text-white py-3 rounded-xl font-medium hover:bg-rose-600 transition disabled:opacity-50"
      >
        {loading ? "Booking..." : user ? "Reserve" : "Log in to book"}
      </button>

      {!user && (
        <p className="text-center text-xs text-gray-400 mt-2">
          You'll be redirected to login
        </p>
      )}
    </div>
  );
}
