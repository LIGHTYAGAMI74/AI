"use client";

import React, { useEffect, useMemo, useState } from "react";
import { updateProfile } from "@/services/auth";
import {
  BadgeCheck,
  CalendarDays,
  Edit3,
  Mail,
  Phone,
  School,
  MapPin,
  Save,
  User,
  Users,
  X,
  Award,
  Activity,
  KeyRound,
  LogOut,
  ShieldAlert,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type UserStats = {
  activityDays?: number;
  testHistory?: any[];
};

type UserProfile = {
  _id?: string;
  name?: string;
  email?: string;
  studentPhone?: string;
  parentPhone?: string;
  parentEmail?: string;
  level?: string;
  school?: string;
  city?: string;
  state?: string;
  board?: string;
  role?: string;
  paymentStatus?: "pending" | "completed";
  createdAt?: string;
  stats?: UserStats;
};

type Props = {
  user: UserProfile | null;
  setUser: (user: UserProfile) => void;
};

type EditableFieldName =
  | "name"
  | "studentPhone"
  | "parentPhone"
  | "parentEmail"
  | "school"
  | "city"
  | "state";

type FormState = Record<
  EditableFieldName | "email" | "level" | "board" | "role" | "paymentStatus",
  string
>;

const getInitialForm = (user: UserProfile | null): FormState => ({
  name: user?.name ?? "",
  email: user?.email ?? "",
  studentPhone: user?.studentPhone ?? "",
  parentPhone: user?.parentPhone ?? "",
  parentEmail: user?.parentEmail ?? "",
  level: user?.level ?? "",
  school: user?.school ?? "",
  city: user?.city ?? "",
  state: user?.state ?? "",
  board: user?.board ?? "",
  role: user?.role ?? "",
  paymentStatus: user?.paymentStatus ?? "",
});

type FieldProps = {
  label: string;
  name: keyof FormState;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  readOnly?: boolean;
  icon?: React.ReactNode;
  placeholder?: string;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
};

function ProfileField({
  label,
  name,
  value,
  onChange,
  disabled = false,
  readOnly = false,
  icon,
  placeholder,
  type = "text",
  inputMode,
}: FieldProps) {
  const isLocked = disabled || readOnly;

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-[11px] md:text-xs font-black uppercase tracking-[0.18em] text-black/70">
        {icon}
        {label}
      </label>

      <input
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        readOnly={readOnly}
        type={type}
        inputMode={inputMode}
        placeholder={placeholder}
        autoComplete="off"
        className={[
          "w-full border-[4px] border-black px-4 py-3 md:px-5 md:py-4",
          "text-sm md:text-base font-bold outline-none transition-all",
          "shadow-[4px_4px_0px_black] focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-none",
          isLocked
            ? "bg-gray-200 text-gray-700 cursor-not-allowed"
            : "bg-white text-black focus:bg-yellow-50",
        ].join(" ")}
      />
    </div>
  );
}

