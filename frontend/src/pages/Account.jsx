import React, { useEffect, useState } from "react";
import useAuthStore from "../state/authStore.js";
import { useToast } from "../components/Toast.jsx";
import api from "../services/api.js";
import {
  UserCircleIcon,
  KeyIcon,
  ShoppingBagIcon,
  PencilSquareIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

const TABS = [
  { id: "profile", label: "Profile", icon: UserCircleIcon },
  { id: "password", label: "Password", icon: KeyIcon },
  { id: "orders", label: "Orders", icon: ShoppingBagIcon },
];

const Account = () => {
  const { user, updateUser } = useAuthStore();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  // Sync profile form when user loads
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleProfileChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const handlePasswordChange = (e) =>
    setPasswords({ ...passwords, [e.target.name]: e.target.value });

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    try {
      const { data } = await api.put("/auth/profile", profile);
      updateUser({ ...user, name: data.name, email: data.email });
      addToast("Profile updated successfully", "success");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to update profile", "error");
    } finally {
      setLoadingProfile(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      addToast("Passwords do not match", "error");
      return;
    }
    if (passwords.newPassword.length < 6) {
      addToast("Password must be at least 6 characters", "error");
      return;
    }
    setLoadingPassword(true);
    try {
      await api.put("/auth/change-password", {
        currentPassword: passwords.current,
        newPassword: passwords.newPassword,
      });
      addToast("Password changed successfully", "success");
      setPasswords({ current: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to change password", "error");
    } finally {
      setLoadingPassword(false);
    }
  };

  const getInitials = (name) =>
    name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "?";

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">

        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold shrink-0">
            {getInitials(user?.name)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user?.name || "My Account"}</h1>
            <p className="text-gray-500 text-sm mt-0.5">{user?.email}</p>
            {user?.role === "admin" && (
              <span className="mt-1 inline-block text-xs font-semibold bg-black text-white px-2 py-0.5 rounded-full">
                Admin
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-6 flex-col md:flex-row">
          {/* Sidebar Tabs */}
          <aside className="md:w-52 shrink-0">
            <nav className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-5 py-4 text-sm font-medium transition border-l-2 ${
                      activeTab === tab.id
                        ? "border-black bg-gray-50 text-black"
                        : "border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <PencilSquareIcon className="w-5 h-5 text-gray-700" />
                  <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                </div>
                <form onSubmit={updateProfile} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleProfileChange}
                      placeholder="Your full name"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      placeholder="your@email.com"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      value={profile.phone}
                      onChange={handleProfileChange}
                      placeholder="+91 00000 00000"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                    />
                  </div>
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loadingProfile}
                      className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gray-800 transition disabled:opacity-50"
                    >
                      {saved ? (
                        <><CheckIcon className="w-4 h-4" /> Saved!</>
                      ) : loadingProfile ? (
                        "Saving..."
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === "password" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <KeyIcon className="w-5 h-5 text-gray-700" />
                  <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
                </div>
                <form onSubmit={changePassword} className="space-y-5 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <input
                      type="password"
                      name="current"
                      value={passwords.current}
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwords.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Min. 6 characters"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwords.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Repeat new password"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                      required
                    />
                  </div>

                  {/* Password strength hint */}
                  {passwords.newPassword && (
                    <div className="flex gap-1">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            passwords.newPassword.length > i * 3
                              ? passwords.newPassword.length < 6
                                ? "bg-red-400"
                                : passwords.newPassword.length < 10
                                ? "bg-yellow-400"
                                : "bg-green-400"
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loadingPassword}
                      className="bg-black text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gray-800 transition disabled:opacity-50"
                    >
                      {loadingPassword ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <ShoppingBagIcon className="w-5 h-5 text-gray-700" />
                  <h2 className="text-lg font-semibold text-gray-900">Order History</h2>
                </div>
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <ShoppingBagIcon className="w-12 h-12 text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium">No orders yet</p>
                  <p className="text-gray-400 text-sm mt-1">Your orders will appear here once you make a purchase.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;