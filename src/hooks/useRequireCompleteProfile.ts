"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { isProfileComplete } from "@/lib/auth";
import { useAppSelector } from "@/redux/hooks";

export function useRequireCompleteProfile() {
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();

  return () => {
    if (isProfileComplete(user)) {
      return true;
    }

    toast.error("প্রথমে আপনার ডোনার প্রোফাইল সম্পূর্ণ করুন।");
    router.push("/profile/edit");
    return false;
  };
}
