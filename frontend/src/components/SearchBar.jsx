

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api.js";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef();

  // Fetch live search results
  useEffect(() => {
    if (!query) return setResults([]);

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/products", {
          params: { name: query, limit: 5 },
        });
        setResults(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300); // debounce 300ms

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?name=${encodeURIComponent(query)}`);
    setResults([]);
  };

  return (
    <div className="relative w-full max-w-md" ref={dropdownRef}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search gguitars..."
          className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </form>

      {results.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border mt-1 rounded shadow-lg max-h-60 overflow-auto">
          {results.map((product) => (
            <li key={product._id}>
              <Link
                to={`/products/${product._id}`}
                className="block px-4 py-2 hover:bg-indigo-50"
                onClick={() => setQuery("")}
              >
                {product.name} - ${product.price.toFixed(2)}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {loading && <div className="absolute right-2 top-2 text-gray-500">Loading...</div>}
    </div>
  );
};

export default SearchBar;
