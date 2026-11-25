export default function StarRating({ value = 0, onChange, size = "text-xl" }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(n)}
          className={`${size} ${n <= Math.round(value) ? "text-rose-500" : "text-gray-300"} ${
            onChange
              ? "hover:scale-110 transition cursor-pointer"
              : "cursor-default"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
