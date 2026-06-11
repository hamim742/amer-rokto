"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PublicRoute from "@/components/routes/PublicRoute";
import { useResetPasswordMutation } from "@/redux/features/auth/authApi";
import { clearResetFlow } from "@/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getApiErrorMessage } from "@/lib/auth";

const schema = z
  .object({
    newPassword: z.string().min(6, "নতুন পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে"),
    confirmPassword: z.string().min(1, "পাসওয়ার্ড নিশ্চিত করুন"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "পাসওয়ার্ড মিলছে না",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export default function ResetPasswordClient() {
  const resetToken = useAppSelector((state) => state.auth.resetToken);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  useEffect(() => {
    if (!resetToken) router.replace("/forgot-password");
  }, [resetToken, router]);

  const onSubmit = async (values: FormValues) => {
    if (!resetToken) return;

    try {
      const response = await resetPassword({
        resetToken,
        newPassword: values.newPassword,
      }).unwrap();
      dispatch(clearResetFlow());
      toast.success(response.message || "পাসওয়ার্ড সফলভাবে রিসেট হয়েছে।");
      router.push("/login");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "পাসওয়ার্ড রিসেট করা যায়নি।"));
    }
  };

  if (!resetToken) return null;

  return (
    <PublicRoute>
      <main className="min-h-screen bg-[#fff7f7] px-4 py-12">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto max-w-md rounded-lg border border-red-100 bg-white p-6 shadow-xl shadow-red-950/10 sm:p-8"
        >
          <h1 className="text-2xl font-extrabold text-gray-900">নতুন পাসওয়ার্ড দিন</h1>

          <div className="mt-6 space-y-5">
            <Field label="নতুন পাসওয়ার্ড" error={errors.newPassword?.message}>
              <input {...register("newPassword")} type="password" className={inputClassName} />
            </Field>
            <Field label="পাসওয়ার্ড নিশ্চিত করুন" error={errors.confirmPassword?.message}>
              <input {...register("confirmPassword")} type="password" className={inputClassName} />
            </Field>
          </div>

          <button type="submit" disabled={isLoading} className={primaryButtonClass}>
            {isLoading ? "রিসেট হচ্ছে..." : "পাসওয়ার্ড রিসেট করুন"}
          </button>
        </form>
      </main>
    </PublicRoute>
  );
}

const inputClassName =
  "mt-2 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#CC0000] focus:ring-4 focus:ring-red-100";

const primaryButtonClass =
  "mt-6 w-full rounded-lg bg-[#CC0000] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#8B0000] disabled:cursor-not-allowed disabled:opacity-70";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-bold text-gray-700">
      {label}
      {children}
      {error && <span className="mt-2 block text-xs font-medium text-[#CC0000]">{error}</span>}
    </label>
  );
}
