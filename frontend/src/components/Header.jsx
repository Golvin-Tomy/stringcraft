import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCartIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const Header = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search)}`);
      setSearch("");
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl italic font-bold text-black hover:text-gray-700 transition"
        >
          StringCraft
        </Link>

        {/* Center Nav (Desktop) */}
        <nav className="hidden md:flex space-x-8 font-medium text-gray-700">
          <Link to="/" className="hover:text-black transition">Home</Link>
          <Link to="/products" className="hover:text-black transition">Products</Link>
          <Link to="/about" className="hover:text-black transition">About</Link>
        </nav>

        {/* Search (Desktop) */}
        <form
          onSubmit={handleSearch}
          className="hidden lg:flex flex-1 mx-6 max-w-md border border-gray-300 rounded-full overflow-hidden shadow-sm"
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search guitars..."
            className="flex-grow px-4 py-2 text-gray-700 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-black text-white px-4 hover:bg-gray-800 transition"
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
          </button>
        </form>

        {/* Right Icons */}
        <div className="flex items-center space-x-4">
          {/* Cart Icon */}
          <Link to="/cart" className="relative group">
            <ShoppingCartIcon className="h-6 w-6 text-gray-800 group-hover:text-black transition" />
            <span className="absolute -top-2 -right-2 bg-black text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              0
            </span>
          </Link>

          {/* Account Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-1 focus:outline-none group"
            >
              <UserCircleIcon className="h-6 w-6 text-gray-800 group-hover:text-black transition" />
              <span className="hidden sm:inline text-gray-800 font-medium">
                Account
              </span>
            </button>

            {dropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-2 animate-fade-in"
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <Link
                  to="/account"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <Link
                  to="/orders"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Orders
                </Link>
                <Link
                  to="/signin"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Sign Out
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-800"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-md animate-slide-down">
          <form
            onSubmit={handleSearch}
            className="flex border-b border-gray-200 px-4 py-2"
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search guitars..."
              className="flex-grow px-3 py-2 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-black text-white px-4 rounded-md hover:bg-gray-800 transition"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
          </form>
          <nav className="flex flex-col px-4 py-2 text-gray-700 font-medium space-y-2">
            <Link to="/" className="hover:text-black" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link
              to="/products"
              className="hover:text-black"
              onClick={() => setMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              to="/about"
              className="hover:text-black"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
