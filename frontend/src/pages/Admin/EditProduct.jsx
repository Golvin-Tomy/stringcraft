import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import useAuthStore from "../../state/authStore";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "electric",
    brand: "",
    stock: "",
    images: [],
    featured: false,
  });

  const [preview, setPreview] = useState("");

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);

        setForm({
          name: data.name || "",
          description: data.description || "",
          price: data.price || "",
          category: data.category || "electric",
          brand: data.brand || "",
          stock: data.stock || "",
          images: data.images || [],
          featured: data.featured || false,
        });
        setPreview(data.images?.[0]?.url || "");
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProduct();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("images", file);

    setUploading(true);
    try {
      const { data } = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm((prev) => ({ ...prev, images: [{ url: data.urls[0] }] }));
      setPreview(data.urls[0]);
    } catch (err) {
      console.error("Upload error:", err.response?.data);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/products/${id}`, {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        brand: form.brand,
        stock: Number(form.stock),
        images: form.images,
        featured: form.featured,
      });

      alert("Product updated successfully");
      navigate("/admin/products");
    } catch (error) {
      console.error("SERVER MESSAGE:", error.response?.data);
      alert(error.response?.data?.message || "Update failed");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading product...</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Edit Guitar</h1>
          <p className="text-gray-600 mt-2">
            Update the details of this product
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 space-y-8"
        >
          {/* Name & Brand */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Guitar Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Fender Player Stratocaster"
                className="w-full border-2 rounded-lg px-5 py-4 focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Brand
              </label>
              <select
                name="brand"
                value={form.brand}
                onChange={handleChange}
                className="w-full border-2 rounded-lg px-5 py-4 focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select a brand</option>
                {[
                  "Fender",
                  "Gibson",
                  "Yamaha",
                  "Ibanez",
                  "Kadence",
                  "Kala",
                  "Taylor",
                  "Martin",
                ].map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Description
            </label>
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
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="w-full border-2 rounded-lg px-5 py-4 focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Stock Quantity
              </label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                className="w-full border-2 rounded-lg px-5 py-4 focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Category
            </label>
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

          {/* Featured Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="featured"
              id="featured"
              checked={form.featured}
              onChange={handleChange}
              className="w-5 h-5 accent-indigo-600 cursor-pointer"
            />
            <label
              htmlFor="featured"
              className="text-lg font-medium text-gray-700 cursor-pointer"
            >
              Mark as Featured
            </label>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Product Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full border-2 border-dashed rounded-lg px-5 py-8 text-center cursor-pointer hover:border-indigo-500 transition"
            />
            {uploading && (
              <p className="mt-3 text-indigo-600">Uploading image...</p>
            )}
            {preview && (
              <div className="mt-4">
                <img
                  src={preview}
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
              {uploading ? "Uploading..." : "Update Guitar"}
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

export default EditProduct;