export default function StudentProfile({ user, setUser }: Props) {
  const { logout } = useAuth();
  const [form, setForm] = useState<FormState>(() => getInitialForm(user));
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const testsCompleted = user?.stats?.testHistory?.length || 0;
  const activityDays = user?.stats?.activityDays || 0;

  useEffect(() => {
    setForm(getInitialForm(user));
    setEditing(false);
  }, [user?._id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setForm(getInitialForm(user));
    setEditing(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const payload = {
        name: form.name,
        studentPhone: form.studentPhone,
        parentPhone: form.parentPhone,
        parentEmail: form.parentEmail,
        school: form.school,
        city: form.city,
        state: form.state,
      };

      const updated = await updateProfile(payload);
      setUser(updated);
      setForm(getInitialForm(updated));
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const joinedDate = useMemo(() => {
    if (!user?.createdAt) return "—";
    return new Date(user.createdAt).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, [user?.createdAt]);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* HERO */}
      <section className="border-[6px] border-black bg-white shadow-[10px_10px_0px_black] overflow-hidden">
        <div className="grid lg:grid-cols-[1.15fr_1fr]">
          {/* Left / avatar */}
          <div className="p-6 md:p-8 lg:p-10 bg-gradient-to-br from-yellow-300 via-yellow-200 to-white border-b-[6px] lg:border-b-0 lg:border-r-[6px] border-black">
            <div className="flex items-center gap-5">
              <div className="relative shrink-0 w-24 h-24 md:w-28 md:h-28 rounded-full border-[5px] border-black bg-[#8ed1ff] shadow-[6px_6px_0px_black] overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_30%,#fff7cc_0_18%,transparent_19%),radial-gradient(circle_at_70%_78%,rgba(0,0,0,0.09)_0_8%,transparent_9%),linear-gradient(180deg,#8ed1ff_0%,#5cb6ff_100%)]" />
                <div className="absolute left-1/2 top-[30%] h-8 w-8 -translate-x-1/2 rounded-full bg-[#f6c7a0] border-[4px] border-black" />
                <div className="absolute left-1/2 top-[22%] h-4 w-16 -translate-x-1/2 rounded-full bg-black" />
                <div className="absolute left-[31%] top-[41%] h-2.5 w-2.5 rounded-full bg-black" />
                <div className="absolute right-[31%] top-[41%] h-2.5 w-2.5 rounded-full bg-black" />
                <div className="absolute left-1/2 top-[47%] h-2 w-4 -translate-x-1/2 rounded-full bg-black" />
                <div className="absolute left-1/2 bottom-[18%] h-10 w-16 -translate-x-1/2 rounded-t-full bg-white border-[4px] border-black" />
                <div className="absolute left-1/2 bottom-[22%] h-3 w-20 -translate-x-1/2 rounded-full bg-pink-200 border-[3px] border-black" />
              </div>

              <div className="min-w-0">
                <p className="inline-flex items-center gap-2 rounded-full border-4 border-black bg-pink-500 px-3 py-1 text-[10px] md:text-xs font-black uppercase tracking-[0.18em] text-white">
                  <BadgeCheck size={14} />
                  Student Profile
                </p>
                <h2 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-black italic uppercase leading-none">
                  Your Profile
                </h2>
                <p className="mt-3 text-sm md:text-base font-bold text-black/70 leading-relaxed max-w-xl">
                  Review your account details, update your contact information,
                  and keep everything in sync with your learning dashboard.
                </p>
              </div>
            </div>
          </div>

          {/* Right / quick summary */}
          <div className="p-6 md:p-8 lg:p-10 bg-[#fff9e6]">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 flex items-center justify-center border-[4px] border-black bg-blue-400 shadow-[4px_4px_0px_black]">
                    <User size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-black/60">
                      Signed in as
                    </p>
                    <p className="text-xl md:text-2xl font-black">
                      {user?.name || "Student"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="border-[4px] border-black bg-yellow-400 p-4 shadow-[4px_4px_0px_black]">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em]">
                      Tests Completed
                    </p>
                    <p className="mt-1 text-2xl font-black">{testsCompleted}</p>
                  </div>

                  <div className="border-[4px] border-black bg-pink-500 p-4 text-white shadow-[4px_4px_0px_black]">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em]">
                      Activity Days
                    </p>
                    <p className="mt-1 text-2xl font-black">{activityDays}</p>
                  </div>

                  <div className="border-[4px] border-black bg-blue-400 p-4 shadow-[4px_4px_0px_black]">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em]">
                      Joined
                    </p>
                    <p className="mt-1 text-sm font-black">{joinedDate}</p>
                  </div>

                  <div className="border-[4px] border-black bg-white p-4 shadow-[4px_4px_0px_black]">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em]">
                      Payment
                    </p>
                    <p className="mt-1 text-sm font-black uppercase">
                      {user?.paymentStatus || "pending"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DETAILS */}
      <section className="border-[6px] border-black bg-white p-5 md:p-7 shadow-[8px_8px_0px_black] relative">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 flex items-center justify-center border-[4px] border-black bg-blue-400 shadow-[4px_4px_0px_black] shrink-0">
              <BadgeCheck size={20} />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-black uppercase italic">
                Account Details
              </h3>
              <p className="text-sm font-bold text-black/60">
                Editable fields are enabled only in edit mode.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:justify-end">
            {!editing ? (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="inline-flex items-center justify-center gap-2 border-[4px] border-black bg-yellow-400 px-5 py-3 text-sm font-black uppercase shadow-[4px_4px_0px_black] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-none transition-all"
              >
                <Edit3 size={16} />
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex items-center justify-center gap-2 border-[4px] border-black bg-white px-5 py-3 text-sm font-black uppercase shadow-[4px_4px_0px_black] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-none transition-all"
                >
                  <X size={16} />
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 border-[4px] border-black bg-green-400 px-5 py-3 text-sm font-black uppercase shadow-[4px_4px_0px_black] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <Save size={16} />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
              className="inline-flex items-center justify-center gap-2 border-[4px] border-black bg-pink-500 px-5 py-3 text-sm font-black uppercase text-white shadow-[4px_4px_0px_black] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-none transition-all"
            >
              <KeyRound size={16} />
              Forgot Password
            </button>

            <button
              onClick={() => {
                logout();
                window.location.href = "/login?reason=unauthorized";
              }}
              className="inline-flex items-center justify-center gap-2 border-[4px] border-black bg-red-600 px-5 py-3 text-sm font-black uppercase text-white shadow-[4px_4px_0px_black] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-none transition-all"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <ProfileField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            disabled={!editing}
            icon={<User size={14} />}
            placeholder="Your full name"
          />

          <ProfileField
            label="Email"
            name="email"
            value={form.email}
            readOnly
            icon={<Mail size={14} />}
          />

          <ProfileField
            label="Student Phone"
            name="studentPhone"
            value={form.studentPhone}
            onChange={handleChange}
            disabled={!editing}
            icon={<Phone size={14} />}
            placeholder="Student mobile number"
            inputMode="numeric"
          />

          <ProfileField
            label="Parent Phone"
            name="parentPhone"
            value={form.parentPhone}
            onChange={handleChange}
            disabled={!editing}
            icon={<Users size={14} />}
            placeholder="Parent mobile number"
            inputMode="numeric"
          />

          <ProfileField
            label="Parent Email"
            name="parentEmail"
            value={form.parentEmail}
            onChange={handleChange}
            disabled={!editing}
            icon={<Mail size={14} />}
            placeholder="Parent email address"
          />

          <ProfileField
            label="School"
            name="school"
            value={form.school}
            onChange={handleChange}
            disabled={!editing}
            icon={<School size={14} />}
            placeholder="School name"
          />

          <ProfileField
            label="City"
            name="city"
            value={form.city}
            onChange={handleChange}
            disabled={!editing}
            icon={<MapPin size={14} />}
            placeholder="City"
          />

          <ProfileField
            label="State"
            name="state"
            value={form.state}
            onChange={handleChange}
            disabled={!editing}
            icon={<MapPin size={14} />}
            placeholder="State"
          />

          <ProfileField
            label="Board"
            name="board"
            value={form.board}
            readOnly
            icon={<School size={14} />}
          />

          <ProfileField
            label="Class Level"
            name="level"
            value={form.level}
            readOnly
            icon={<Award size={14} />}
          />
        </div>
      </section>

      {/* FOOTER INFO */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="border-[4px] border-black bg-yellow-400 p-5 font-black shadow-[4px_4px_0px_black]">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em]">
            <Activity size={14} />
            Progress Snapshot
          </div>
          <p className="mt-2 text-lg">Learning activity is tracked here.</p>
        </div>

        <div className="border-[4px] border-black bg-pink-500 p-5 font-black text-white shadow-[4px_4px_0px_black]">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em]">
            <BadgeCheck size={14} />
            Profile Status
          </div>
          <p className="mt-2 text-lg">Keep details updated for better support.</p>
        </div>

        <div className="border-[4px] border-black bg-blue-400 p-5 font-black shadow-[4px_4px_0px_black]">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em]">
            <CalendarDays size={14} />
            Last Updated
          </div>
          <p className="mt-2 text-lg">{joinedDate}</p>
        </div>
      </section>

      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setShowForgotModal(false)}
          />

          <div className="relative z-[201] w-full max-w-xl border-[6px] border-black bg-white shadow-[12px_12px_0px_black]">
            <div className="flex items-start justify-between gap-4 border-b-[6px] border-black bg-yellow-300 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 flex items-center justify-center border-[4px] border-black bg-pink-500 text-white shadow-[4px_4px_0px_black]">
                  <ShieldAlert size={22} />
                </div>
                <div>
                  <h4 className="text-xl md:text-2xl font-black uppercase italic">
                    Forgot Password
                  </h4>
                  <p className="text-sm font-bold text-black/70">
                    Important steps to reset access safely
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="border-[4px] border-black bg-white p-2 font-black shadow-[4px_4px_0px_black] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-none transition-all"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 md:p-6 space-y-4">
              <p className="text-sm md:text-base font-bold leading-relaxed text-black/80">
                To change your password, please log out first and then use the{" "}
                <span className="font-black">Forgot Password</span> option on
                the login page.
              </p>

              <div className="grid gap-3">
                <div className="border-[4px] border-black bg-[#fff9e6] p-4 shadow-[4px_4px_0px_black]">
                  <p className="text-sm font-black uppercase tracking-[0.14em]">
                    Step 1
                  </p>
                  <p className="mt-1 text-sm font-bold">
                    Click Logout from your dashboard.
                  </p>
                </div>

                <div className="border-[4px] border-black bg-blue-400 p-4 shadow-[4px_4px_0px_black]">
                  <p className="text-sm font-black uppercase tracking-[0.14em]">
                    Step 2
                  </p>
                  <p className="mt-1 text-sm font-bold">
                    On the login page, click Forgot Password.
                  </p>
                </div>

                <div className="border-[4px] border-black bg-pink-500 p-4 text-white shadow-[4px_4px_0px_black]">
                  <p className="text-sm font-black uppercase tracking-[0.14em]">
                    Step 3
                  </p>
                  <p className="mt-1 text-sm font-bold">
                    Verify the OTP and set your new password.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="flex-1 border-[4px] border-black bg-white px-5 py-3 text-sm font-black uppercase shadow-[4px_4px_0px_black] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-none transition-all"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="flex-1 border-[4px] border-black bg-black px-5 py-3 text-sm font-black uppercase text-white shadow-[4px_4px_0px_black] hover:bg-red-600 transition-all"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}