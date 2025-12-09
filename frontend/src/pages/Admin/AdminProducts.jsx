import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useToast } from "../../components/Toast.jsx";
import ProductList from "../../components/ProductList.jsx";


const AdminProducts = () => {
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

const fetchProducts = async () => {
  try {
    setLoading(true);
    const response = await api.get('/api/admin/products');  // ✅ Backend route
    setProducts(response.data);
  } catch (error) {
    console.error('Products error:', error);
    toast.error(error.response?.data?.message || 'Failed to load products');
  } finally {
    setLoading(false);
  }
};

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this guitar permanently?")) return;

    try {
      await axios.delete(`/api/products/admin/${id}`, {
        withCredentials: true,
      });
      showToast("Product deleted successfully", "success");
      fetchProducts();
    } catch (err) {
      showToast(err.response?.data?.error || "Delete failed", "error");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
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
          <ProductList 
            products={products} 
            admin 
            onDelete={deleteProduct}
          />
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
