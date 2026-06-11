"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PublicRoute from "@/components/routes/PublicRoute";
import { useRegisterUserMutation } from "@/redux/features/auth/authApi";
import { setPendingVerifyEmail } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { getApiErrorMessage, passwordRegex } from "@/lib/auth";
import AuthShell, { AuthFooterLink } from "@/components/auth/AuthShell";

const registerSchema = z.object({
  name: z.string().min(1, "নাম আবশ্যক"),
  email: z.string().email("সঠিক ইমেইল লিখুন"),
  password: z
    .string()
    .regex(
      passwordRegex,
      "৮ বা তার বেশি অক্ষর দিন; বড় হাতের অক্ষর, ছোট হাতের অক্ষর, সংখ্যা এবং @$!%*?&^# থাকতে হবে"
    ),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterClient() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      const response = await registerUser(values).unwrap();
      dispatch(setPendingVerifyEmail(values.email));
      toast.success(response.message || "নিবন্ধন সফল হয়েছে। ওটিপির জন্য আপনার ইমেইল দেখুন।");
      router.push("/verify-otp");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "নিবন্ধন সম্পন্ন হয়নি। আবার চেষ্টা করুন।"));
    }
  };

  return (
    <PublicRoute>
      <AuthShell
        badge="বিনামূল্যে ইমেইল যাচাইকৃত অ্যাকাউন্ট"
        title="আমার রক্তে যোগ দিন"
        highlight="তিনটি নিরাপদ ধাপে"
        description="শুধু নাম, ইমেইল ও পাসওয়ার্ড দিয়ে অ্যাকাউন্ট তৈরি করুন। রক্তের গ্রুপ, যোগাযোগ, জেলা ও স্বাস্থ্য তথ্য পরে প্রোফাইল থেকে যোগ করা হবে।"
        panelTitle="অ্যাকাউন্ট তৈরি করুন"
        panelDescription="নিবন্ধনের সময় ডোনার প্রোফাইলের তথ্য লাগবে না।"
        activeStep={1}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Field label="পূর্ণ নাম" error={errors.name?.message} icon={<UserIcon />}>
            <input {...register("name")} className={inputClassName} placeholder="আপনার নাম" />
          </Field>

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
              placeholder="শক্তিশালী পাসওয়ার্ড"
            />
          </Field>

          <div className="rounded-2xl border border-red-100 bg-red-50/70 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-[#CC0000]">
              ওটিপির পর প্রোফাইল পূরণ করবেন
            </p>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              লগইনের পর প্রোফাইল পেজ থেকে রক্তের গ্রুপ, যোগাযোগ, জেলা, উপজেলা,
              লিঙ্গ, বয়স ও চিকিৎসা তথ্য যোগ করা যাবে।
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={primaryButtonClass}
          >
            {isLoading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
            {!isLoading && <ArrowIcon />}
          </button>
        </form>

        <AuthFooterLink text="আগে থেকেই অ্যাকাউন্ট আছে?" href="/login" label="লগইন" />
      </AuthShell>
    </PublicRoute>
  );
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

function UserIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeWidth={2} d="M20 21c0-3.3-3.6-6-8-6s-8 2.7-8 6" />
      <path strokeWidth={2} d="M12 12a4 4 0 100-8 4 4 0 000 8z" />
    </svg>
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
