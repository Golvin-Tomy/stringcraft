import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx"; // or Zustand store
import { useToast } from "../components/Toast.jsx";

const Account = () => {
  const { user, setUser } = useAuth();
  const { showToast } = useToast();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [orders, setOrders] = useState([]);
  const [passwords, setPasswords] = useState({
    current: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  useEffect(() => {
    const loadUserFromCookie = async () => {
      if (!user && document.cookie.includes("jwt")) {
        try {
          const { data } = await axios.get(
            "http://localhost:5000/api/users/profile",
            {
              withCredentials: true,
            }
          );

          setUser(data.data || data);

          setProfile({
            name: data.data?.name || data.name || "",
            email: data.data?.email || data.email || "",
            phone: data.data?.phone || data.phone || "",
          });
        } catch (err) {
          console.log("No valid session");
        }
      }
    };

    loadUserFromCookie();
  }, [user, setUser]);

  const handleProfileChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) =>
    setPasswords({ ...passwords, [e.target.name]: e.target.value });

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    try {
      const { data } = await axios.put("/api/users/profile", profile);
      setUser(data.data);
      showToast("Profile updated successfully", "success");
    } catch (err) {
      showToast(
        err.response?.data?.error || "Failed to update profile",
        "error"
      );
    } finally {
      setLoadingProfile(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }
    setLoadingPassword(true);
    try {
      await axios.put("/api/users/change-password", {
        currentPassword: passwords.current,
        newPassword: passwords.newPassword,
      });
      showToast("Password changed successfully", "success");
      setPasswords({ current: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      showToast(
        err.response?.data?.error || "Failed to change password",
        "error"
      );
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto py-10">
      
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Profile</h2>
        <form className="space-y-4" onSubmit={updateProfile}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={profile.name}
            onChange={handleProfileChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={profile.email}
            onChange={handleProfileChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={profile.phone}
            onChange={handleProfileChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={loadingProfile}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loadingProfile ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        <form className="space-y-4" onSubmit={changePassword}>
          <input
            type="password"
            name="current"
            placeholder="Current Password"
            value={passwords.current}
            onChange={handlePasswordChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={passwords.newPassword}
            onChange={handlePasswordChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={passwords.confirmPassword}
            onChange={handlePasswordChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={loadingPassword}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loadingPassword ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>

      {/* Order History */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Order History</h2>
        {orders.length === 0 ? (
          <p className="text-gray-500">You have not placed any orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2 text-left">Order ID</th>
                  <th className="border px-4 py-2 text-left">Date</th>
                  <th className="border px-4 py-2 text-left">Total</th>
                  <th className="border px-4 py-2 text-left">Paid</th>
                  <th className="border px-4 py-2 text-left">Delivered</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{o._id.slice(-6)}</td>
                    <td className="border px-4 py-2">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td className="border px-4 py-2">
                      ${o.totalPrice.toFixed(2)}
                    </td>
                    <td className="border px-4 py-2">
                      {o.isPaid ? "Yes" : "No"}
                    </td>
                    <td className="border px-4 py-2">
                      {o.isDelivered ? "Yes" : "No"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
