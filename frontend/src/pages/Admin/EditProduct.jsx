import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import useAuthStore from "../../state/authStore";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthStore();

  const [loading, setLoading] = useState(true);

  const [product, setProduct] = useState({
    name: "",
    price: "",
    quantity: "",
    description: "",
    images: [],
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/admin/products/${id}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setProduct(res.data);
        setPreview(res.data.images?.[0] || "");
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProduct();
  }, [id, token]);

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const updateProduct = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = product.images?.[0]?.url || "";

      // Upload image if a new one is selected
      if (product.image) {
        const imgData = new FormData();
        imgData.append("images", product.image);

        const uploadRes = await axios.post(
          "http://localhost:5000/api/upload",
          imgData,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        imageUrl = uploadRes.data.urls[0];
      }

      await axios.put(
        `http://localhost:5000/api/admin/products/${id}`,
        {
          name: product.name,
          price: product.price,
          quantity: product.quantity,
          description: product.description,
          imageUrl: imageUrl,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      alert("Product updated successfully");
      navigate("/admin/products");
    } catch (error) {
      console.error(error);
      alert("Update failed");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading product...</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>

      <form onSubmit={updateProduct} className="space-y-5">
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-40 h-40 object-cover rounded"
          />
        )}

        <input type="file" onChange={handleImage} />

        <input
          className="w-full border p-3 rounded"
          name="name"
          value={product.name}
          onChange={handleChange}
          placeholder="Product Name"
        />

        <input
          className="w-full border p-3 rounded"
          name="price"
          value={product.price}
          onChange={handleChange}
          placeholder="Price"
        />

        <input
          className="w-full border p-3 rounded"
          name="quantity"
          value={product.quantity}
          onChange={handleChange}
          placeholder="Quantity"
        />

        <textarea
          className="w-full border p-3 rounded"
          rows="4"
          name="description"
          value={product.description}
          onChange={handleChange}
          placeholder="Description"
        />

        <button className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700">
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
