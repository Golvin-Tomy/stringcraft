import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCartStore from "../state/cartStore";
import useAuthStore from "../state/authStore";
import {
  ShoppingCartIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const Header = () => {
  const cartCount = useCartStore((state) => state.getTotalItems());
  const navigate = useNavigate();
  const { user, logout, initUser } = useAuthStore();

  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Load user from token on mount
  useEffect(() => {
    initUser();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search)}`);
      setSearch("");
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl italic font-bold text-black hover:text-gray-700 transition">
          StringCraft
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8 font-medium text-gray-700">
          <Link to="/" className="hover:text-black transition">Home</Link>
          <Link to="/products" className="hover:text-black transition">Products</Link>
          <Link to="/about" className="hover:text-black transition">About</Link>
        </nav>

        {/* Search Bar */}
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
          <button type="submit" className="bg-black text-white px-4 hover:bg-gray-800 transition">
            <MagnifyingGlassIcon className="h-5 w-5" />
          </button>
        </form>

        <div className="flex items-center space-x-4">
          {/* Cart */}
          <Link to="/cart" className="relative">
            <ShoppingCartIcon className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Account Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-1 focus:outline-none group"
            >
              <UserCircleIcon className="h-6 w-6 text-gray-800 group-hover:text-black transition" />
              <span className="hidden sm:inline text-gray-800 font-medium">
                {user ? `Hey, ${user.name.split(" ")[0]}` : "Account"}
              </span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-50">
                {user ? (
                  <>
                    {/* Logged in */}
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <Link
                      to="/account"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/account/orders"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      My Orders
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    {/* Logged out */}
                    <Link
                      to="/signin"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-gray-800" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-md">
          <form onSubmit={handleSearch} className="flex border-b border-gray-200 px-4 py-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search guitars..."
              className="flex-grow px-3 py-2 focus:outline-none"
            />
            <button type="submit" className="bg-black text-white px-4 rounded-md hover:bg-gray-800 transition">
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
          </form>
          <nav className="flex flex-col px-4 py-2 text-gray-700 font-medium space-y-2">
            <Link to="/" className="hover:text-black" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/products" className="hover:text-black" onClick={() => setMenuOpen(false)}>Products</Link>
            <Link to="/about" className="hover:text-black" onClick={() => setMenuOpen(false)}>About</Link>
            <hr className="border-gray-200" />
            {user ? (
              <>
                <Link to="/account" className="hover:text-black" onClick={() => setMenuOpen(false)}>Profile</Link>
                <Link to="/account/orders" className="hover:text-black" onClick={() => setMenuOpen(false)}>My Orders</Link>
                {user.role === "admin" && (
                  <Link to="/admin" className="hover:text-black" onClick={() => setMenuOpen(false)}>Admin Panel</Link>
                )}
                <button onClick={handleLogout} className="text-left text-red-600 hover:text-red-700">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/signin" className="hover:text-black" onClick={() => setMenuOpen(false)}>Sign In</Link>
                <Link to="/signup" className="hover:text-black" onClick={() => setMenuOpen(false)}>Sign Up</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;