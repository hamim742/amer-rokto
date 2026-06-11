"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PublicRoute from "@/components/routes/PublicRoute";
import { useVerifyResetOtpMutation } from "@/redux/features/auth/authApi";
import { setResetToken } from "@/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getApiErrorMessage } from "@/lib/auth";
import AuthShell from "./AuthShell";

const schema = z.object({
  otp: z.string().length(6, "ওটিপি ঠিক ৬ অক্ষরের হতে হবে"),
});

type FormValues = z.infer<typeof schema>;

export default function VerifyResetOtpClient() {
  const email = useAppSelector((state) => state.auth.resetEmail);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [verifyResetOtp, { isLoading }] = useVerifyResetOtpMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { otp: "" },
  });

  useEffect(() => {
    if (!email) router.replace("/forgot-password");
  }, [email, router]);

  const onSubmit = async (values: FormValues) => {
    if (!email) return;

    try {
      const response = await verifyResetOtp({ email, otp: values.otp }).unwrap();
      dispatch(setResetToken(response.data.resetToken));
      toast.success(response.message || "ওটিপি যাচাই হয়েছে।");
      router.push("/reset-password");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "ওটিপি যাচাই হয়নি।"));
    }
  };

  if (!email) return null;

  return (
    <PublicRoute>
      <AuthShell
        badge="পাসওয়ার্ড রিসেট যাচাই"
        title="রিসেট ওটিপি"
        highlight="নিরাপদে যাচাই করুন"
        description="আগে আপনার রিসেট ওটিপি নিশ্চিত করুন। রিসেট টোকেন অস্থায়ী অ্যাপ স্টেটে থাকবে এবং লিংকে দেখা যাবে না।"
        panelTitle="রিসেট ওটিপি"
        panelDescription={`${email} ঠিকানায় পাঠানো ৬ অক্ষরের ওটিপি লিখুন।`}
        activeStep={2}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <label className="mt-6 block text-sm font-bold text-gray-700">
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

          <button type="submit" disabled={isLoading} className={primaryButtonClass}>
            {isLoading ? "যাচাই হচ্ছে..." : "ওটিপি যাচাই করুন"}
            {!isLoading && <ArrowIcon />}
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
