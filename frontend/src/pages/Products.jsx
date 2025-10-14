

import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductList from "../components/ProductList.jsx";
import Filters from "../components/Filters.jsx";
import Pagination from "../components/Pagination.jsx";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ category: "", type: "", priceRange: [0, 2000] });
  const [sort, setSort] = useState("latest"); // latest, priceAsc, priceDesc, rating
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = ["Electric", "Acoustic", "Ukulele"];
  const types = ["Electric", "Acoustic", "Ukulele"];

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
        }).toString();

        const { data } = await axios.get(`/api/products?${query}`);
        setProducts(data.data);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, [filters, sort, currentPage]);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Filters Sidebar */}
      <aside className="md:w-64">
        <Filters categories={categories} types={types} onFilterChange={setFilters} />
        {/* Sorting */}
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
        <ProductList products={products} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default Products;
