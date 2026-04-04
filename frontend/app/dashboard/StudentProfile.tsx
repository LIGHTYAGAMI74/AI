"use client";

import React, { useState, useEffect } from "react";
import { updateProfile } from "@/services/auth";

export default function StudentProfile({ user, setUser }: any) {
  const [form, setForm] = useState<any>({});
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) setForm(user);
  }, [user]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updated = await updateProfile(form);
      setUser(updated);
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const Field = ({ label, name, disabled = false }: any) => (
    <div className="flex flex-col gap-2">
      <label className="font-black uppercase text-sm">{label}</label>
      <input
        name={name}
        value={form[name] || ""}
        onChange={handleChange}
        disabled={!editing || disabled}
        className={`border-4 border-black p-3 font-bold ${
          disabled ? "bg-gray-200" : "bg-white"
        }`}
      />
    </div>
  );

  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div className="border-[6px] border-black p-8 bg-white shadow-[10px_10px_0px_black] flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black italic uppercase">
            Your Profile
          </h2>
          <p className="font-bold mt-2 text-gray-600">
            Manage your account details
          </p>
        </div>

        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="bg-yellow-400 border-4 border-black px-6 py-2 font-black"
          >
            Edit
          </button>
        ) : (
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-green-400 border-4 border-black px-6 py-2 font-black"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        )}
      </div>

      {/* FORM */}
      <div className="grid md:grid-cols-2 gap-6">

        <Field label="Name" name="name" />

        <Field label="Email" name="email" disabled />

        <Field label="Student Phone" name="studentPhone" />
        <Field label="Parent Phone" name="parentPhone" />

        <Field label="Parent Email" name="parentEmail" />

        <Field label="School" name="school" />

        <Field label="City" name="city" />
        <Field label="State" name="state" />

        <Field label="Board" name="board" disabled />
        <Field label="Level" name="level" disabled />

        <Field label="Role" name="role" disabled />
        <Field label="Payment Status" name="paymentStatus" disabled />

      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6">

        <div className="border-[6px] border-black p-6 bg-yellow-400 font-black">
          Tests Completed: {user?.stats?.testHistory?.length || 0}
        </div>

        <div className="border-[6px] border-black p-6 bg-pink-500 text-white font-black">
          Activity Days: {user?.stats?.activityDays || 0}
        </div>

        <div className="border-[6px] border-black p-6 bg-blue-400 font-black">
          Joined: {new Date(user?.createdAt).toLocaleDateString()}
        </div>

      </div>

    </div>
  );
}