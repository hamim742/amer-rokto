"use client";

import Link from "next/link";

const urgentRequests = [
  { group: "O-", location: "ঢাকা মেডিকেল", time: "২ ঘণ্টা আগে", units: "২ ব্যাগ" },
  { group: "AB+", location: "চট্টগ্রাম জেনারেল", time: "৩ ঘণ্টা আগে", units: "১ ব্যাগ" },
  { group: "B-", location: "সিলেট ওসমানী", time: "৫ ঘণ্টা আগে", units: "৩ ব্যাগ" },
  { group: "A+", location: "রাজশাহী মেডিকেল", time: "১ ঘণ্টা আগে", units: "২ ব্যাগ" },
];

export default function EmergencyBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#1a0000] to-[#2d0000] py-16 sm:py-20">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="absolute rounded-full border border-red-600/20"
            style={{
              width: `${item * 200}px`,
              height: `${item * 200}px`,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              animation: `ripple 3s ease-out ${item * 0.8}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute left-0 right-0 top-0 opacity-20">
        <svg viewBox="0 0 1200 40" className="w-full" preserveAspectRatio="none">
          <polyline
            points="0,20 100,20 130,20 150,4 170,36 190,20 250,20 280,20 300,6 320,34 340,20 400,20 430,20 450,4 470,36 490,20 550,20 580,20 600,6 620,34 640,20 700,20 730,20 750,4 770,36 790,20 850,20 880,20 900,6 920,34 940,20 1000,20 1030,20 1050,4 1070,36 1090,20 1200,20"
            fill="none"
            stroke="#FF4444"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-700/50 bg-red-900/50 px-4 py-1.5 text-sm font-semibold text-red-300">
            <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
            জরুরি রক্তের প্রয়োজন
          </div>
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            এখনই <span className="text-red-400">সাহায্য</span> দরকার
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-gray-400">
            নিচের রোগীরা এখন জরুরি রক্তের জন্য অপেক্ষা করছেন
          </p>
        </div>

        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {urgentRequests.map((request, index) => (
            <div
              key={`${request.group}-${index}`}
              className="group relative rounded-2xl border border-red-900/40 bg-white/5 p-5 backdrop-blur-sm transition-all duration-300 hover:border-red-700/60 hover:bg-white/10"
            >
              <div className="absolute -right-2 -top-2 animate-pulse rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
                জরুরি
              </div>

              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#CC0000] to-[#8B0000] text-lg font-extrabold text-white shadow-lg">
                  {request.group}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{request.location}</p>
                  <p className="text-xs text-gray-400">{request.time}</p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-red-300">
                  {request.units} প্রয়োজন
                </span>
                <Link
                  href={`/donate?group=${request.group}`}
                  className="rounded-lg bg-red-700 px-3 py-1.5 text-xs font-bold text-white transition-colors duration-200 hover:bg-red-600"
                >
                  সাহায্য করুন
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/emergency"
            className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#CC0000] to-[#8B0000] px-8 py-4 text-base font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-red-900/50"
          >
            <span className="animate-heartbeat text-xl">🩸</span>
            সব জরুরি অনুরোধ দেখুন
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
