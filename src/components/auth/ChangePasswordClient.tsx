"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ProtectedRoute from "@/components/routes/ProtectedRoute";
import { useChangePasswordMutation } from "@/redux/features/auth/authApi";
import { getApiErrorMessage } from "@/lib/auth";

const schema = z
  .object({
    oldPassword: z.string().min(1, "পুরনো পাসওয়ার্ড আবশ্যক"),
    newPassword: z.string().min(6, "নতুন পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে"),
    confirmPassword: z.string().min(1, "পাসওয়ার্ড নিশ্চিত করুন"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "পাসওয়ার্ড মিলছে না",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export default function ChangePasswordClient() {
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const response = await changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      }).unwrap();
      reset();
      toast.success(response.message || "পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে।");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "পাসওয়ার্ড পরিবর্তন করা যায়নি।"));
    }
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#f8fafc] px-4 py-8 sm:py-10">
        <section className="mx-auto max-w-5xl">
          <Link href="/dashboard" className={backLinkClassName}>
            <ArrowLeftIcon />
            ড্যাশবোর্ডে ফিরে যান
          </Link>

          <div className="mt-5 grid overflow-hidden rounded-2xl border border-red-100 bg-white shadow-xl shadow-red-950/5 lg:grid-cols-[360px_1fr]">
            <aside className="bg-gradient-to-br from-[#8B0000] via-[#CC0000] to-[#FF2222] p-6 text-white sm:p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                <LockIcon />
              </div>
              <h1 className="mt-6 text-2xl font-extrabold leading-tight sm:text-3xl">
                পাসওয়ার্ড পরিবর্তন
              </h1>
              <p className="mt-3 text-sm leading-6 text-white/80">
                আপনার অ্যাকাউন্ট নিরাপদ রাখতে শক্তিশালী এবং আলাদা পাসওয়ার্ড
                ব্যবহার করুন।
              </p>

              <div className="mt-8 space-y-3">
                {[
                  "কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড দিন",
                  "অন্য কোথাও ব্যবহার করা পাসওয়ার্ড এড়িয়ে চলুন",
                  "পাসওয়ার্ড কারও সঙ্গে শেয়ার করবেন না",
                ].map((tip) => (
                  <div key={tip} className="flex items-start gap-3 rounded-xl bg-white/10 p-3 text-sm text-white/85 ring-1 ring-white/15">
                    <CheckIcon />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </aside>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#CC0000]">
                  নিরাপত্তা
                </p>
                <h2 className="mt-2 text-2xl font-extrabold text-gray-950">
                  নতুন পাসওয়ার্ড সেট করুন
                </h2>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  পরিবর্তন নিশ্চিত করতে পুরনো পাসওয়ার্ড এবং নতুন পাসওয়ার্ড লিখুন।
                </p>
              </div>

              <div className="mt-7 space-y-5">
                <Field label="পুরনো পাসওয়ার্ড" error={errors.oldPassword?.message}>
                  <input {...register("oldPassword")} type="password" className={inputClassName} />
                </Field>
                <Field label="নতুন পাসওয়ার্ড" error={errors.newPassword?.message}>
                  <input {...register("newPassword")} type="password" className={inputClassName} />
                </Field>
                <Field label="পাসওয়ার্ড নিশ্চিত করুন" error={errors.confirmPassword?.message}>
                  <input {...register("confirmPassword")} type="password" className={inputClassName} />
                </Field>
              </div>

              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
                <Link href="/dashboard" className={secondaryButtonClassName}>
                  বাতিল
                </Link>
                <button type="submit" disabled={isLoading} className={primaryButtonClassName}>
                  {isLoading ? "পরিবর্তন হচ্ছে..." : "পাসওয়ার্ড পরিবর্তন করুন"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}

const inputClassName =
  "mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#CC0000] focus:ring-4 focus:ring-red-100";

const backLinkClassName =
  "inline-flex items-center gap-2 rounded-full border border-red-100 bg-white px-4 py-2 text-sm font-bold text-[#CC0000] shadow-sm transition hover:border-red-200 hover:bg-red-50";

const primaryButtonClassName =
  "rounded-xl bg-gradient-to-r from-[#CC0000] to-[#8B0000] px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-red-900/15 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0";

const secondaryButtonClassName =
  "rounded-xl border border-gray-200 bg-white px-6 py-3 text-center text-sm font-extrabold text-gray-700 transition hover:border-red-100 hover:bg-red-50 hover:text-[#CC0000]";

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
      {error && <span className="mt-2 block text-xs font-semibold text-[#CC0000]">{error}</span>}
    </label>
  );
}

function ArrowLeftIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M15 19l-7-7 7-7M8 12h12" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeWidth={2} d="M7 11V8a5 5 0 0110 0v3" />
      <path strokeLinejoin="round" strokeWidth={2} d="M6 11h12v10H6z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="mt-0.5 h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.6} d="M20 6L9 17l-5-5" />
    </svg>
  );
}
