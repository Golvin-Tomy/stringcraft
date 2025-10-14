

import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-200 mt-12">
      <div className="container mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* About / Contact */}
        <div>
          <h3 className="text-lg font-bold mb-3">StringCraft</h3>
          <p>Handcrafted guitars for all musicians.</p>
          <p className="mt-2">Email: support@stringcraft.com</p>
          <p>Phone: +91 12345 67890</p>
          <div className="flex space-x-3 mt-3">
            <a href="#" aria-label="Facebook" className="hover:text-indigo-500">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-indigo-500">
              <FaTwitter />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-indigo-500">
              <FaInstagram />
            </a>
            <a href="#" aria-label="YouTube" className="hover:text-indigo-500">
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-bold mb-3">Quick Links</h3>
          <ul>
            <li>
              <Link to="/" className="hover:text-indigo-500">
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-indigo-500">
                Products
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-indigo-500">
                Cart
              </Link>
            </li>
            <li>
              <Link to="/account" className="hover:text-indigo-500">
                Account
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-lg font-bold mb-3">Categories</h3>
          <ul>
            <li>
              <Link to="/products?category=electric" className="hover:text-indigo-500">
                Electric
              </Link>
            </li>
            <li>
              <Link to="/products?category=acoustic" className="hover:text-indigo-500">
                Acoustic
              </Link>
            </li>
            <li>
              <Link to="/products?category=ukulele" className="hover:text-indigo-500">
                Ukulele
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-bold mb-3">Support</h3>
          <ul>
            <li>
              <Link to="/faq" className="hover:text-indigo-500">
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-indigo-500">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-indigo-500">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-indigo-500">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-6">
        <div className="container mx-auto px-4 py-4 text-center text-sm">
          &copy; {new Date().getFullYear()} StringCraft. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
