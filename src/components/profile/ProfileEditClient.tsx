"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ProtectedRoute from "@/components/routes/ProtectedRoute";
import { useUpdateProfileMutation } from "@/redux/features/auth/authApi";
import { updateUser, type AuthUser } from "@/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getApiErrorMessage, isProfileComplete } from "@/lib/auth";

const profileSchema = z.object({
  name: z.string().optional(),
  bloodGroup: z.string().min(1, "রক্তের গ্রুপ আবশ্যক"),
  contact: z.string().min(1, "যোগাযোগ নম্বর আবশ্যক"),
  district: z.string().min(1, "জেলা আবশ্যক"),
  upazila: z.string().min(1, "উপজেলা আবশ্যক"),
  gender: z.string().min(1, "লিঙ্গ আবশ্যক"),
  age: z.coerce.number().min(1, "বয়স আবশ্যক"),
  location: z.string().optional(),
  emergencyContact: z.string().optional(),
  dateOfBirth: z.string().optional(),
  lastDonation: z.string().optional(),
  weight: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.coerce.number().min(1).optional()
  ),
  hasDisease: z.boolean().optional(),
  diseaseDetails: z.string().optional(),
  profileImage: z.string().optional(),
  isAvailable: z.boolean().optional(),
  isNotified: z.boolean().optional(),
});

type ProfileFormInput = z.input<typeof profileSchema>;
type ProfileFormValues = z.output<typeof profileSchema>;

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const genders = [
  { value: "male", label: "পুরুষ" },
  { value: "female", label: "মহিলা" },
  { value: "other", label: "অন্যান্য" },
];

