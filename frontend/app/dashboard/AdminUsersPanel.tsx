"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  fetchUsers,
  fetchUserAnalytics,
  fetchUserById,
} from "@/services/admin";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type SortDir = "asc" | "desc";
type SortBy =
  | "createdAt"
  | "name"
  | "email"
  | "level"
  | "state"
  | "board"
  | "paymentStatus";

interface ExportRow {
  Name: string;
  Email: string;
  StudentPhone: string;
  ParentPhone: string;
  ParentEmail: string;
  Level: string;
  School: string;
  City: string;
  State: string;
  Board: string;
  PaymentStatus: string;
  CreatedAt: string;
  [key: string]: any;
}

const COLORS = [
  "#111827",
  "#2563eb",
  "#7c3aed",
  "#db2777",
  "#16a34a",
  "#d97706",
  "#0f766e",
  "#dc2626",
];

const toSeries = (
  input?: Record<string, number> | Array<{ name: string; value: number }>
) => {
  if (!input) return [];
  if (Array.isArray(input)) return input;

  return Object.entries(input)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

const countBy = (items: any[], key: string) =>
  items.reduce((acc: Record<string, number>, item) => {
    const raw = item?.[key];
    const value =
      raw === undefined || raw === null || String(raw).trim() === ""
        ? "Unknown"
        : String(raw);
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const escapeCsv = (value: any) => {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
};

export default function AdminUsersPanel() {
  const [users, setUsers] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState<"csv" | "excel" | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [totalPages, setTotalPages] = useState(1);

  const [searchInput, setSearchInput] = useState("");

  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    search: "",
    level: "",
    paymentStatus: "",
    state: "",
    board: "",
    sortBy: "createdAt" as SortBy,
    sortDir: "desc" as SortDir,
  });

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers(filters);
      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    const data = await fetchUserAnalytics();
    setAnalytics(data);
  };

  useEffect(() => {
    const t = setTimeout(() => {
      setFilters((p) => ({ ...p, search: searchInput, page: 1 }));
    }, 350);

    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    loadUsers();
  }, [filters]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedUser(null);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  const openUser = async (id: string) => {
    const data = await fetchUserById(id);
    setSelectedUser(data.user || data);
  };

  const currentPageInsights = useMemo(() => {
    const stateCounts = countBy(users, "state");
    const boardCounts = countBy(users, "board");
    const levelCounts = countBy(users, "level");

    const topEntry = (obj: Record<string, number>) =>
      Object.entries(obj).sort((a, b) => b[1] - a[1])[0];

    const topState = topEntry(stateCounts);
    const topBoard = topEntry(boardCounts);
    const topLevel = topEntry(levelCounts);

    return {
      total: users.length,
      uniqueStates: Object.keys(stateCounts).length,
      uniqueBoards: Object.keys(boardCounts).length,
      uniqueLevels: Object.keys(levelCounts).length,
      topState: topState ? topState[0] : "—",
      topBoard: topBoard ? topBoard[0] : "—",
      topLevel: topLevel ? topLevel[0] : "—",
    };
  }, [users]);

  const levelChartData = useMemo(() => {
    const source =
      analytics?.levelCounts && Object.keys(analytics.levelCounts).length > 0
        ? analytics.levelCounts
        : countBy(users, "level");

    const preferredOrder = ["6-8", "9-10", "11-12"];
    const series = toSeries(source).sort((a, b) => {
      const ai = preferredOrder.indexOf(a.name);
      const bi = preferredOrder.indexOf(b.name);
      if (ai !== -1 || bi !== -1) {
        return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
      }
      return b.value - a.value;
    });

    return series;
  }, [analytics, users]);

  const stateChartData = useMemo(() => {
    const source =
      analytics?.stateCounts && Object.keys(analytics.stateCounts).length > 0
        ? analytics.stateCounts
        : countBy(users, "state");

    return toSeries(source).slice(0, 10);
  }, [analytics, users]);

  const boardChartData = useMemo(() => {
    const source =
      analytics?.boardCounts && Object.keys(analytics.boardCounts).length > 0
        ? analytics.boardCounts
        : countBy(users, "board");

    return toSeries(source).slice(0, 8);
  }, [analytics, users]);

  const paymentPieData = useMemo(() => {
    const source =
      analytics?.paymentCounts &&
      Object.keys(analytics.paymentCounts).length > 0
        ? analytics.paymentCounts
        : countBy(users, "paymentStatus");

    return toSeries(source);
  }, [analytics, users]);

  const exportData = async (): Promise<ExportRow[]> => {
    const data = await fetchUsers({
      ...filters,
      page: 1,
      limit: 10000,
    });

    const list = data.users || [];

    return list.map((u: any) => ({
      Name: u.name || "",
      Email: u.email || "",
      StudentPhone: u.studentPhone || "",
      ParentPhone: u.parentPhone || "",
      ParentEmail: u.parentEmail || "",
      Level: u.level || "",
      School: u.school || "",
      City: u.city || "",
      State: u.state || "",
      Board: u.board || "",
      PaymentStatus: u.paymentStatus || "",
      CreatedAt: u.createdAt ? new Date(u.createdAt).toLocaleString() : "",
    }));
  };

  const exportCSV = async () => {
    setExporting("csv");
    try {
      const data = await exportData();
      if (!data.length) return;

      const headers = [
        "Name",
        "Email",
        "StudentPhone",
        "ParentPhone",
        "ParentEmail",
        "Level",
        "School",
        "City",
        "State",
        "Board",
        "PaymentStatus",
        "CreatedAt",
      ];

      const csv = [
        headers.join(","),
        ...data.map((row) => headers.map((h) => escapeCsv(row[h])).join(",")),
      ].join("\n");

      downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8;" }), "users.csv");
    } finally {
      setExporting(null);
    }
  };

  const exportExcel = async () => {
    setExporting("excel");
    try {
      const data = await exportData();
      if (!data.length) return;

      const headers = [
        "Name",
        "Email",
        "StudentPhone",
        "ParentPhone",
        "ParentEmail",
        "Level",
        "School",
        "City",
        "State",
        "Board",
        "PaymentStatus",
        "CreatedAt",
      ];

      const tsv = [
        headers.join("\t"),
        ...data.map((row) => headers.map((h) => row[h] ?? "").join("\t")),
      ].join("\n");

      downloadBlob(
        new Blob([tsv], { type: "application/vnd.ms-excel;charset=utf-8;" }),
        "users.xls"
      );
    } finally {
      setExporting(null);
    }
  };

  const resetFilters = () => {
    setSearchInput("");
    setFilters({
      page: 1,
      limit: 20,
      search: "",
      level: "",
      paymentStatus: "",
      state: "",
      board: "",
      sortBy: "createdAt",
      sortDir: "desc",
    });
  };

  const stateOptions = useMemo(() => {
    const fromAnalytics = toSeries(analytics?.stateCounts).map((x) => x.name);
    const fromUsers = Object.keys(countBy(users, "state"));
    return Array.from(new Set([...fromAnalytics, ...fromUsers])).sort();
  }, [analytics, users]);

  const boardOptions = useMemo(() => {
    const fromAnalytics = toSeries(analytics?.boardCounts).map((x) => x.name);
    const fromUsers = Object.keys(countBy(users, "board"));
    return Array.from(new Set([...fromAnalytics, ...fromUsers])).sort();
  }, [analytics, users]);

  return (
    <div className="w-full space-y-8">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-3xl border-4 border-black bg-gradient-to-r from-[#fffbeb] via-white to-[#f5f3ff] p-6 md:p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.35em] text-gray-500">
              Admin Intelligence
            </p>
            <h2 className="mt-2 text-4xl md:text-6xl font-black italic tracking-tight">
              Users Dashboard
            </h2>
            <p className="mt-3 max-w-3xl text-sm md:text-base font-semibold text-gray-700">
              Track participation, compare states, slice by level, and export the exact filtered set you need.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            <div className="rounded-2xl border-2 border-black bg-white/90 px-4 py-3 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-[11px] font-black uppercase text-gray-500">Current View</p>
              <p className="text-xl font-black">{currentPageInsights.total}</p>
            </div>
            <div className="rounded-2xl border-2 border-black bg-white/90 px-4 py-3 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-[11px] font-black uppercase text-gray-500">States</p>
              <p className="text-xl font-black">{currentPageInsights.uniqueStates}</p>
            </div>
            <div className="rounded-2xl border-2 border-black bg-white/90 px-4 py-3 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] md:col-span-1 col-span-2">
              <p className="text-[11px] font-black uppercase text-gray-500">Top State</p>
              <p className="text-xl font-black">{currentPageInsights.topState}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ANALYTICS CARDS */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 xl:grid-cols-6">
        {[
          {
            label: "Total Users",
            value: analytics?.totalUsers ?? 0,
            tone: "bg-green-200",
          },
          {
            label: "Active Users",
            value: analytics?.activeUsers ?? 0,
            tone: "bg-yellow-200",
          },
          {
            label: "Paid Users",
            value: analytics?.paidUsers ?? 0,
            tone: "bg-blue-200",
          },
          {
            label: "Pending",
            value: analytics?.pendingUsers ?? 0,
            tone: "bg-pink-200",
          },
          {
            label: "States",
            value: analytics?.stateCount ?? currentPageInsights.uniqueStates ?? 0,
            tone: "bg-purple-200",
          },
          {
            label: "Avg Activity",
            value: Number(analytics?.avgActivityDays ?? 0).toFixed(1),
            tone: "bg-orange-200",
          },
        ].map((card, index) => (
          <div
            key={index}
            className={`rounded-2xl border-4 border-black ${card.tone} p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]`}
          >
            <p className="text-[11px] font-black uppercase tracking-[0.2em]">
              {card.label}
            </p>
            <p className="mt-2 text-2xl font-black">{card.value}</p>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border-4 border-black bg-white p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="mb-3">
            <h3 className="text-lg font-black">Level Distribution</h3>
            <p className="text-sm font-semibold text-gray-600">
              Participation across 6–8, 9–10, and 11–12.
            </p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={levelChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {levelChartData.map((entry, index) => (
                    <Cell key={`level-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border-4 border-black bg-white p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="mb-3">
            <h3 className="text-lg font-black">Payment Split</h3>
            <p className="text-sm font-semibold text-gray-600">
              Pending vs completed users.
            </p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentPieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={105}
                  paddingAngle={3}
                >
                  {paymentPieData.map((entry, index) => (
                    <Cell key={`payment-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border-4 border-black bg-white p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="mb-3">
            <h3 className="text-lg font-black">Top States</h3>
            <p className="text-sm font-semibold text-gray-600">
              Most represented states in the competition.
            </p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="name" type="category" width={90} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {stateChartData.map((entry, index) => (
                    <Cell key={`state-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SECONDARY TREND SECTION */}
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border-4 border-black bg-white p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] xl:col-span-2">
          <div className="mb-3">
            <h3 className="text-lg font-black">Boards Overview</h3>
            <p className="text-sm font-semibold text-gray-600">
              Board-wise distribution for quick academic segmentation.
            </p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={boardChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#111827" />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {boardChartData.map((entry, index) => (
                    <Cell key={`board-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border-4 border-black bg-[#fffbeb] p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-lg font-black">Current Filter Snapshot</h3>
          <div className="mt-4 space-y-3 text-sm font-semibold">
            <div className="rounded-2xl border-2 border-black bg-white p-3">
              Top State: <span className="font-black">{currentPageInsights.topState}</span>
            </div>
            <div className="rounded-2xl border-2 border-black bg-white p-3">
              Top Board: <span className="font-black">{currentPageInsights.topBoard}</span>
            </div>
            <div className="rounded-2xl border-2 border-black bg-white p-3">
              Top Level: <span className="font-black">{currentPageInsights.topLevel}</span>
            </div>
            <div className="rounded-2xl border-2 border-black bg-white p-3">
              Unique Boards: <span className="font-black">{currentPageInsights.uniqueBoards}</span>
            </div>
          </div>
        </div>
      </div>

      {/* FILTERS + EXPORTS */}
      <div className="rounded-3xl border-4 border-black bg-white p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-black">Filters & Sorting</h3>
            <p className="text-sm font-semibold text-gray-600">
              Narrow down the table, then export exactly what you see.
            </p>
          </div>
          <button
            onClick={resetFilters}
            className="rounded-xl border-2 border-black bg-[#fffbeb] px-4 py-2 text-sm font-black transition hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            Reset Filters
          </button>
        </div>

        <div className="grid gap-3 lg:grid-cols-6">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search name / email / phone..."
            className="rounded-xl border-2 border-black p-3 font-semibold outline-none transition focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          />

          <select
            value={filters.level}
            onChange={(e) =>
              setFilters((p) => ({ ...p, level: e.target.value, page: 1 }))
            }
            className="rounded-xl border-2 border-black p-3 font-semibold"
          >
            <option value="">All Levels</option>
            <option value="6-8">6-8</option>
            <option value="9-10">9-10</option>
            <option value="11-12">11-12</option>
          </select>

          <select
            value={filters.paymentStatus}
            onChange={(e) =>
              setFilters((p) => ({
                ...p,
                paymentStatus: e.target.value,
                page: 1,
              }))
            }
            className="rounded-xl border-2 border-black p-3 font-semibold"
          >
            <option value="">All Payments</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={filters.state}
            onChange={(e) =>
              setFilters((p) => ({ ...p, state: e.target.value, page: 1 }))
            }
            className="rounded-xl border-2 border-black p-3 font-semibold"
          >
            <option value="">All States</option>
            {stateOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={filters.board}
            onChange={(e) =>
              setFilters((p) => ({ ...p, board: e.target.value, page: 1 }))
            }
            className="rounded-xl border-2 border-black p-3 font-semibold"
          >
            <option value="">All Boards</option>
            {boardOptions.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          <select
            value={`${filters.sortBy}:${filters.sortDir}`}
            onChange={(e) => {
              const [sortBy, sortDir] = e.target.value.split(":");
              setFilters((p) => ({
                ...p,
                sortBy: sortBy as SortBy,
                sortDir: sortDir as SortDir,
                page: 1,
              }));
            }}
            className="rounded-xl border-2 border-black p-3 font-semibold"
          >
            <option value="createdAt:desc">Newest first</option>
            <option value="createdAt:asc">Oldest first</option>
            <option value="name:asc">Name A → Z</option>
            <option value="name:desc">Name Z → A</option>
            <option value="email:asc">Email A → Z</option>
            <option value="level:asc">Level low → high</option>
            <option value="state:asc">State A → Z</option>
            <option value="board:asc">Board A → Z</option>
            <option value="paymentStatus:asc">Payment status</option>
          </select>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={exportCSV}
            disabled={exporting !== null}
            className="rounded-xl border-2 border-black bg-green-300 px-5 py-2 text-sm font-black transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {exporting === "csv" ? "Exporting..." : "Export CSV"}
          </button>

          <button
            onClick={exportExcel}
            disabled={exporting !== null}
            className="rounded-xl border-2 border-black bg-blue-300 px-5 py-2 text-sm font-black transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {exporting === "excel" ? "Exporting..." : "Export Excel"}
          </button>

          <div className="ml-auto rounded-xl border-2 border-dashed border-gray-400 px-4 py-2 text-sm font-semibold text-gray-600">
            Showing page <span className="font-black">{filters.page}</span> of{" "}
            <span className="font-black">{totalPages}</span>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-3xl border-4 border-black bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center justify-between border-b-4 border-black bg-black px-5 py-4 text-white">
          <div>
            <h3 className="text-lg font-black">User Records</h3>
            <p className="text-xs font-semibold text-white/70">
              Click any user to open the contact + profile view.
            </p>
          </div>
          <div className="text-sm font-black">
            {loading ? "Loading..." : `${users.length} records`}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-[#fffbeb] text-left">
              <tr className="border-b-2 border-black">
                <th className="p-4 text-xs font-black uppercase tracking-[0.2em]">Name</th>
                <th className="p-4 text-xs font-black uppercase tracking-[0.2em]">Email</th>
                <th className="p-4 text-xs font-black uppercase tracking-[0.2em]">Student Phone</th>
                <th className="p-4 text-xs font-black uppercase tracking-[0.2em]">Parent Phone</th>
                <th className="p-4 text-xs font-black uppercase tracking-[0.2em]">Parent Email</th>
                <th className="p-4 text-xs font-black uppercase tracking-[0.2em]">Level</th>
                <th className="p-4 text-xs font-black uppercase tracking-[0.2em]">School</th>
                <th className="p-4 text-xs font-black uppercase tracking-[0.2em]">City</th>
                <th className="p-4 text-xs font-black uppercase tracking-[0.2em]">State</th>
                <th className="p-4 text-xs font-black uppercase tracking-[0.2em]">Board</th>
                <th className="p-4 text-xs font-black uppercase tracking-[0.2em]">Payment</th>
                <th className="p-4 text-xs font-black uppercase tracking-[0.2em]">Joined</th>
                <th className="p-4 text-xs font-black uppercase tracking-[0.2em]"></th>
              </tr>
            </thead>

            <tbody>
              {!loading && users.length === 0 && (
                <tr>
                  <td colSpan={13} className="p-10 text-center font-semibold text-gray-500">
                    No users found for the selected filters.
                  </td>
                </tr>
              )}

              {users.map((u, idx) => (
                <tr
                  key={u._id}
                  className={`border-t border-black/10 transition hover:bg-gray-50 ${
                    idx % 2 === 0 ? "bg-white" : "bg-[#fafafa]"
                  }`}
                >
                  <td className="p-4 font-black">{u.name || "-"}</td>
                  <td className="p-4">{u.email || "-"}</td>
                  <td className="p-4">{u.studentPhone || "-"}</td>
                  <td className="p-4">{u.parentPhone || "-"}</td>
                  <td className="p-4">{u.parentEmail || "-"}</td>
                  <td className="p-4">{u.level || "-"}</td>
                  <td className="p-4">{u.school || "-"}</td>
                  <td className="p-4">{u.city || "-"}</td>
                  <td className="p-4">{u.state || "-"}</td>
                  <td className="p-4">{u.board || "-"}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex rounded-full border-2 border-black px-3 py-1 text-xs font-black uppercase ${
                        u.paymentStatus === "completed"
                          ? "bg-green-200"
                          : "bg-yellow-200"
                      }`}
                    >
                      {u.paymentStatus || "pending"}
                    </span>
                  </td>
                  <td className="p-4 text-sm">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => openUser(u._id)}
                      className="rounded-xl border-2 border-black bg-black px-4 py-2 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white hover:text-black"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {loading && (
          <div className="p-6 text-center text-sm font-black uppercase tracking-[0.2em] text-gray-500">
            Loading users...
          </div>
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between gap-4 rounded-3xl border-4 border-black bg-white px-5 py-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <button
          disabled={filters.page === 1}
          onClick={() => setFilters((p) => ({ ...p, page: Math.max(1, p.page - 1) }))}
          className="rounded-xl border-2 border-black px-5 py-2 font-black transition hover:bg-[#fffbeb] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Prev
        </button>

        <div className="text-sm font-semibold text-gray-600">
          Page <span className="font-black text-black">{filters.page}</span> of{" "}
          <span className="font-black text-black">{totalPages}</span>
        </div>

        <button
          disabled={filters.page === totalPages}
          onClick={() =>
            setFilters((p) => ({ ...p, page: Math.min(totalPages, p.page + 1) }))
          }
          className="rounded-xl border-2 border-black px-5 py-2 font-black transition hover:bg-[#fffbeb] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>

      {/* MODAL */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="w-full max-w-3xl rounded-3xl border-4 border-black bg-white p-6 md:p-8 shadow-[14px_14px_0px_0px_rgba(0,0,0,1)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.35em] text-gray-500">
                  User profile
                </p>
                <h3 className="mt-1 text-3xl font-black">{selectedUser.name || "-"}</h3>
                <p className="mt-1 text-sm font-semibold text-gray-600">
                  Full contact + academic profile. No stats or progress shown here.
                </p>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className="rounded-xl border-2 border-black bg-black px-4 py-2 text-sm font-black text-white transition hover:bg-white hover:text-black"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                ["Email", selectedUser.email],
                ["Student Phone", selectedUser.studentPhone],
                ["Parent Phone", selectedUser.parentPhone],
                ["Parent Email", selectedUser.parentEmail],
                ["Level", selectedUser.level],
                ["School", selectedUser.school],
                ["City", selectedUser.city],
                ["State", selectedUser.state],
                ["Board", selectedUser.board],
                ["Payment", selectedUser.paymentStatus],
                ["Created At", selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : "-"],
                ["Role", selectedUser.role],
              ].map(([label, value]) => (
                <div key={String(label)} className="rounded-2xl border-2 border-black bg-[#fffbeb] p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">
                    {label}
                  </p>
                  <p className="mt-1 break-words text-sm font-bold text-black">
                    {String(value || "-")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}