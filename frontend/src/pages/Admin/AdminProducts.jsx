import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // ✅ USE AXIOS
import { useToast } from "../../components/Toast.jsx"; // ✅ YOUR CUSTOM TOAST
import ProductList from "../../components/ProductList.jsx";
import useAuthStore from "../../state/authStore.js";

const AdminProducts = () => {
  const { user, token } = useAuthStore();
  const { addToast } = useToast(); 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/admin/products",
        {
          headers: { Authorization: `Bearer ${token}` }, // ✅ JWT
        },
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Products error:", error);
      showToast(
        error.response?.data?.message || "Failed to load products",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this guitar permanently?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      addToast("Product deleted successfully", "success");
      fetchProducts();
    } catch (err) {
      addToast(err.response?.data?.error || "Delete failed", "error");
    }
  };

  useEffect(() => {
    if (token) fetchProducts(); // ✅ Only if logged in
  }, [token]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Products Management
          </h1>
          <p className="text-gray-600 mt-1">Total: {products.length} guitars</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={fetchProducts}
            className="bg-gray-600 text-white px-5 py-3 rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
          >
            Refresh
          </button>
          <Link
            to="/admin/add-product"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-bold flex items-center gap-2"
          >
            + Add New Guitar
          </Link>
        </div>
      </div>

      {/* Loading / Empty State */}
      {loading ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-600">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow">
          <p className="text-2xl text-gray-600 mb-6">No products yet</p>
          <Link
            to="/admin/add-product"
            className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-green-700"
          >
            + Add Your First Guitar
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <ProductList products={products} admin onDelete={deleteProduct} />
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
