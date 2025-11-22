import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";   
import axios from "axios";
import ProductList from "../components/ProductList.jsx";
import Filters from "../components/Filters.jsx";
import Pagination from "../components/Pagination.jsx";

const Products = () => {
  const location = useLocation();   
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ category: "", type: "", priceRange: [0, 2000] });
  const [sort, setSort] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");   

  const categories = ["Electric", "Acoustic", "Ukulele"];
  const types = ["Electric", "Acoustic", "Ukulele"];

  useEffect(() => {
   
    const queryParams = new URLSearchParams(location.search);
    const urlSearch = queryParams.get("search") || "";
    setSearchTerm(urlSearch);
    setCurrentPage(1); // 
  }, [location.search]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const query = new URLSearchParams({
          category: filters.category,
          type: filters.type,
          minPrice: filters.priceRange[0],
          maxPrice: filters.priceRange[1],
          sort,
          page: currentPage,
          limit: 12,
          search: searchTerm,   
        }).toString();

        const { data } = await axios.get(`/api/products?${query}`);
        setProducts(data.data || data.products || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, [filters, sort, currentPage, searchTerm]); 

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Search Results Title */}
      {searchTerm && (
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Search Results for:{" "}
            <span className="text-indigo-600">"{searchTerm}"</span>
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            {products.length} guitar{products.length !== 1 ? "s" : ""} found
          </p>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar */}
        <aside className="md:w-64">
          <Filters categories={categories} types={types} onFilterChange={setFilters} />
          <div className="bg-white border rounded-lg p-4 mt-4">
            <label className="block mb-2 font-medium">Sort By</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="latest">Latest</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-600">No guitars found</p>
              <a href="/products" className="text-indigo-600 underline mt-4 inline-block">
                View all guitars →
              </a>
            </div>
          ) : (
            <>
              <ProductList products={products} />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;