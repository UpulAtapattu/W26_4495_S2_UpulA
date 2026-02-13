import { PaginatedResponse } from "@/app/types/api";
import { apiClient } from "./client";
import { Staff } from "@/app/types/staff";

export function getStaff() {
  return apiClient<PaginatedResponse<Staff>>("/api/users");
}
