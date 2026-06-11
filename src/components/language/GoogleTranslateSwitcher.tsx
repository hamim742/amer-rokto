"use client";

import { useEffect, useState } from "react";

type Language = "bn" | "en";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages: string;
            autoDisplay: boolean;
          },
          element: string
        ) => void;
      };
    };
  }
}

const sourceLanguage: Language = "bn";

export default function GoogleTranslateSwitcher({ compact = false }: { compact?: boolean }) {
  const [activeLanguage, setActiveLanguage] = useState<Language>("bn");

  useEffect(() => {
    const savedLanguage = readSavedLanguage();
    setActiveLanguage(savedLanguage);
    if (savedLanguage === "en") {
      setTranslateCookie("en");
    }
    loadGoogleTranslate();
  }, []);

  const changeLanguage = (language: Language) => {
    setActiveLanguage(language);
    window.localStorage.setItem("siteLanguage", language);
    if (language === "bn") {
      clearTranslateCookie();
    } else {
      setTranslateCookie(language);
    }
    window.location.reload();
  };

  return (
    <>
      <div id="google_translate_element" className="hidden" />
      <div
        className={`notranslate inline-flex items-center rounded-full border border-red-100 bg-white p-0.5 shadow-sm shadow-red-950/5 ring-1 ring-red-50 ${
          compact ? "h-8 w-[78px]" : "h-9 w-[88px]"
        }`}
        aria-label="Language switcher"
      >
        {!compact && <GlobeIcon />}
        {(["bn", "en"] as Language[]).map((language) => {
          const active = activeLanguage === language;
          return (
            <button
              key={language}
              type="button"
              onClick={() => changeLanguage(language)}
              className={`h-7 flex-1 rounded-full text-[10px] font-extrabold leading-none tracking-wide transition ${
                active
                  ? "bg-[#CC0000] text-white shadow-sm"
                  : "text-gray-500 hover:bg-red-50 hover:text-[#CC0000]"
              }`}
            >
              {language.toUpperCase()}
            </button>
          );
        })}
      </div>
    </>
  );
}

function loadGoogleTranslate() {
  if (document.getElementById("google-translate-script")) return;

  window.googleTranslateElementInit = () => {
    if (!window.google?.translate?.TranslateElement) return;
    new window.google.translate.TranslateElement(
      {
        pageLanguage: sourceLanguage,
        includedLanguages: "bn,en",
        autoDisplay: false,
      },
      "google_translate_element"
    );
  };

  const script = document.createElement("script");
  script.id = "google-translate-script";
  script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  script.async = true;
  document.body.appendChild(script);
}

function readSavedLanguage(): Language {
  if (typeof window === "undefined") return "bn";
  const saved = window.localStorage.getItem("siteLanguage");
  return saved === "en" ? "en" : "bn";
}

function setTranslateCookie(language: Language) {
  const value = `/${sourceLanguage}/${language}`;
  const expires = "max-age=31536000";
  document.cookie = `googtrans=${value};path=/;${expires}`;

  const hostname = window.location.hostname;
  if (hostname.includes(".")) {
    document.cookie = `googtrans=${value};path=/;domain=.${hostname};${expires}`;
  }
}

function clearTranslateCookie() {
  document.cookie = "googtrans=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";

  const hostname = window.location.hostname;
  if (hostname.includes(".")) {
    document.cookie = `googtrans=;path=/;domain=.${hostname};expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}

function GlobeIcon() {
  return (
    <svg
      className="ml-2 mr-1 h-3.5 w-3.5 flex-shrink-0 text-[#CC0000]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3a9 9 0 100 18 9 9 0 000-18z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.6 9h16.8M3.6 15h16.8M12 3c2 2.4 3 5.4 3 9s-1 6.6-3 9c-2-2.4-3-5.4-3-9s1-6.6 3-9z" />
    </svg>
  );
}
