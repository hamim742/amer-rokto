"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PublicRoute from "@/components/routes/PublicRoute";
import {
  useResendRegisterOtpMutation,
  useVerifyRegisterOtpMutation,
} from "@/redux/features/auth/authApi";
import {
  clearPendingVerifyEmail,
  setCredentials,
} from "@/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getApiErrorMessage } from "@/lib/auth";
import AuthShell from "./AuthShell";

const otpSchema = z.object({
  otp: z.string().length(6, "ওটিপি ঠিক ৬ অক্ষরের হতে হবে"),
});

type OtpFormValues = z.infer<typeof otpSchema>;

export default function VerifyOtpClient() {
  const email = useAppSelector((state) => state.auth.pendingVerifyEmail);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [cooldown, setCooldown] = useState(0);
  const [verifyOtp, { isLoading }] = useVerifyRegisterOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendRegisterOtpMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  useEffect(() => {
    if (!email) router.replace("/register");
  }, [email, router]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  const onSubmit = async (values: OtpFormValues) => {
    if (!email) return;

    try {
      const response = await verifyOtp({ email, otp: values.otp }).unwrap();
      dispatch(setCredentials(response.data));
      dispatch(clearPendingVerifyEmail());
      toast.success(response.message || "ইমেইল সফলভাবে যাচাই হয়েছে।");
      router.push("/dashboard");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "ওটিপি যাচাই হয়নি।"));
    }
  };

  const handleResend = async () => {
    if (!email || cooldown > 0) return;

    try {
      const response = await resendOtp({ email }).unwrap();
      toast.success(response.message || "ওটিপি আবার পাঠানো হয়েছে।");
      setCooldown(60);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "ওটিপি আবার পাঠানো যায়নি।"));
    }
  };

  if (!email) return null;

  return (
    <PublicRoute>
      <AuthShell
        badge="ইমেইল যাচাই"
        title="আর একটি ধাপ"
        highlight="ইমেইল যাচাই করুন"
        description="আপনার ইমেইলে একটি ওটিপি পাঠানো হয়েছে। অ্যাকাউন্ট চালু করতে, সেশন সংরক্ষণ করতে এবং ড্যাশবোর্ডে যেতে এটি যাচাই করুন।"
        panelTitle="ওটিপি লিখুন"
        panelDescription={`${email} ঠিকানায় পাঠানো ৬ অক্ষরের কোডটি ব্যবহার করুন।`}
        activeStep={2}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <label className="block text-sm font-bold text-gray-700">
            <span className="flex items-center gap-2">
              <OtpIcon />
              ওটিপি কোড
            </span>
            <input
              {...register("otp")}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              className={inputClassName}
              placeholder="123456"
            />
            {errors.otp && (
              <span className="mt-2 block text-xs font-medium text-[#CC0000]">
                {errors.otp.message}
              </span>
            )}
          </label>

          <div className="rounded-2xl border border-red-100 bg-red-50/70 p-4">
            <p className="text-sm leading-6 text-gray-600">
              যাচাইয়ের পর আপনি অ্যাপ ব্যবহার করতে পারবেন। ডোনার প্রোফাইল অসম্পূর্ণ
              থাকলে ড্যাশবোর্ডে পূরণের বার্তা দেখাবে।
            </p>
          </div>

          <button type="submit" disabled={isLoading} className={primaryButtonClass}>
            {isLoading ? "যাচাই হচ্ছে..." : "ওটিপি যাচাই করুন"}
            {!isLoading && <ArrowIcon />}
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={isResending || cooldown > 0}
            className="w-full rounded-2xl border border-[#CC0000] bg-white px-5 py-3 text-sm font-bold text-[#CC0000] transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cooldown > 0 ? `${cooldown} সেকেন্ড পরে আবার পাঠান` : isResending ? "পাঠানো হচ্ছে..." : "ওটিপি আবার পাঠান"}
          </button>
        </form>
      </AuthShell>
    </PublicRoute>
  );
}

const inputClassName =
  "mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-4 text-center text-2xl font-extrabold tracking-[0.45em] text-gray-900 outline-none transition focus:border-[#CC0000] focus:ring-4 focus:ring-red-100";

const primaryButtonClass =
  "flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#CC0000] to-[#8B0000] px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-red-900/20 transition hover:shadow-xl hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0";

function OtpIcon() {
  return (
    <svg className="h-4 w-4 text-[#CC0000]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
      <path strokeLinecap="round" strokeWidth={2} d="M8 11V8a4 4 0 118 0v3" />
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
