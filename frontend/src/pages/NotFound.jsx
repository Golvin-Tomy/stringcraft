import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-6">Oops! Page not found.</p>
      <Link
        to="/"
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
