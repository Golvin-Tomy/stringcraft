import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import ProductList from "../components/ProductList.jsx";
import Pagination from "../components/Pagination.jsx";

const Products = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    brand: "",
    priceRange: [0, 200000],
  });
  const [sort, setSort] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  
  const categories = ["All", "Electric", "Acoustic", "Ukulele"];
  const brands = ["All", "Fender", "Gibson", "Yamaha", "Ibanez", "Kadence", "Kala", "Taylor", "Martin"];

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const urlSearch = queryParams.get("search") || "";
    setSearchTerm(urlSearch);
    setCurrentPage(1);
  }, [location.search]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const query = new URLSearchParams({
          category: filters.category === "All" ? "" : filters.category,
          brand: filters.brand === "All" ? "" : filters.brand,
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
      {/* Search Title */}
      {searchTerm && (
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800">
            Results for: <span className="text-indigo-600">"{searchTerm}"</span>
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            {products.length} guitar{products.length !== 1 ? "s" : ""} found
          </p>
        </div>
      )}

      {/* FILTERS + SORT BAR */}
      <div className="bg-white border rounded-lg p-6 mb-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Category Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
            <select
              value={filters.brand}
              onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="latest">Latest</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products */}
      <div>
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-600">No guitars found</p>
            <button
              onClick={() => {
                setFilters({ category: "", brand: "", priceRange: [0, 200000] });
                setSort("latest");
              }}
              className="mt-6 text-indigo-600 underline text-lg"
            >
              ← Clear filters
            </button>
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
  );
};

export default Products;