const categories = [
  { label: "All", icon: "🏠" },
  { label: "Cabins", icon: "🌲" },
  { label: "Beach", icon: "🏖️" },
  { label: "Apartments", icon: "🏢" },
  { label: "Luxury", icon: "✨" },
  { label: "Camping", icon: "⛺" },
  { label: "Farms", icon: "🌾" },
  { label: "pools", icon: "🏊" },
];

export default function CategoryFilter({ selected, onSelect }) {
  return (
    <div className="flex justify-center gap-8 overflow-x-auto px-6 py-4 border-b border-gray-200 scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat.label}
          onClick={() => onSelect(cat.label === "All" ? "" : cat.label)}
          className={`flex flex-col items-center gap-1 min-w-fit pb-2 border-b-2 transition ${
            selected === cat.label || (cat.label === "All" && !selected)
              ? "border-gray-800 text-gray-800"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          <span className="text-2xl">{cat.icon}</span>
          <span className="text-xs font-medium whitespace-nowrap">
            {cat.label}
          </span>
        </button>
      ))}
    </div>
  );
}
