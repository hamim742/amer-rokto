"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import GoogleTranslateSwitcher from "@/components/language/GoogleTranslateSwitcher";
import { useAppSelector } from "@/redux/hooks";

const navLinks = [
  { label: "হোম", href: "/" },
  { label: "রক্ত খুঁজুন", href: "/find-blood" },
  { label: "ডোনার হন", href: "/become-donor" },
  { label: "ব্লাড ব্যাংক", href: "/blood-bank" },
  { label: "আমাদের সম্পর্কে", href: "/about" },
  { label: "যোগাযোগ", href: "/contact" },
];

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { token, user } = useAppSelector((state) => state.auth);
  const isLoggedIn = Boolean(token);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("#mobile-menu") && !target.closest("#hamburger")) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  return (
    <>
      <div className="bg-[#8B0000] px-4 py-1.5 text-center text-xs font-medium tracking-wide text-white sm:text-sm">
        🩸 জরুরি রক্তের প্রয়োজন? এখনই অনুরোধ করুন —{" "}
        <Link href="/emergency" className="underline underline-offset-2 transition-colors hover:text-red-200">
          ইমার্জেন্সি রিকোয়েস্ট
        </Link>
      </div>

      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/95 shadow-[0_4px_20px_rgba(139,0,0,0.15)] backdrop-blur-md"
            : "bg-white shadow-sm"
        }`}
      >
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#8B0000] via-[#CC0000] to-[#8B0000]" />

        <nav className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-3 lg:h-[68px]">
            <Link href="/" className="notranslate group flex flex-shrink-0 items-center gap-2.5">
              <div className="relative h-9 w-9 flex-shrink-0">
                <svg
                  viewBox="0 0 40 50"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-full w-full drop-shadow-md transition-transform duration-300 group-hover:scale-110"
                >
                  <path
                    d="M20 2 C20 2 4 20 4 32 C4 41.5 11.2 48 20 48 C28.8 48 36 41.5 36 32 C36 20 20 2 20 2Z"
                    fill="url(#bloodGrad)"
                  />
                  <ellipse cx="14" cy="26" rx="4" ry="6" fill="rgba(255,255,255,0.25)" />
                  <path
                    d="M20 2 C20 2 4 20 4 32 C4 41.5 11.2 48 20 48 C28.8 48 36 41.5 36 32 C36 20 20 2 20 2Z"
                    stroke="#FF4444"
                    strokeWidth="1"
                    fill="none"
                    className="animate-ping opacity-30"
                  />
                  <defs>
                    <linearGradient id="bloodGrad" x1="20" y1="2" x2="20" y2="48" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#FF2222" />
                      <stop offset="60%" stopColor="#CC0000" />
                      <stop offset="100%" stopColor="#8B0000" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="flex flex-col leading-tight">
                <span className="text-xl font-extrabold tracking-tight text-[#CC0000] transition-colors duration-200 group-hover:text-[#8B0000] sm:text-2xl">
                  আমার রক্ত
                </span>
                <span className="hidden text-[10px] font-medium uppercase tracking-widest text-gray-500 sm:block">
                  রক্তদান নেটওয়ার্ক
                </span>
              </div>
            </Link>

            <div className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group relative whitespace-nowrap rounded-md px-2 py-2 text-[13px] font-medium text-gray-700 transition-colors duration-200 hover:text-[#CC0000] xl:px-3 xl:text-sm"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-[#CC0000] transition-all duration-300 group-hover:w-4/5" />
                </Link>
              ))}

              <div className="relative ml-1">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-2 text-[13px] font-medium text-gray-700 transition-colors duration-200 hover:text-[#CC0000] xl:px-3 xl:text-sm"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  <span>রক্তের গ্রুপ</span>
                  <ChevronIcon open={dropdownOpen} />
                </button>

                {dropdownOpen && (
                  <div
                    className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-red-100 bg-white shadow-xl"
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <div className="grid grid-cols-4 gap-1 p-2">
                      {bloodGroups.map((group) => (
                        <Link
                          key={group}
                          href={`/find-blood?group=${group}`}
                          onClick={() => setDropdownOpen(false)}
                          className="flex h-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#CC0000] to-[#8B0000] text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:from-[#FF2222] hover:to-[#CC0000] hover:shadow-md"
                        >
                          {group}
                        </Link>
                      ))}
                    </div>
                    <div className="px-3 pb-3">
                      <Link
                        href="/find-blood"
                        onClick={() => setDropdownOpen(false)}
                        className="block w-full text-center text-xs font-medium text-[#CC0000] hover:underline"
                      >
                        সব গ্রুপ দেখুন →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="hidden flex-shrink-0 items-center gap-2 lg:flex">
              <GoogleTranslateSwitcher />
              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 whitespace-nowrap rounded-full border-2 border-[#CC0000] bg-red-50 px-3 py-2 text-sm font-bold text-[#CC0000] transition-all duration-200 hover:bg-[#CC0000] hover:text-white xl:px-4"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#CC0000] text-xs font-extrabold text-white">
                    {user?.name?.charAt(0) || "প"}
                  </span>
                  <span>প্রোফাইল</span>
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="whitespace-nowrap rounded-full border-2 border-[#CC0000] px-3 py-2 text-sm font-semibold text-[#CC0000] transition-all duration-200 hover:bg-[#CC0000] hover:text-white xl:px-4"
                  >
                    লগইন
                  </Link>
                  <Link
                    href="/register"
                    className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md xl:px-4"
                    style={{ background: "linear-gradient(135deg, #CC0000 0%, #8B0000 100%)" }}
                  >
                    রেজিস্ট্রেশন
                  </Link>
                </>
              )}
              <Link
                href="/donate"
                className="group relative overflow-hidden whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold text-white"
                style={{ background: "linear-gradient(135deg, #CC0000 0%, #8B0000 100%)" }}
              >
                <span className="relative z-10 flex items-center gap-1.5">🩸 রক্ত দিন</span>
                <span className="absolute inset-0 rounded-full bg-white opacity-0 transition-opacity duration-200 group-hover:opacity-10" />
              </Link>
            </div>

            <div className="flex items-center gap-1.5 lg:hidden">
              <GoogleTranslateSwitcher compact />
              <Link
                href="/donate"
                className="rounded-full px-3 py-1.5 text-xs font-bold text-white shadow-md"
                style={{ background: "linear-gradient(135deg, #CC0000 0%, #8B0000 100%)" }}
              >
                🩸 দিন
              </Link>

              <button
                id="hamburger"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="মেনু খুলুন বা বন্ধ করুন"
                aria-expanded={menuOpen}
                className="rounded-lg p-2 text-gray-700 transition-colors duration-200 hover:bg-red-50 hover:text-[#CC0000]"
              >
                <div className="flex h-4 w-5 flex-col justify-between">
                  <span className={`block h-0.5 origin-center rounded-full bg-current transition-all duration-300 ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
                  <span className={`block h-0.5 rounded-full bg-current transition-all duration-300 ${menuOpen ? "scale-x-0 opacity-0" : ""}`} />
                  <span className={`block h-0.5 origin-center rounded-full bg-current transition-all duration-300 ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
                </div>
              </button>
            </div>
          </div>
        </nav>

        <div
          id="mobile-menu"
          className={`overflow-hidden transition-all duration-300 ease-in-out lg:hidden ${
            menuOpen ? "max-h-[650px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-1 border-t border-red-100 bg-white px-4 pb-5 pt-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-red-50 hover:text-[#CC0000]"
              >
                <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#CC0000]" />
                {link.label}
              </Link>
            ))}

            <div className="pb-1 pt-3">
              <p className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                রক্তের গ্রুপ অনুযায়ী খুঁজুন
              </p>
              <div className="grid grid-cols-4 gap-2 px-2">
                {bloodGroups.map((group) => (
                  <Link
                    key={group}
                    href={`/find-blood?group=${group}`}
                    onClick={() => setMenuOpen(false)}
                    className="flex h-11 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm transition-transform active:scale-95"
                    style={{ background: "linear-gradient(135deg, #CC0000 0%, #8B0000 100%)" }}
                  >
                    {group}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex gap-3 px-2 pt-3">
              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-[#CC0000] bg-red-50 py-2.5 text-sm font-bold text-[#CC0000] hover:bg-[#CC0000] hover:text-white"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#CC0000] text-xs font-extrabold text-white">
                    {user?.name?.charAt(0) || "প"}
                  </span>
                  প্রোফাইল
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 rounded-full border-2 border-[#CC0000] py-2.5 text-center text-sm font-semibold text-[#CC0000] transition-all duration-200 hover:bg-[#CC0000] hover:text-white"
                  >
                    লগইন
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 rounded-full py-2.5 text-center text-sm font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #CC0000 0%, #8B0000 100%)" }}
                  >
                    রেজিস্ট্রেশন
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}
