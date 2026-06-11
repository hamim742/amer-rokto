"use client";

import Link from "next/link";
import { useState } from "react";
import ProtectedRoute from "@/components/routes/ProtectedRoute";
import ProfileCompletionBanner from "@/components/profile/ProfileCompletionBanner";
import { isProfileComplete } from "@/lib/auth";
import { useRequireCompleteProfile } from "@/hooks/useRequireCompleteProfile";
import { logout } from "@/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

export default function DashboardClient() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const requireCompleteProfile = useRequireCompleteProfile();
  const complete = isProfileComplete(user);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    dispatch(logout());
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#f8fafc] px-4 py-8 sm:py-10">
        <section className="mx-auto max-w-6xl space-y-6">
          <ProfileCompletionBanner />

          <div className="overflow-hidden rounded-2xl border border-red-100 bg-white shadow-xl shadow-red-950/5">
            <div className="bg-gradient-to-br from-[#8B0000] via-[#CC0000] to-[#FF2222] px-5 py-7 text-white sm:px-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-2xl font-extrabold ring-1 ring-white/20">
                    {user?.name?.charAt(0) || "ড"}
                  </div>
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-white/70">
                      ড্যাশবোর্ড
                    </p>
                    <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">
                      স্বাগতম{user?.name ? `, ${user.name}` : ""}
                    </h1>
                    <p className="mt-1 text-sm text-white/75">{user?.email || "ইমেইল নেই"}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowLogoutModal(true)}
                  className="w-fit rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-white hover:text-[#CC0000]"
                >
                  লগআউট
                </button>
              </div>
            </div>

            <div className="grid gap-5 p-5 sm:p-8 lg:grid-cols-[280px_1fr]">
              <aside className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <p className="text-sm font-extrabold text-gray-950">প্রোফাইল অবস্থা</p>
                <div
                  className={`mt-4 rounded-2xl px-4 py-4 ${
                    complete
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                      : "bg-red-50 text-[#CC0000] ring-1 ring-red-100"
                  }`}
                >
                  <div className="flex items-center gap-2 text-sm font-extrabold">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        complete ? "bg-emerald-500" : "bg-[#CC0000]"
                      }`}
                    />
                    {complete ? "সম্পূর্ণ" : "অসম্পূর্ণ"}
                  </div>
                  <p className="mt-2 text-xs leading-5 opacity-80">
                    {complete
                      ? "আপনার ডোনার প্রোফাইল ব্যবহারযোগ্য আছে।"
                      : "ডোনার হিসেবে দেখা যেতে আবশ্যক তথ্যগুলো পূরণ করুন।"}
                  </p>
                </div>
              </aside>

              <div className="grid gap-4 md:grid-cols-3">
                <ActionLink
                  href="/profile/edit"
                  title="প্রোফাইল এডিট"
                  text="রক্তের গ্রুপ, লোকেশন, যোগাযোগ ও উপলব্ধতা আপডেট করুন।"
                  icon={<UserIcon />}
                />
                <ActionLink
                  href="/change-password"
                  title="পাসওয়ার্ড পরিবর্তন"
                  text="অ্যাকাউন্ট নিরাপদ রাখতে পাসওয়ার্ড আপডেট করুন।"
                  icon={<LockIcon />}
                />
                <ActionButton
                  onClick={requireCompleteProfile}
                  title="ডোনার কার্যক্রম"
                  text="সম্পূর্ণ প্রোফাইল থাকলে ডোনার ফিচার ব্যবহার করুন।"
                  icon={<DropIcon />}
                />
              </div>
            </div>
          </div>
        </section>

        {showLogoutModal && (
          <LogoutConfirmModal
            onCancel={() => setShowLogoutModal(false)}
            onConfirm={handleConfirmLogout}
          />
        )}
      </main>
    </ProtectedRoute>
  );
}

function LogoutConfirmModal({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-gray-950/60 px-4 py-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-confirm-title"
    >
      <button
        type="button"
        aria-label="মডাল বন্ধ করুন"
        className="absolute inset-0 cursor-default"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-red-100 bg-white shadow-2xl shadow-gray-950/25">
        <div className="h-1.5 bg-gradient-to-r from-[#8B0000] via-[#CC0000] to-[#FF2222]" />
        <div className="p-6 sm:p-7">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-red-50 text-[#CC0000]">
              <LogoutIcon />
            </span>
            <div>
              <h2 id="logout-confirm-title" className="text-xl font-extrabold text-gray-950">
                লগআউট করতে চান?
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                আপনি লগআউট করলে এই ডিভাইসে আবার অ্যাকাউন্টে ঢুকতে লগইন করতে হবে।
              </p>
            </div>
          </div>

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-extrabold text-gray-700 transition hover:border-red-100 hover:bg-red-50 hover:text-[#CC0000]"
            >
              বাতিল
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="rounded-xl bg-gradient-to-r from-[#CC0000] to-[#8B0000] px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-red-900/15 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              হ্যাঁ, লগআউট
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionLink({
  href,
  title,
  text,
  icon,
}: {
  href: string;
  title: string;
  text: string;
  icon: React.ReactNode;
}) {
  return (
    <Link href={href} className={actionCardClassName}>
      <ActionContent title={title} text={text} icon={icon} />
    </Link>
  );
}

function ActionButton({
  onClick,
  title,
  text,
  icon,
}: {
  onClick: () => void;
  title: string;
  text: string;
  icon: React.ReactNode;
}) {
  return (
    <button type="button" onClick={onClick} className={`${actionCardClassName} text-left`}>
      <ActionContent title={title} text={text} icon={icon} />
    </button>
  );
}

function ActionContent({
  title,
  text,
  icon,
}: {
  title: string;
  text: string;
  icon: React.ReactNode;
}) {
  return (
    <>
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-[#CC0000] transition group-hover:bg-[#CC0000] group-hover:text-white">
        {icon}
      </span>
      <span className="mt-5 text-lg font-extrabold text-gray-950">{title}</span>
      <span className="mt-2 text-sm leading-6 text-gray-500">{text}</span>
      <span className="mt-auto pt-5 text-sm font-extrabold text-[#CC0000]">খুলুন</span>
    </>
  );
}

const actionCardClassName =
  "group flex min-h-52 flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-red-100 hover:shadow-lg hover:shadow-red-950/10";

function UserIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeWidth={2} d="M20 21c0-3.3-3.6-6-8-6s-8 2.7-8 6" />
      <path strokeWidth={2} d="M12 12a4 4 0 100-8 4 4 0 000 8z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeWidth={2} d="M7 11V8a5 5 0 0110 0v3" />
      <path strokeLinejoin="round" strokeWidth={2} d="M6 11h12v10H6z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 12H3m0 0l4-4m-4 4l4 4" />
      <path strokeLinecap="round" strokeWidth={2.2} d="M9 5V4a2 2 0 012-2h7a2 2 0 012 2v16a2 2 0 01-2 2h-7a2 2 0 01-2-2v-1" />
    </svg>
  );
}

function DropIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 40 50" fill="none" aria-hidden="true">
      <path
        d="M20 2 C20 2 4 20 4 32 C4 41.5 11.2 48 20 48 C28.8 48 36 41.5 36 32 C36 20 20 2 20 2Z"
        fill="currentColor"
      />
    </svg>
  );
}
