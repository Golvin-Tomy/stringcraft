

import React, { useEffect, useState } from "react";
import ProductList from "../components/ProductList.jsx";
import { Link } from "react-router-dom";
import axios from "axios";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [topSellers, setTopSellers] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("/api/products?limit=12");
        setProducts(data.data || []);
        setFeatured(data.data.slice(0, 4)); // first 4 as featured
        setTopSellers(data.data.sort((a, b) => b.ratings - a.ratings).slice(0, 4));
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  const categories = [
    { name: "Electric", image: "/images/categories/electric.jpg" },
    { name: "Acoustic", image: "/images/categories/acoustic.jpg" },
    { name: "Ukulele", image: "/images/categories/ukulele.jpg" },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Carousel */}
      <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-lg shadow">
        <img
          src="/images/hero/hero1.jpg"
          alt="Hero 1"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <h1 className="text-3xl md:text-5xl text-white font-bold">
            Find Your Perfect Guitar
          </h1>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${cat.name.toLowerCase()}`}
              className="relative group overflow-hidden rounded-lg"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <span className="text-white text-lg font-bold">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 flex items-center justify-between">
          Featured
          <Link
            to="/products"
            className="text-indigo-600 hover:underline flex items-center space-x-1"
          >
            <span>View All</span>
            <ChevronRightIcon className="w-4 h-4" />
          </Link>
        </h2>
        <ProductList products={featured} />
      </div>

      {/* Top Sellers */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 flex items-center justify-between">
          Top Sellers
          <Link
            to="/products"
            className="text-indigo-600 hover:underline flex items-center space-x-1"
          >
            <span>View All</span>
            <ChevronRightIcon className="w-4 h-4" />
          </Link>
        </h2>
        <ProductList products={topSellers} />
      </div>

      {/* Product Grid */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">All Products</h2>
        <ProductList products={products} />
      </div>
    </div>
  );
};

export default Home;
