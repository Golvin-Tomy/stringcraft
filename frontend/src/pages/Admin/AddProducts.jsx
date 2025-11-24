import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "../../components/Toast.jsx";

const AddProduct = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "electric",
    brand: "",
    stock: "",
    image: "",
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      const { data } = await axios.post("/api/upload", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm({ ...form, image: data.url });
      showToast("Image uploaded!", "success");
    } catch (err) {
      showToast("Image upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.image) {
      showToast("Please upload an image", "error");
      return;
    }

    try {
      await axios.post("/api/products", form, {
        withCredentials: true,
      });
      showToast("Guitar added successfully!", "success");
      navigate("/admin/products");
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to add product", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Add New Guitar</h1>
          <p className="text-gray-600 mt-2">Fill all details to list a new guitar</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          {/* Name & Brand */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Guitar Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Fender Player Stratocaster"
                className="w-full border-2 rounded-lg px-5 py-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Brand</label>
              <input
                type="text"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                placeholder="e.g. Fender, Yamaha, Ibanez"
                className="w-full border-2 rounded-lg px-5 py-4 focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="5"
              placeholder="Write a detailed description..."
              className="w-full border-2 rounded-lg px-5 py-4 focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Price & Stock */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="45000"
                className="w-full border-2 rounded-lg px-5 py-4 focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Stock Quantity</label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="10"
                className="w-full border-2 rounded-lg px-5 py-4 focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border-2 rounded-lg px-5 py-4 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="electric">Electric Guitar</option>
              <option value="acoustic">Acoustic Guitar</option>
              <option value="ukulele">Ukulele</option>
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full border-2 border-dashed rounded-lg px-5 py-8 text-center cursor-pointer hover:border-indigo-500 transition"
            />
            {uploading && <p className="mt-3 text-indigo-600">Uploading image...</p>}
            {form.image && (
              <div className="mt-4">
                <img
                  src={form.image}
                  alt="Preview"
                  className="w-full max-w-md h-80 object-cover rounded-lg shadow"
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 bg-black text-white py-5 rounded-lg text-xl font-bold hover:bg-gray-800 transition disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Add Guitar to Store"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="px-8 py-5 border-2 border-gray-300 rounded-lg font-bold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;