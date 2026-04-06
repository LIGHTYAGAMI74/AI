"use client";

import React, { useEffect, useState } from "react";
import {
  fetchUsers,
  fetchUserAnalytics,
  fetchUserById,
  updateUser,
} from "@/services/admin";

export default function AdminUsersPanel() {
  const [users, setUsers] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    search: "",
    level: "",
    paymentStatus: "",
  });

  const [totalPages, setTotalPages] = useState(1);

  // 🔥 LOAD USERS
  const loadUsers = async () => {
    setLoading(true);

    const data = await fetchUsers(filters);

    setUsers(data.users || []);
    setTotalPages(data.totalPages || 1);

    setLoading(false);
  };

  // 🔥 LOAD ANALYTICS
  const loadAnalytics = async () => {
    const data = await fetchUserAnalytics();
    setAnalytics(data);
  };

  useEffect(() => {
    loadUsers();
  }, [filters]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  // 🔥 USER CLICK
  const openUser = async (id: string) => {
    const data = await fetchUserById(id);
    setSelectedUser(data.user);
  };

  // 🔥 UPDATE USER
  const handleUpdateUser = async (
    field: "level" | "paymentStatus",
    value: string
  ) => {
    if (!selectedUser) return;

    await updateUser(selectedUser._id, { [field]: value });

    setSelectedUser({
      ...selectedUser,
      [field]: value,
    });

    loadUsers();
  };

  return (
    <div className="w-full">

      {/* HEADER */}
      <h2 className="text-4xl font-black mb-8 uppercase italic">
        Users Dashboard
      </h2>

      {/* ANALYTICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 border-4 border-black bg-green-200 font-bold">
          Total: {analytics?.totalUsers || 0}
        </div>
        <div className="p-4 border-4 border-black bg-yellow-200 font-bold">
          Active: {analytics?.activeUsers || 0}
        </div>
        <div className="p-4 border-4 border-black bg-blue-200 font-bold">
          Paid: {analytics?.paidUsers || 0}
        </div>
        <div className="p-4 border-4 border-black bg-pink-200 font-bold">
          Avg Activity: {analytics?.avgActivityDays || 0}
        </div>
      </div>

      {/* FILTERS */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">

        <input
          placeholder="Search name/email..."
          className="border-4 border-black p-3"
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value, page: 1 })
          }
        />

        <select
          className="border-4 border-black p-3"
          onChange={(e) =>
            setFilters({ ...filters, level: e.target.value, page: 1 })
          }
        >
          <option value="">All Levels</option>
          <option value="6-8">6-8</option>
          <option value="9-10">9-10</option>
          <option value="11-12">11-12</option>
        </select>

        <select
          className="border-4 border-black p-3"
          onChange={(e) =>
            setFilters({
              ...filters,
              paymentStatus: e.target.value,
              page: 1,
            })
          }
        >
          <option value="">All Payments</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>

      </div>

      {/* TABLE */}
      <div className="border-4 border-black overflow-x-auto">

        <table className="w-full text-sm md:text-base">
          <thead className="bg-black text-white">
            <tr>
              <th className="p-3">Name</th>
              <th>Email</th>
              <th>Level</th>
              <th>Payment</th>
              <th>Activity</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t-2 border-black">
                <td className="p-3 font-bold">{u.name}</td>
                <td>{u.email}</td>
                <td>{u.level}</td>
                <td>{u.paymentStatus}</td>
                <td>{u.stats?.activityDays || 0}</td>

                <td>
                  <button
                    onClick={() => openUser(u._id)}
                    className="bg-black text-white px-3 py-1"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loading && (
          <div className="p-4 text-center font-bold">
            Loading...
          </div>
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between mt-6">
        <button
          disabled={filters.page === 1}
          onClick={() =>
            setFilters({ ...filters, page: filters.page - 1 })
          }
          className="border-4 border-black px-4 py-2"
        >
          Prev
        </button>

        <span className="font-bold">
          Page {filters.page} / {totalPages}
        </span>

        <button
          disabled={filters.page === totalPages}
          onClick={() =>
            setFilters({ ...filters, page: filters.page + 1 })
          }
          className="border-4 border-black px-4 py-2"
        >
          Next
        </button>
      </div>

      {/* USER DETAIL MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white border-4 border-black p-6 w-full max-w-xl">

            <h3 className="text-2xl font-black mb-4">
              {selectedUser.name}
            </h3>

            <p>Email: {selectedUser.email}</p>
            <p>Activity Days: {selectedUser.stats?.activityDays}</p>

            {/* LEVEL */}
            <div className="mt-4">
              <label className="font-bold">Level</label>
              <select
                value={selectedUser.level}
                onChange={(e) =>
                  handleUpdateUser("level", e.target.value)
                }
                className="border-2 border-black p-2 w-full"
              >
                <option value="6-8">6-8</option>
                <option value="9-10">9-10</option>
                <option value="11-12">11-12</option>
              </select>
            </div>

            {/* PAYMENT */}
            <div className="mt-4">
              <label className="font-bold">Payment</label>
              <select
                value={selectedUser.paymentStatus}
                onChange={(e) =>
                  handleUpdateUser(
                    "paymentStatus",
                    e.target.value
                  )
                }
                className="border-2 border-black p-2 w-full"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <button
              onClick={() => setSelectedUser(null)}
              className="mt-6 bg-black text-white px-6 py-2"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}