

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "../../components/Toast.jsx";
import ProductList from "../../components/ProductList.jsx";

const AdminProducts = () => {
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/products/admin");
      setProducts(data.data);
    } catch (err) {
      console.error(err);
      showToast("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure to delete this product?")) return;
    try {
      await axios.delete(`/api/products/admin/${id}`);
      showToast("Product deleted", "success");
      fetchProducts();
    } catch (err) {
      showToast(err.response?.data?.error || "Delete failed", "error");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Products Management</h2>
        <button
          onClick={() => window.location.href = "/admin/products/create"}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          Create Product
        </button>
      </div>
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <ProductList products={products} admin onDelete={deleteProduct} />
      )}
    </div>
  );
};

export default AdminProducts;
