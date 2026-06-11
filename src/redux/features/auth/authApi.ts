import { baseApi } from "@/redux/api/baseApi";
import type { AuthUser } from "./authSlice";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthData = {
  user: AuthUser;
  accessToken: string;
};

export type ResetOtpData = {
  resetToken: string;
};

export type ProfileUpdatePayload = Partial<
  Pick<
    AuthUser,
    | "name"
    | "bloodGroup"
    | "location"
    | "district"
    | "upazila"
    | "contact"
    | "emergencyContact"
    | "gender"
    | "age"
    | "dateOfBirth"
    | "lastDonation"
    | "weight"
    | "hasDisease"
    | "diseaseDetails"
    | "profileImage"
    | "isAvailable"
    | "isNotified"
  >
>;

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation<ApiResponse<unknown>, RegisterPayload>({
      query: (body) => ({
        url: "/user/register",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
    verifyRegisterOtp: builder.mutation<
      ApiResponse<AuthData>,
      { email: string; otp: string }
    >({
      query: (body) => ({
        url: "/user/verify-otp",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
    resendRegisterOtp: builder.mutation<
      ApiResponse<unknown>,
      { email: string }
    >({
      query: (body) => ({
        url: "/user/resend-otp",
        method: "POST",
        body,
      }),
    }),
    login: builder.mutation<ApiResponse<AuthData>, LoginPayload>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
    forgotPassword: builder.mutation<ApiResponse<unknown>, { email: string }>({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),
    verifyResetOtp: builder.mutation<
      ApiResponse<ResetOtpData>,
      { email: string; otp: string }
    >({
      query: (body) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation<
      ApiResponse<unknown>,
      { resetToken: string; newPassword: string }
    >({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "POST",
        body,
      }),
    }),
    changePassword: builder.mutation<
      ApiResponse<unknown>,
      { oldPassword: string; newPassword: string }
    >({
      query: (body) => ({
        url: "/user/change-password",
        method: "POST",
        body,
      }),
    }),
    updateProfile: builder.mutation<ApiResponse<AuthUser>, ProfileUpdatePayload>({
      query: (body) => ({
        url: "/user/profile",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Auth", "Donor"],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useVerifyRegisterOtpMutation,
  useResendRegisterOtpMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useVerifyResetOtpMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useUpdateProfileMutation,
} = authApi;
