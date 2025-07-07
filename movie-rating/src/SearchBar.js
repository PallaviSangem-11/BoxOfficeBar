import { FaSearch } from "react-icons/fa";

function SearchBar({ onSearch }) {
  return (
    <div className="flex items-center border rounded-full px-4 py-2.5 shadow-lg w-full max-w-[90%] sm:max-w-md mx-auto bg-[#161b22] border-[#30363d] transition-all duration-300 hover:border-[#58a6ff] focus-within:border-[#58a6ff]">
      <FaSearch className="text-[#8b949e] mr-3 text-base" />
      <input
        type="text"
        placeholder="Search for movies, actors, or directors..."
        onChange={(e) => onSearch(e.target.value)}
        className="w-full outline-none bg-transparent text-[#c9d1d9] text-base placeholder:text-[#8b949e] placeholder:italic focus:placeholder:text-[#58a6ff] transition-colors duration-300"
      />
    </div>
  );
}

export default SearchBar; 