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
        const allProducts = data.data || [];
        setProducts(allProducts);
        setFeatured(allProducts.slice(0, 4));
        setTopSellers([...allProducts].sort((a, b) => b.ratings - a.ratings).slice(0, 4)); // top 4 by ratings
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  const categories = [
    { name: "Electric", image: "https://i.pinimg.com/1200x/6e/ad/f1/6eadf1f2e6d7daac0a602c0d01cb0957.jpg" },
    { name: "Acoustic", image: "https://i.pinimg.com/1200x/d2/8f/ce/d28fce348923ad255ee967e3ffc530aa.jpg" },
    { name: "Ukulele", image: "https://i.pinimg.com/1200x/65/1c/df/651cdfa8affb5a70f366839c8988bd66.jpg" },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] overflow-hidden rounded-xl shadow-md">
        <img
          src="https://i.pinimg.com/1200x/2e/30/c9/2e30c9b3859ae234948faed461842909.jpg"
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Find Your Perfect Guitar
          </h1>
          <p className="text-gray-200 text-lg md:text-xl mb-6">
            Discover premium guitars crafted for tone and passion.
          </p>
          <Link
            to="/products"
            className="bg-white text-black font-semibold px-6 py-3 rounded-md hover:bg-gray-200 transition"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${cat.name.toLowerCase()}`}
              className="relative group overflow-hidden rounded-xl shadow hover:shadow-lg transition-all"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition"></div>
              <span className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Section */}
      <section className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Featured</h2>
        <ProductList products={featured} />
      </section>

      {/* Top Sellers Section */}
      <section className="bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Top Sellers
          </h2>
          <ProductList products={topSellers} />
        </div>
      </section>

      {/* All Products Section */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">All Products</h2>
          <Link
            to="/products"
            className="text-gray-600 hover:text-black flex items-center space-x-1 transition"
          >
            <span>View All</span>
            <ChevronRightIcon className="w-4 h-4" />
          </Link>
        </div>
        <ProductList products={products} />
      </section>
    </div>
  );
};

export default Home;
