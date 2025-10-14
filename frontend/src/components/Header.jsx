

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCartIcon, UserCircleIcon, Bars3Icon } from "@heroicons/react/24/outline";

const Header = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search)}`);
      setSearch("");
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl italic font-semibold text-black hover:text-gray-700 transition"
        >
          StringCraft
        </Link>

        {/* Center Navigation */}
        <nav className="hidden sm:flex space-x-8 text-black font-medium">
          <Link
            to="/"
            className="hover:text-gray-600 transition-colors duration-200"
          >
            Home
          </Link>
          <Link
            to="/products"
            className="hover:text-gray-600 transition-colors duration-200"
          >
            Products
          </Link>
          <Link
            to="/about"
            className="hover:text-gray-600 transition-colors duration-200"
          >
            About
          </Link>
        </nav>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 mx-4 max-w-xl"
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search guitars..."
            className="flex-grow border border-black rounded-l-md px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-black"
          />
          <button
            type="submit"
            className="bg-black text-white px-4 rounded-r-md hover:bg-gray-800 transition"
          >
            Search
          </button>
        </form>

        {/* Icons */}
        <div className="flex items-center space-x-4">
          {/* Cart Icon */}
          <Link to="/cart" className="relative">
            <ShoppingCartIcon className="h-6 w-6 text-black hover:text-gray-700 transition" />
            <span className="absolute -top-2 -right-2 bg-black text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              3
            </span>
          </Link>

          {/* Account Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-1 focus:outline-none"
            >
              <UserCircleIcon className="h-6 w-6 text-black hover:text-gray-700 transition" />
              <span className="hidden sm:inline text-black">Account</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg py-2 z-50">
                <Link
                  to="/account"
                  className="block px-4 py-2 text-black hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/orders"
                  className="block px-4 py-2 text-black hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Orders
                </Link>
                <Link
                  to="/signin"
                  className="block px-4 py-2 text-black hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Sign Out
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div className="sm:hidden">
            <Bars3Icon className="h-6 w-6 text-black" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
