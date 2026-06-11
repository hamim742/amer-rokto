"use client";

import Link from "next/link";
import { useState } from "react";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function HeroSection() {
  const [selectedGroup, setSelectedGroup] = useState("");
  const [district, setDistrict] = useState("");

  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-gradient-to-br from-[#8B0000] via-[#CC0000] to-[#FF2222]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5 blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-32 w-80 h-80 rounded-full bg-[#8B0000]/40 blur-3xl animate-pulse delay-1000" />
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 rounded-full bg-white/5 blur-3xl animate-pulse delay-500" />

        {[
          { top: "10%", left: "8%", size: 28, delay: "0s" },
          { top: "20%", left: "88%", size: 20, delay: "1.2s" },
          { top: "65%", left: "5%", size: 16, delay: "0.6s" },
          { top: "75%", left: "92%", size: 24, delay: "1.8s" },
          { top: "45%", left: "80%", size: 14, delay: "0.3s" },
        ].map((drop, i) => (
          <div
            key={i}
            className="absolute opacity-20"
            style={{
              top: drop.top,
              left: drop.left,
              animationDelay: drop.delay,
              animation: `floatDrop 4s ease-in-out ${drop.delay} infinite`,
            }}
          >
            <BloodDropSVG size={drop.size} color="white" />
          </div>
        ))}
      </div>

      <div className="absolute bottom-20 left-0 right-0 opacity-15 pointer-events-none">
        <svg viewBox="0 0 1200 60" className="w-full" preserveAspectRatio="none">
          <polyline
            points="0,30 100,30 140,30 160,5 180,55 200,30 220,30 260,30 280,15 300,45 320,30 400,30 440,30 460,8 480,52 500,30 520,30 600,30 640,30 660,10 680,50 700,30 720,30 800,30 840,30 860,12 880,48 900,30 920,30 1000,30 1040,30 1060,6 1080,54 1100,30 1200,30"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
        <svg viewBox="0 0 1440 80" className="w-full" preserveAspectRatio="none">
          <path
            d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
            fill="white"
          />
        </svg>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="animate-slide-left space-y-6 text-white">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
              বাংলাদেশের সবচেয়ে বড় রক্তদান নেটওয়ার্ক
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              একটি রক্তদান
              <br />
              <span className="text-yellow-300 drop-shadow-lg">বাঁচাতে পারে</span>
              <br />
              একটি জীবন
            </h1>

            <p className="max-w-lg text-lg leading-relaxed text-white/85 sm:text-xl">
              আমার রক্ত — বাংলাদেশের স্বেচ্ছাসেবী রক্তদাতাদের সাথে রক্তপ্রার্থীদের
              যুক্ত করার বিনামূল্যে প্ল্যাটফর্ম। ২৪/৭ সেবা, সারা দেশে।
            </p>

            <div className="max-w-lg space-y-4 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
              <p className="text-sm font-semibold uppercase tracking-wider text-white/80">
                🔍 দ্রুত ডোনার খুঁজুন
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-white/70">রক্তের গ্রুপ</label>
                  <select
                    value={selectedGroup}
                    onChange={(event) => setSelectedGroup(event.target.value)}
                    className="w-full cursor-pointer appearance-none rounded-xl border border-white/30 bg-white/20 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    <option value="" className="text-gray-800">
                      গ্রুপ বেছে নিন
                    </option>
                    {bloodGroups.map((group) => (
                      <option key={group} value={group} className="text-gray-800">
                        {group}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-white/70">জেলা</label>
                  <input
                    type="text"
                    placeholder="যেমন: ঢাকা"
                    value={district}
                    onChange={(event) => setDistrict(event.target.value)}
                    className="w-full rounded-xl border border-white/30 bg-white/20 px-3 py-2.5 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
              </div>
              <Link
                href={`/find-blood?group=${selectedGroup}&district=${district}`}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-bold text-[#CC0000] shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-yellow-50 hover:shadow-xl"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                ডোনার খুঁজুন
              </Link>
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href="/become-donor"
                className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-6 py-3 text-sm font-bold text-gray-900 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-yellow-300 hover:shadow-xl"
              >
                🩸 ডোনার হিসেবে নিবন্ধন করুন
              </Link>
              <Link
                href="/request-blood"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/50 bg-white/15 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/25"
              >
                রক্তের অনুরোধ করুন →
              </Link>
            </div>
          </div>

          <div className="hidden animate-slide-right items-center justify-center lg:flex">
            <div className="relative h-80 w-80">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="absolute inset-0 rounded-full border-2 border-white/20"
                  style={{ animation: `ripple 3s ease-out ${i * 0.8}s infinite` }}
                />
              ))}

              <div className="absolute inset-0 flex animate-blood-pulse items-center justify-center">
                <svg viewBox="0 0 160 200" className="h-56 w-56 drop-shadow-2xl">
                  <defs>
                    <linearGradient id="heroDropGrad" x1="80" y1="0" x2="80" y2="200" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#FF6666" />
                      <stop offset="50%" stopColor="#FF2222" />
                      <stop offset="100%" stopColor="#660000" />
                    </linearGradient>
                    <filter id="dropShadow">
                      <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#8B0000" floodOpacity="0.5" />
                    </filter>
                  </defs>
                  <path
                    d="M80 8 C80 8 16 80 16 128 C16 166 44.8 192 80 192 C115.2 192 144 166 144 128 C144 80 80 8 80 8Z"
                    fill="url(#heroDropGrad)"
                    filter="url(#dropShadow)"
                  />
                  <ellipse cx="58" cy="100" rx="16" ry="28" fill="rgba(255,255,255,0.2)" />
                  <ellipse cx="52" cy="88" rx="8" ry="12" fill="rgba(255,255,255,0.15)" />
                  <text x="80" y="135" textAnchor="middle" fill="white" fontSize="22" fontWeight="bold" fontFamily="Arial">
                    আমার
                  </text>
                  <text x="80" y="158" textAnchor="middle" fill="white" fontSize="22" fontWeight="bold" fontFamily="Arial">
                    রক্ত
                  </text>
                </svg>
              </div>

              {[
                { group: "A+", angle: 0 },
                { group: "B+", angle: 90 },
                { group: "O+", angle: 180 },
                { group: "AB+", angle: 270 },
              ].map(({ group, angle }) => {
                const rad = (angle * Math.PI) / 180;
                const r = 148;
                const x = 50 + r * Math.cos(rad) * 0.5;
                const y = 50 + r * Math.sin(rad) * 0.5;
                return (
                  <div
                    key={group}
                    className="blood-badge absolute flex h-12 w-12 items-center justify-center rounded-full text-xs font-extrabold text-white shadow-lg"
                    style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)" }}
                  >
                    {group}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BloodDropSVG({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 40 50" fill="none">
      <path
        d="M20 2 C20 2 4 20 4 32 C4 41.5 11.2 48 20 48 C28.8 48 36 41.5 36 32 C36 20 20 2 20 2Z"
        fill={color}
      />
    </svg>
  );
}
