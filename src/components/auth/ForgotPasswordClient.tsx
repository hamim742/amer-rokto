"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PublicRoute from "@/components/routes/PublicRoute";
import { useForgotPasswordMutation } from "@/redux/features/auth/authApi";
import { setResetEmail } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { getApiErrorMessage } from "@/lib/auth";

const schema = z.object({
  email: z.string().email("সঠিক ইমেইল লিখুন"),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordClient() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const response = await forgotPassword(values).unwrap();
      dispatch(setResetEmail(values.email));
      toast.success(response.message || "পাসওয়ার্ড রিসেট ওটিপি পাঠানো হয়েছে।");
      router.push("/verify-reset-otp");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "পাসওয়ার্ড রিসেট শুরু করা যায়নি।"));
    }
  };

  return (
    <PublicRoute>
      <main className="min-h-screen bg-[#fff7f7] px-4 py-12">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto max-w-md rounded-lg border border-red-100 bg-white p-6 shadow-xl shadow-red-950/10 sm:p-8"
        >
          <h1 className="text-2xl font-extrabold text-gray-900">পাসওয়ার্ড ভুলে গেছেন</h1>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            আপনার ইমেইল লিখুন, আমরা রিসেট ওটিপি পাঠাব।
          </p>

          <label className="mt-6 block text-sm font-bold text-gray-700">
            ইমেইল
            <input
              {...register("email")}
              type="email"
              className={inputClassName}
              placeholder="name@email.com"
            />
            {errors.email && (
              <span className="mt-2 block text-xs font-medium text-[#CC0000]">
                {errors.email.message}
              </span>
            )}
          </label>

          <button type="submit" disabled={isLoading} className={primaryButtonClass}>
            {isLoading ? "পাঠানো হচ্ছে..." : "রিসেট ওটিপি পাঠান"}
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
