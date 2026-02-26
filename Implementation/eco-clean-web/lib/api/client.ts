import { Client } from "@/app/components/tables/ClientTable";
import { ListResponse } from "@/app/types/api";
import { Address } from "@/types";

export type GetClientsParams = {
  q?: string;
  page?: number;
  limit?: number;
};

export interface ApiListResponse<T> {
  data: T[];
}

export interface ClientsResponse {
  data: Client[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AddressResponse {
  id: string;
  street1: string;
  city: string;
  province: string;
}

export interface StaffResponse {
  id: string;
  name: string;
  email: string;
  role: string;
}

type ApiClientOptions<TBody = unknown> = Omit<RequestInit, "body"> & {
  body?: TBody;
};

type ApiErrorShape = { error?: string };

export async function apiClient<TResponse, TBody = unknown>(
  url: string,
  options: ApiClientOptions<TBody> = {},
): Promise<TResponse> {
  const { body, headers, ...rest } = options;

  const res = await fetch(url, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const err = (data as ApiErrorShape | null)?.error;
    throw new Error(err || "Request failed");
  }

  return data as TResponse;
}
export function getClients(query: string) {
  return apiClient<ClientsResponse>(
    `/api/clients?q=${encodeURIComponent(query)}`,
  );
}

export function getClientAddresses(clientId: string) {
  return apiClient<ListResponse<Address>>(`/api/clients/${clientId}/addresses`);
}
