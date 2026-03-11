export default function TabButton({ name, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 font-semibold transition-all duration-300 ${
        isActive
          ? 'text-purple-400 border-b-2 border-purple-400 shadow-lg shadow-purple-500/50'
          : 'text-gray-400 hover:text-gray-300 border-b-2 border-transparent'
      }`}
    >
      {name}
    </button>
  );
}