export default function ProfileEditClient() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProfileFormInput, unknown, ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: getDefaults(user),
  });

  const hasDisease = watch("hasDisease");
  const complete = isProfileComplete(user);
  const progress = getProfileProgress(user);

  useEffect(() => {
    reset(getDefaults(user));
  }, [reset, user]);

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      const payload = cleanProfilePayload(values);
      const response = await updateProfile(payload).unwrap();
      dispatch(updateUser(response.data));
      toast.success(response.message || "প্রোফাইল সফলভাবে আপডেট হয়েছে।");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "প্রোফাইল আপডেট করা যায়নি।"));
    }
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#f8fafc] px-4 py-8 sm:py-10">
        <section className="mx-auto max-w-6xl">
          <Link href="/dashboard" className={backLinkClassName}>
            <ArrowLeftIcon />
            ড্যাশবোর্ডে ফিরে যান
          </Link>

          <div className="mt-5 rounded-2xl border border-red-100 bg-white shadow-xl shadow-red-950/5">
            <div className="border-b border-red-50 px-5 py-6 sm:px-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#CC0000]">
                    ডোনার প্রোফাইল
                  </p>
                  <h1 className="mt-2 text-2xl font-extrabold text-gray-950 sm:text-3xl">
                    আপনার তথ্য সম্পূর্ণ ও আপডেট রাখুন
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                    জরুরি সময়ে সঠিক ডোনার খুঁজে পেতে রক্তের গ্রুপ, লোকেশন,
                    যোগাযোগ এবং স্বাস্থ্য তথ্য পরিষ্কারভাবে পূরণ করুন।
                  </p>
                </div>
                <span
                  className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${
                    complete
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                      : "bg-red-50 text-[#CC0000] ring-1 ring-red-100"
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      complete ? "bg-emerald-500" : "bg-[#CC0000]"
                    }`}
                  />
                  {complete ? "প্রোফাইল সম্পূর্ণ" : "প্রোফাইল অসম্পূর্ণ"}
                </span>
              </div>
            </div>

            <div className="grid gap-0 lg:grid-cols-[320px_1fr]">
              <aside className="border-b border-red-50 bg-red-50/40 p-5 sm:p-8 lg:border-b-0 lg:border-r">
                <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#CC0000] to-[#8B0000] text-2xl font-extrabold text-white shadow-lg shadow-red-900/20">
                      {user?.name?.charAt(0) || "ড"}
                    </div>
                    <div className="min-w-0">
                      <h2 className="truncate text-lg font-extrabold text-gray-950">
                        {user?.name || "ডোনার"}
                      </h2>
                      <p className="truncate text-sm text-gray-500">{user?.email || "ইমেইল নেই"}</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="mb-2 flex items-center justify-between text-xs font-bold text-gray-500">
                      <span>প্রোফাইল অগ্রগতি</span>
                      <span className="text-[#CC0000]">{progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-red-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#CC0000] to-[#8B0000]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {requiredItems(user).map((item) => (
                      <div key={item.label} className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium text-gray-600">{item.label}</span>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold ${
                            item.done
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-[#CC0000]"
                          }`}
                        >
                          {item.done ? "সম্পন্ন" : "বাকি"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>

              <form onSubmit={handleSubmit(onSubmit)} className="p-5 sm:p-8">
                {!complete && (
                  <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-[#8B0000]">
                    ডোনার-সংক্রান্ত কাজ ব্যবহার করার আগে আবশ্যক তথ্যগুলো পূরণ করুন।
                  </div>
                )}

                <FormSection
                  title="ব্যক্তিগত তথ্য"
                  description="নাম, বয়স ও পরিচয় সম্পর্কিত তথ্য আপডেট করুন।"
                >
                  <Field label="নাম" error={errors.name?.message}>
                    <input {...register("name")} className={inputClassName} />
                  </Field>
                  <Field label="লিঙ্গ" error={errors.gender?.message}>
                    <select {...register("gender")} className={inputClassName}>
                      <option value="">লিঙ্গ নির্বাচন করুন</option>
                      {genders.map((gender) => (
                        <option key={gender.value} value={gender.value}>
                          {gender.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="বয়স" error={errors.age?.message}>
                    <input {...register("age")} type="number" min={1} className={inputClassName} />
                  </Field>
                  <Field label="জন্মতারিখ" error={errors.dateOfBirth?.message}>
                    <input {...register("dateOfBirth")} type="date" className={inputClassName} />
                  </Field>
                </FormSection>

                <FormSection
                  title="রক্ত ও যোগাযোগ"
                  description="রক্তের গ্রুপ, ফোন নম্বর এবং অবস্থান যত নির্ভুল হবে, মিল খুঁজে পাওয়া তত দ্রুত হবে।"
                >
                  <Field label="রক্তের গ্রুপ" error={errors.bloodGroup?.message}>
                    <select {...register("bloodGroup")} className={inputClassName}>
                      <option value="">রক্তের গ্রুপ নির্বাচন করুন</option>
                      {bloodGroups.map((group) => (
                        <option key={group} value={group}>
                          {group}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="যোগাযোগ নম্বর" error={errors.contact?.message}>
                    <input {...register("contact")} className={inputClassName} placeholder="01XXXXXXXXX" />
                  </Field>
                  <Field label="জরুরি যোগাযোগ" error={errors.emergencyContact?.message}>
                    <input {...register("emergencyContact")} className={inputClassName} placeholder="01XXXXXXXXX" />
                  </Field>
                  <Field label="জেলা" error={errors.district?.message}>
                    <input {...register("district")} className={inputClassName} />
                  </Field>
                  <Field label="উপজেলা" error={errors.upazila?.message}>
                    <input {...register("upazila")} className={inputClassName} />
                  </Field>
                  <Field label="লোকেশন" error={errors.location?.message}>
                    <input {...register("location")} className={inputClassName} placeholder="এলাকা বা হাসপাতালের কাছাকাছি" />
                  </Field>
                </FormSection>

                <FormSection
                  title="স্বাস্থ্য ও উপলব্ধতা"
                  description="ডোনার হিসেবে কখন যোগাযোগ করা যাবে এবং স্বাস্থ্য সম্পর্কিত গুরুত্বপূর্ণ তথ্য দিন।"
                >
                  <Field label="ওজন" error={errors.weight?.message}>
                    <input {...register("weight")} type="number" min={1} className={inputClassName} />
                  </Field>
                  <Field label="সর্বশেষ রক্তদান" error={errors.lastDonation?.message}>
                    <input {...register("lastDonation")} type="date" className={inputClassName} />
                  </Field>
                  <Field label="প্রোফাইল ছবির লিংক" error={errors.profileImage?.message}>
                    <input {...register("profileImage")} className={inputClassName} placeholder="https://..." />
                  </Field>

                  <div className="grid gap-3 sm:grid-cols-3 md:col-span-2">
                    <CheckField label="অনুরোধের জন্য উপলব্ধ">
                      <input {...register("isAvailable")} type="checkbox" className={checkboxClassName} />
                    </CheckField>
                    <CheckField label="নোটিফিকেশন পাবেন">
                      <input {...register("isNotified")} type="checkbox" className={checkboxClassName} />
                    </CheckField>
                    <CheckField label="কোনো রোগ আছে">
                      <input {...register("hasDisease")} type="checkbox" className={checkboxClassName} />
                    </CheckField>
                  </div>

                  {hasDisease && (
                    <div className="md:col-span-2">
                      <Field label="রোগের বিস্তারিত" error={errors.diseaseDetails?.message}>
                        <textarea
                          {...register("diseaseDetails")}
                          rows={4}
                          className={`${inputClassName} resize-none`}
                          placeholder="প্রয়োজনীয় স্বাস্থ্য তথ্য লিখুন"
                        />
                      </Field>
                    </div>
                  )}
                </FormSection>

                <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
                  <Link href="/dashboard" className={secondaryButtonClassName}>
                    বাতিল
                  </Link>
                  <button type="submit" disabled={isLoading} className={primaryButtonClassName}>
                    {isLoading ? "সংরক্ষণ হচ্ছে..." : "প্রোফাইল সংরক্ষণ করুন"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}

function getDefaults(user: AuthUser | null | undefined) {
  return {
    name: user?.name ?? "",
    bloodGroup: user?.bloodGroup ?? "",
    contact: user?.contact ?? user?.phone ?? "",
    district: user?.district ?? "",
    upazila: user?.upazila ?? "",
    gender: user?.gender ?? "",
    age: user?.age ?? "",
    location: user?.location ?? "",
    emergencyContact: user?.emergencyContact ?? "",
    dateOfBirth: dateInputValue(user?.dateOfBirth),
    lastDonation: dateInputValue(user?.lastDonation),
    weight: user?.weight ?? "",
    hasDisease: Boolean(user?.hasDisease),
    diseaseDetails: user?.diseaseDetails ?? "",
    profileImage: user?.profileImage ?? "",
    isAvailable: Boolean(user?.isAvailable),
    isNotified: Boolean(user?.isNotified),
  };
}

function cleanProfilePayload(values: ProfileFormValues) {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => value !== "" && value !== undefined)
  ) as ProfileFormValues;
}

function dateInputValue(value?: string) {
  return value ? value.slice(0, 10) : "";
}

function requiredItems(user: AuthUser | null | undefined) {
  return [
    { label: "রক্তের গ্রুপ", done: Boolean(user?.bloodGroup) },
    { label: "যোগাযোগ", done: Boolean(user?.contact || user?.phone) },
    { label: "জেলা", done: Boolean(user?.district) },
    { label: "উপজেলা", done: Boolean(user?.upazila) },
    { label: "লিঙ্গ", done: Boolean(user?.gender) },
    { label: "বয়স", done: Boolean(user?.age) },
  ];
}

function getProfileProgress(user: AuthUser | null | undefined) {
  const items = requiredItems(user);
  const completed = items.filter((item) => item.done).length;
  return Math.round((completed / items.length) * 100);
}

const inputClassName =
  "mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#CC0000] focus:ring-4 focus:ring-red-100";

const checkboxClassName =
  "h-4 w-4 rounded border-gray-300 text-[#CC0000] focus:ring-[#CC0000]";

const backLinkClassName =
  "inline-flex items-center gap-2 rounded-full border border-red-100 bg-white px-4 py-2 text-sm font-bold text-[#CC0000] shadow-sm transition hover:border-red-200 hover:bg-red-50";

const primaryButtonClassName =
  "rounded-xl bg-gradient-to-r from-[#CC0000] to-[#8B0000] px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-red-900/15 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0";

const secondaryButtonClassName =
  "rounded-xl border border-gray-200 bg-white px-6 py-3 text-center text-sm font-extrabold text-gray-700 transition hover:border-red-100 hover:bg-red-50 hover:text-[#CC0000]";

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-gray-100 py-6 first:pt-0 last:border-b-0">
      <div className="mb-5">
        <h2 className="text-lg font-extrabold text-gray-950">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-gray-500">{description}</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2">{children}</div>
    </section>
  );
}

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

function CheckField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex min-h-14 items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 transition hover:border-red-100 hover:bg-red-50">
      {children}
      {label}
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
