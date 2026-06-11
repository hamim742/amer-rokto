import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

const rawBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ||
  process.env.VITE_API_BASE_URL?.trim() ||
  "";

const normalizedBaseUrl = rawBaseUrl.replace(/\/$/, "");
const apiBaseUrl = normalizedBaseUrl.endsWith("/api/v1")
  ? normalizedBaseUrl
  : `${normalizedBaseUrl}/api/v1`;

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Auth", "Donor", "BloodBank", "EmergencyRequest"],
  endpoints: (builder) => ({
    getDonors: builder.query<DonorSummary[], DonorQueryParams | void>({
      query: (params) => ({
        url: "/donors",
        params: params ?? undefined,
      }),
      providesTags: ["Donor"],
    }),
    getBloodBanks: builder.query<BloodBankSummary[], BloodBankQueryParams | void>(
      {
        query: (params) => ({
          url: "/blood-banks",
          params: params ?? undefined,
        }),
        providesTags: ["BloodBank"],
      }
    ),
  }),
});

export const { useGetDonorsQuery, useGetBloodBanksQuery } = baseApi;

type DonorQueryParams = {
  bloodGroup?: string;
  district?: string;
  area?: string;
  availableOnly?: boolean;
};

type DonorSummary = {
  id: string;
  name: string;
  bloodGroup: string;
  district: string;
  area?: string;
  available?: boolean;
};

type BloodBankQueryParams = {
  district?: string;
  bloodGroup?: string;
};

type BloodBankSummary = {
  id: string;
  name: string;
  district: string;
  address?: string;
  phone?: string;
};
