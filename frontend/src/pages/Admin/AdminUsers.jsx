import React, { useEffect, useState } from "react";
import api from "../../services/api.js";
import { useToast } from "../../components/Toast.jsx";
import useAuthStore from "../../state/authStore.js";

const AdminUsers = () => {
  const { addToast } = useToast();
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/users");
      setUsers(data.data || []);
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Permanently delete this user? This cannot be undone.")) return;
    try {
      await api.delete(`/users/${id}`);
      addToast("User deleted successfully", "success");
      fetchUsers();
    } catch (err) {
      addToast(err.response?.data?.message || "Delete failed", "error");
    }
  };

  const toggleRole = async (id, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    if (!window.confirm(`Make this user ${newRole.toUpperCase()}?`)) return;
    try {
      await api.put(`/users/${id}/role`, { role: newRole });
      addToast(`User is now ${newRole.toUpperCase()}`, "success");
      fetchUsers();
    } catch (err) {
      addToast(err.response?.data?.message || "Role update failed", "error");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <div className="text-center py-20"><p className="text-xl text-gray-600">Loading users...</p></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Total: {users.length} registered users</p>
        </div>
        <button onClick={fetchUsers} className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition font-medium">
          Refresh
        </button>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow">
          <p className="text-2xl text-gray-600 mb-2">No users yet</p>
          <p className="text-gray-500">Registered customers will appear here</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">User</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Joined</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold shrink-0">
                          {u.name?.[0]?.toUpperCase() || "?"}
                        </div>
                        <span className="text-sm font-medium">{u.name || "Unknown"}</span>
                        {u._id === currentUser?._id && (
                          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">You</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        u.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"
                      }`}>
                        {u.role?.toUpperCase() || "USER"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {/* Don't allow changing own role */}
                        {u._id !== currentUser?._id && (
                          <button
                            onClick={() => toggleRole(u._id, u.role)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition text-white ${
                              u.role === "admin"
                                ? "bg-orange-500 hover:bg-orange-600"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                          >
                            {u.role === "admin" ? "Remove Admin" : "Make Admin"}
                          </button>
                        )}
                        {/* Don't allow deleting yourself */}
                        {u._id !== currentUser?._id && (
                          <button
                            onClick={() => deleteUser(u._id)}
                            className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-600 transition"
                          >
                            Delete
                          </button>
                        )}
                      </div>
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