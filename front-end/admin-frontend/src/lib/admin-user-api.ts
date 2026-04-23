import { adminFetch } from "@/lib/admin-api";

export type AdminUserRecord = {
  id: string;
  name: string;
  phoneNumber: string;
  isVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  addressesCount: number;
};

export type AdminUserListResponse = {
  items: AdminUserRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
  };
};

const parseResponse = async <T>(response: Response): Promise<T> => {
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.message || "API request failed");
  }
  return payload.data as T;
};

export async function getUsers(
  page: number = 1,
  limit: number = 50,
): Promise<AdminUserListResponse> {
  const response = await adminFetch(
    `/admin/users?page=${page}&limit=${limit}`,
    {
      cache: "no-store",
    },
  );

  return parseResponse<AdminUserListResponse>(response);
}

export async function getUserById(userId: string): Promise<AdminUserRecord> {
  const response = await adminFetch(`/admin/users/${userId}`, {
    cache: "no-store",
  });

  return parseResponse<AdminUserRecord>(response);
}

export async function updateUser(
  userId: string,
  user: Partial<Pick<AdminUserRecord, "name" | "phoneNumber" | "isVerified">>,
): Promise<AdminUserRecord> {
  const response = await adminFetch(`/admin/users/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  return parseResponse<AdminUserRecord>(response);
}

export async function deleteUser(userId: string): Promise<void> {
  const response = await adminFetch(`/admin/users/${userId}`, {
    method: "DELETE",
  });

  await parseResponse<void>(response);
}
