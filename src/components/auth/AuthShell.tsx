import Link from "next/link";

type AuthShellProps = {
  badge: string;
  title: string;
  highlight: string;
  description: string;
  panelTitle: string;
  panelDescription: string;
  activeStep: 1 | 2 | 3;
  children: React.ReactNode;
};

const steps = [
  { value: "০১", label: "অ্যাকাউন্ট" },
  { value: "০২", label: "ইমেইল ওটিপি" },
  { value: "০৩", label: "প্রোফাইল" },
];

const trustPoints = ["বিনামূল্যে সেবা", "যাচাইকৃত ইমেইল", "প্রোফাইল পরে"];

export default function AuthShell({
  badge,
  title,
  highlight,
  description,
  panelTitle,
  panelDescription,
  activeStep,
  children,
}: AuthShellProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fff7f7]">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#8B0000] via-[#CC0000] to-[#FF2222]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute top-1/3 -right-28 h-72 w-72 rounded-full bg-[#8B0000]/35 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-60 w-60 rounded-full bg-white/5 blur-3xl" />
        </div>

        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg viewBox="0 0 1200 80" className="h-full w-full" preserveAspectRatio="none">
            <polyline
              points="0,40 120,40 160,40 185,8 210,72 235,40 300,40 340,40 365,10 390,70 415,40 480,40 520,40 545,8 570,72 595,40 660,40 700,40 725,10 750,70 775,40 840,40 880,40 905,8 930,72 955,40 1020,40 1060,40 1085,10 1110,70 1135,40 1200,40"
              fill="none"
              stroke="white"
              strokeWidth="2"
            />
          </svg>
        </div>

        {[
          { top: "11%", left: "7%", size: 28, delay: "0s" },
          { top: "25%", left: "88%", size: 18, delay: "0.8s" },
          { top: "68%", left: "93%", size: 22, delay: "1.5s" },
          { top: "75%", left: "8%", size: 14, delay: "2s" },
        ].map((drop, index) => (
          <div
            key={index}
            className="absolute opacity-15 pointer-events-none"
            style={{
              top: drop.top,
              left: drop.left,
              animation: `floatDrop 4s ease-in-out ${drop.delay} infinite`,
            }}
          >
            <BloodDropIcon size={drop.size} color="white" />
          </div>
        ))}

        <div className="relative z-10 mx-auto grid max-w-7xl gap-8 px-4 pb-24 pt-12 sm:px-6 sm:pb-28 sm:pt-16 lg:grid-cols-[1fr_440px] lg:items-center lg:px-8">
          <div className="text-white">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
              {badge}
            </div>

            <h1 className="mt-5 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {title}
              <span className="block text-yellow-300 drop-shadow-lg">{highlight}</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-white/85 sm:text-lg">
              {description}
            </p>

            <div className="mt-7 grid max-w-xl grid-cols-3 gap-3">
              {steps.map((step, index) => {
                const selected = activeStep === index + 1;

                return (
                  <div
                    key={step.value}
                    className={`rounded-2xl border p-3 text-center transition ${
                      selected
                        ? "border-white/40 bg-white text-[#CC0000] shadow-lg"
                        : "border-white/20 bg-white/10 text-white/75"
                    }`}
                  >
                    <div className="text-lg font-extrabold">{step.value}</div>
                    <div className="mt-1 text-[11px] font-bold uppercase tracking-wide">
                      {step.label}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/75">
              {trustPoints.map((point) => (
                <span
                  key={point}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5"
                >
                  <CheckIcon />
                  {point}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/25 bg-white/95 p-5 shadow-2xl shadow-red-950/25 backdrop-blur-md sm:p-7">
            <div className="mb-6 flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-red-50">
                <BloodDropIcon size={24} color="#CC0000" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900">{panelTitle}</h2>
                <p className="mt-1 text-sm leading-6 text-gray-500">{panelDescription}</p>
              </div>
            </div>

            {children}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 54" className="w-full" preserveAspectRatio="none">
            <path
              d="M0,24 C280,58 510,0 760,28 C1010,56 1220,8 1440,24 L1440,54 L0,54 Z"
              fill="#fff7f7"
            />
          </svg>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:px-8">
        <InfoCard title="নিরাপদ নিবন্ধন" text="প্রথমে অ্যাকাউন্ট তৈরি করুন, তারপর ওটিপি দিয়ে ইমেইল যাচাই করুন।" />
        <InfoCard title="প্রোফাইল পরে পূরণ" text="রক্তের গ্রুপ, যোগাযোগ, জেলা ও চিকিৎসা তথ্য প্রোফাইল এডিট পেজে থাকবে।" />
        <InfoCard title="দ্রুত সহায়তা" text="সম্পূর্ণ ডোনার প্রোফাইল জরুরি সময়ে সঠিক মিল খুঁজে পেতে সাহায্য করে।" />
      </section>
    </main>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
      <div className="mb-3 h-1 w-12 rounded-full bg-gradient-to-r from-[#CC0000] to-[#8B0000]" />
      <h3 className="font-extrabold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-gray-500">{text}</p>
    </div>
  );
}

export function AuthFooterLink({
  text,
  href,
  label,
}: {
  text: string;
  href: string;
  label: string;
}) {
  return (
    <p className="mt-5 text-center text-sm text-gray-500">
      {text}{" "}
      <Link href={href} className="font-bold text-[#CC0000] hover:underline">
        {label}
      </Link>
    </p>
  );
}

function BloodDropIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 40 50" fill="none" aria-hidden="true">
      <path
        d="M20 2 C20 2 4 20 4 32 C4 41.5 11.2 48 20 48 C28.8 48 36 41.5 36 32 C36 20 20 2 20 2Z"
        fill={color}
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.6} d="M20 6L9 17l-5-5" />
    </svg>
  );
}
