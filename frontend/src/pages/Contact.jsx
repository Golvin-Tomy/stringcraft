import React from "react";
import { Link } from "react-router-dom";
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Contact Us</h1>
          <p className="text-gray-500 mt-3 text-lg">
            We'd love to hear from you. Reach out through any of the channels below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Contact Info Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Get In Touch</h2>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                <EnvelopeIcon className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                
                 <a href="mailto:support@stringcraft.com"
                  className="text-gray-900 font-semibold hover:underline"
                >
                  support@stringcraft.com
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                <PhoneIcon className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                
                 <a href="tel:+919876543210"
                  className="text-gray-900 font-semibold hover:underline"
                >
                  +91 98765 43210
                </a>
                <p className="text-xs text-gray-400 mt-0.5">Mon–Sat, 10am–6pm IST</p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                <MapPinIcon className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Address</p>
                <p className="text-gray-900 font-semibold">StringCraft Music Store</p>
                <p className="text-gray-600 text-sm">
                  42, Guitar Street, Edapally<br />
                  Kochi, Kerala 600001<br />
                  India
                </p>
              </div>
            </div>
          </div>

          {/* Social Media Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Follow Us</h2>
            <p className="text-gray-500 text-sm">
              Stay updated with new arrivals, offers, and guitar tips.
            </p>

            <div className="space-y-4">
              {/* Instagram */}
              
               <a href=""
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition group"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 group-hover:text-black">Instagram</p>
                  <p className="text-xs text-gray-400">@stringcraft</p>
                </div>
              </a>

              {/* YouTube */}
              
               <a href=""
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition group"
              >
                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 group-hover:text-black">YouTube</p>
                  <p className="text-xs text-gray-400">@stringcraft</p>
                </div>
              </a>

              {/* Facebook */}
              
               <a href=""
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition group"
              >
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 group-hover:text-black">Facebook</p>
                  <p className="text-xs text-gray-400">StringCraft Music</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Business Hours</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            {[
              { day: "Monday – Friday", hours: "10:00 AM – 7:00 PM" },
              { day: "Saturday", hours: "10:00 AM – 6:00 PM" },
              { day: "Sunday", hours: "Closed" },
            ].map((item) => (
              <div key={item.day} className="bg-gray-50 rounded-xl p-4">
                <p className="font-semibold text-gray-700">{item.day}</p>
                <p className={`mt-1 ${item.hours === "Closed" ? "text-red-500" : "text-gray-500"}`}>
                  {item.hours}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Looking for a specific guitar?{" "}
            <Link to="/products" className="text-black font-semibold hover:underline">
              Browse our collection →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;