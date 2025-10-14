

import React, { useState } from "react";

const Filters = ({ categories, types, onFilterChange }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [priceRange, setPriceRange] = useState([0, 2000]);

  const handleFilterChange = () => {
    onFilterChange({
      category: selectedCategory,
      type: selectedType,
      priceRange,
    });
  };

  return (
    <div className="bg-white border rounded-lg p-4 mb-6 space-y-4">
      <h4 className="text-lg font-semibold">Filters</h4>

      {/* Category */}
      <div>
        <label className="block mb-1 font-medium">Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          onBlur={handleFilterChange}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Type */}
      <div>
        <label className="block mb-1 font-medium">Type</label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          onBlur={handleFilterChange}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block mb-1 font-medium">Max Price: ${priceRange[1]}</label>
        <input
          type="range"
          min="0"
          max="2000"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
          onMouseUp={handleFilterChange}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default Filters;
