"use client";

import Link from "next/link";
import { useState } from "react";
import { isProfileComplete } from "@/lib/auth";
import { useAppSelector } from "@/redux/hooks";

export default function ProfileCompletionBanner() {
  const user = useAppSelector((state) => state.auth.user);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || isProfileComplete(user)) {
    return null;
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-red-100 bg-white shadow-lg shadow-red-950/5">
      <div className="flex flex-col gap-4 border-l-4 border-[#CC0000] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex gap-4">
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#CC0000]">
            <AlertIcon />
          </span>
          <div>
            <h2 className="text-lg font-extrabold text-gray-950">
              আপনার ডোনার প্রোফাইল সম্পূর্ণ করুন
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
              রক্তের গ্রুপ, যোগাযোগ ও লোকেশন যোগ করলে জরুরি সময়ে মানুষ দ্রুত
              আপনাকে খুঁজে পাবে।
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 sm:flex-shrink-0">
          <Link
            href="/profile/edit"
            className="rounded-xl bg-gradient-to-r from-[#CC0000] to-[#8B0000] px-4 py-2.5 text-sm font-extrabold text-white shadow-md shadow-red-900/15 transition hover:-translate-y-0.5"
          >
            প্রোফাইল পূরণ করুন
          </Link>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-extrabold text-gray-700 transition hover:border-red-100 hover:bg-red-50 hover:text-[#CC0000]"
          >
            পরে
          </button>
        </div>
      </div>
    </section>
  );
}

function AlertIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
  );
}
