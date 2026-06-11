"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PublicRoute from "@/components/routes/PublicRoute";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import {
  setCredentials,
  setPendingVerifyEmail,
} from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { getApiErrorMessage, isUnverifiedError } from "@/lib/auth";
import AuthShell, { AuthFooterLink } from "@/components/auth/AuthShell";

const loginSchema = z.object({
  email: z.string().email("সঠিক ইমেইল লিখুন"),
  password: z.string().min(1, "পাসওয়ার্ড আবশ্যক"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginClient() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const response = await login(values).unwrap();
      dispatch(setCredentials(response.data));
      toast.success(response.message || "লগইন সফল হয়েছে।");
      router.push(getRedirectPath());
    } catch (error) {
      if (isUnverifiedError(error)) {
        dispatch(setPendingVerifyEmail(values.email));
        toast.error("প্রথমে আপনার ইমেইল যাচাই করুন।");
        router.push("/verify-otp");
        return;
      }

      toast.error(getApiErrorMessage(error, "লগইন হয়নি। আপনার তথ্য ঠিক আছে কিনা দেখুন।"));
    }
  };

  return (
    <PublicRoute>
      <AuthShell
        badge="নিরাপদ অ্যাকাউন্ট অ্যাক্সেস"
        title="স্বাগতম"
        highlight="আমার রক্তে"
        description="ডোনার প্রোফাইল ম্যানেজ করতে, বাকি তথ্য পূরণ করতে, উপলব্ধতা আপডেট করতে এবং জরুরি সময়ে মানুষকে দ্রুত রক্ত খুঁজে পেতে সাহায্য করতে লগইন করুন।"
        panelTitle="লগইন"
        panelDescription="চালিয়ে যেতে আপনার যাচাইকৃত ইমেইল ও পাসওয়ার্ড ব্যবহার করুন।"
        activeStep={2}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Field label="ইমেইল ঠিকানা" error={errors.email?.message} icon={<MailIcon />}>
            <input
              {...register("email")}
              type="email"
              className={inputClassName}
              placeholder="name@email.com"
            />
          </Field>

          <Field label="পাসওয়ার্ড" error={errors.password?.message} icon={<LockIcon />}>
            <input
              {...register("password")}
              type="password"
              className={inputClassName}
              placeholder="আপনার পাসওয়ার্ড"
            />
          </Field>

          <div className="flex items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-500">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-[#CC0000] focus:ring-[#CC0000]"
              />
              আমাকে মনে রাখুন
            </label>
            <Link href="/forgot-password" className="text-sm font-bold text-[#CC0000] hover:underline">
              পাসওয়ার্ড ভুলে গেছেন?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={primaryButtonClass}
          >
            {isLoading ? "লগইন হচ্ছে..." : "লগইন করুন"}
            {!isLoading && <ArrowIcon />}
          </button>
        </form>

        <AuthFooterLink text="নতুন অ্যাকাউন্ট দরকার?" href="/register" label="রেজিস্ট্রেশন" />
      </AuthShell>
    </PublicRoute>
  );
}

function getRedirectPath() {
  if (typeof window === "undefined") return "/";
  const redirect = new URLSearchParams(window.location.search).get("redirect");
  return redirect || "/";
}

const inputClassName =
  "mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#CC0000] focus:ring-4 focus:ring-red-100";

const primaryButtonClass =
  "flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#CC0000] to-[#8B0000] px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-red-900/20 transition hover:shadow-xl hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0";

function Field({
  label,
  error,
  icon,
  children,
}: {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-bold text-gray-700">
      <span className="flex items-center gap-2">
        {icon && <span className="text-[#CC0000]">{icon}</span>}
        {label}
      </span>
      {children}
      {error && <span className="mt-2 block text-xs font-medium text-[#CC0000]">{error}</span>}
    </label>
  );
}

function MailIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16v12H4z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7l8 6 8-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeWidth={2} d="M7 11V8a5 5 0 0110 0v3" />
      <path strokeLinejoin="round" strokeWidth={2} d="M6 11h12v10H6z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  );
}
