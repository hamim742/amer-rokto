"use client";

import Link from "next/link";

const badges = [
  "✅ সম্পূর্ণ বিনামূল্যে",
  "🔒 তথ্য সুরক্ষিত",
  "⚡ ২৪/৭ সেবা",
  "🇧🇩 সারা বাংলাদেশে",
];

export default function CallToAction() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#8B0000] via-[#CC0000] to-[#FF2222] py-20 sm:py-28">
      <div className="absolute left-0 right-0 top-0 rotate-180 overflow-hidden leading-none">
        <svg viewBox="0 0 1440 60" className="w-full" preserveAspectRatio="none">
          <path d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,20 1440,30 L1440,60 L0,60 Z" fill="white" />
        </svg>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-[#8B0000]/30 blur-3xl" />
      </div>

      {[
        { top: "15%", left: "5%", size: 20 },
        { top: "70%", left: "90%", size: 16 },
        { top: "40%", left: "95%", size: 12 },
        { top: "80%", left: "8%", size: 14 },
      ].map((drop, index) => (
        <div
          key={index}
          className="absolute opacity-15 pointer-events-none"
          style={{
            top: drop.top,
            left: drop.left,
            animation: `floatDrop 4s ease-in-out ${index * 0.7}s infinite`,
          }}
        >
          <svg width={drop.size} height={drop.size * 1.25} viewBox="0 0 40 50" fill="none">
            <path d="M20 2 C20 2 4 20 4 32 C4 41.5 11.2 48 20 48 C28.8 48 36 41.5 36 32 C36 20 20 2 20 2Z" fill="white" />
          </svg>
        </div>
      ))}

      <div className="relative mx-auto max-w-4xl px-4 text-center text-white sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 animate-heartbeat items-center justify-center rounded-full border-2 border-white/30 bg-white/15 text-3xl">
            🩸
          </div>
        </div>

        <h2 className="mb-4 text-3xl font-extrabold leading-tight sm:text-5xl">
          আজই একটি জীবন
          <br />
          <span className="text-yellow-300">বাঁচানোর সুযোগ নিন</span>
        </h2>

        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl">
          আপনার একটি সিদ্ধান্ত কারো জীবন বদলে দিতে পারে। আজই আমার রক্তে যোগ দিন
          এবং স্বেচ্ছাসেবী রক্তদাতাদের বিশাল পরিবারের অংশ হন।
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/become-donor"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-extrabold text-[#CC0000] shadow-xl transition-all duration-200 hover:-translate-y-1 hover:bg-yellow-50 hover:shadow-2xl"
          >
            🩸 ডোনার হিসেবে নিবন্ধন করুন
          </Link>
          <Link
            href="/request-blood"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-white/40 bg-white/15 px-8 py-4 text-base font-bold text-white transition-all duration-200 hover:bg-white/25"
          >
            রক্তের অনুরোধ করুন
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-white/60">
          {badges.map((badge) => (
            <span key={badge} className="flex items-center gap-1">
              {badge}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
        <svg viewBox="0 0 1440 40" className="w-full" preserveAspectRatio="none">
          <path d="M0,20 C360,40 720,0 1080,20 C1260,30 1380,10 1440,20 L1440,40 L0,40 Z" fill="white" opacity="0.1" />
        </svg>
      </div>
    </section>
  );
}
