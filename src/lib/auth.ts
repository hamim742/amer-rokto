import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";
import type { AuthUser } from "@/redux/features/auth/authSlice";

export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#]).{8,}$/;

export function isProfileComplete(user: AuthUser | null | undefined) {
  return Boolean(
    user?.bloodGroup &&
      user?.contact &&
      user?.district &&
      user?.upazila &&
      user?.gender &&
      user?.age
  );
}

export function getApiErrorMessage(
  error: FetchBaseQueryError | SerializedError | unknown,
  fallback = "কিছু ভুল হয়েছে। আবার চেষ্টা করুন।"
) {
  if (isFetchBaseQueryError(error)) {
    const data = error.data;

    if (typeof data === "string") {
      return data.includes("<!DOCTYPE html>")
        ? "API endpoint পাওয়া যায়নি। NEXT_PUBLIC_API_BASE_URL ঠিক আছে কিনা দেখুন।"
        : data;
    }

    if (isRecord(data)) {
      const message = data.message ?? data.error;
      if (typeof message === "string") return message;
    }
  }

  if (isSerializedError(error) && error.message) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function isUnverifiedError(error: unknown) {
  const message = getApiErrorMessage(error, "").toLowerCase();
  return message.includes("verify") || message.includes("verified") || message.includes("otp");
}

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return isRecord(error) && "status" in error;
}

function isSerializedError(error: unknown): error is SerializedError {
  return isRecord(error) && "message" in error;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
