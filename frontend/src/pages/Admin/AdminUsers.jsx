import React, { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "../../components/Toast.jsx";

const AdminUsers = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/users/admin", {
        withCredentials: true,
      });
      setUsers(data.data || data);
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Permanently delete this user? This cannot be undone.")) return;

    try {
      await axios.delete(`/api/users/admin/${id}`, {
        withCredentials: true,
      });
      showToast("User deleted successfully", "success");
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.error || "Delete failed", "error");
    }
  };

  const toggleAdmin = async (id, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    if (!window.confirm(`Make this user ${newRole.toUpperCase()}?`)) return;

    try {
      await axios.put(
        `/api/users/admin/${id}/role`,
        { role: newRole },
        { withCredentials: true }
      );
      showToast(`User is now ${newRole.toUpperCase()}`, "success");
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.error || "Role update failed", "error");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-gray-600">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Total: {users.length} registered users</p>
        </div>
        <button
          onClick={fetchUsers}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
        >
          Refresh Users
        </button>
      </div>

      {/* Empty State */}
      {users.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow">
          <p className="text-2xl text-gray-600 mb-4">No users yet</p>
          <p className="text-gray-500">New customers will appear here when they register</p>
        </div>
      ) : (
        /* Users Table */
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Joined</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium">{u.name || "Guest"}</td>
                    <td className="px-6 py-4 text-sm">{u.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          u.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {u.role?.toUpperCase() || "USER"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 space-x-3">
                      {/* Toggle Admin Role */}
                      <button
                        onClick={() => toggleAdmin(u._id, u.role)}
                        className={`px-4 py-2 rounded text-sm font-medium transition ${
                          u.role === "admin"
                            ? "bg-orange-600 text-white hover:bg-orange-700"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {u.role === "admin" ? "Remove Admin" : "Make Admin"}
                      </button>

                      {/* Delete User (except yourself) */}
                      {u.email !== "admin@stringcraft.com" && (
                        <button
                          onClick={() => deleteUser(u._id)}
                          className="bg-red-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;