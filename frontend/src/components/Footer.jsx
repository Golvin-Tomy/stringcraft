import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300">
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand & Contact */}
        <div>
          <h2 className="text-2xl italic font-semibold text-white mb-3">
            StringCraft
          </h2>
          <p className="text-sm leading-relaxed">
            Handcrafted guitars built with passion and precision for every
            musician.
          </p>
          <p className="mt-3 text-sm">📧 support@stringcraft.com</p>
          <p className="text-sm">📞 +91 12345 67890</p>

          <div className="flex space-x-4 mt-4">
            <a
              href="#"
              aria-label="Facebook"
              className="hover:text-white transition-transform transform hover:scale-110"
            >
              <FaFacebookF size={18} />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="hover:text-white transition-transform transform hover:scale-110"
            >
              <FaTwitter size={18} />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="hover:text-white transition-transform transform hover:scale-110"
            >
              <FaInstagram size={18} />
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="hover:text-white transition-transform transform hover:scale-110"
            >
              <FaYoutube size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-white transition-colors">
                Products
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-white transition-colors">
                Cart
              </Link>
            </li>
            <li>
              <Link to="/account" className="hover:text-white transition-colors">
                Account
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Categories</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/products?category=electric"
                className="hover:text-white transition-colors"
              >
                Electric Guitars
              </Link>
            </li>
            <li>
              <Link
                to="/products?category=acoustic"
                className="hover:text-white transition-colors"
              >
                Acoustic Guitars
              </Link>
            </li>
            <li>
              <Link
                to="/products?category=ukulele"
                className="hover:text-white transition-colors"
              >
                Ukuleles
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Support</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/faq" className="hover:text-white transition-colors">
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white transition-colors">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-8">
        <div className="container mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-white font-medium">StringCraft</span>. All
            rights reserved.
          </p>
          <p className="mt-2 sm:mt-0">
            Made with ❤️ by{" "}
            <span className="text-white font-semibold">StringCraft Team</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
