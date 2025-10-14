

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ProductList from "../components/ProductList.jsx";
import Pagination from "../components/Pagination.jsx";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Search = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const initialSearch = query.get("q") || "";

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(Number(query.get("page")) || 1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        const params = new URLSearchParams({
          q: searchTerm,
          page: currentPage,
          limit: 12,
        }).toString();

        const { data } = await axios.get(`/api/products/search?${params}`);
        setResults(data.data);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error(err);
      }
    };

    fetchResults();
  }, [searchTerm, currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    navigate(`/search?q=${searchTerm}&page=1`);
  };

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-6">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Search for guitars..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          Search
        </button>
      </form>

      {/* Results */}
      {results.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">No results found for "{searchTerm}"</p>
      ) : (
        <>
          <ProductList products={results} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default Search;
