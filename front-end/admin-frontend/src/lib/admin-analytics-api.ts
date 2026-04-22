export type AdminOverviewStat = {
  title: string;
  value: string;
  delta: string;
  tone: "positive" | "negative" | "warning";
  detail: string;
};

export type AdminRevenueSeriesItem = {
  label: string;
  amount: number;
};

export type AdminChannelPerformance = {
  name: string;
  share: number;
  revenue: string;
  trend: string;
};

export type AdminFulfillmentQueueItem = {
  code: string;
  customer: string;
  items: string;
  total: string;
  status: string;
  eta: string;
};

export type AdminProductInventoryItem = {
  name: string;
  sku: string;
  category: string;
  stock: number;
  sellThrough: string;
  status: string;
  nextBatch: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

const parseResponse = async <T>(response: Response): Promise<T> => {
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.message || "API request failed");
  }
  return payload.data as T;
};

export async function getOverviewStats(): Promise<AdminOverviewStat[]> {
  const response = await fetch(`${API_BASE_URL}/admin/analytics/overview`, {
    cache: "no-store",
  });

  return parseResponse<AdminOverviewStat[]>(response);
}

export async function getRevenueSeries(): Promise<AdminRevenueSeriesItem[]> {
  const response = await fetch(`${API_BASE_URL}/admin/analytics/revenue-series`, {
    cache: "no-store",
  });

  return parseResponse<AdminRevenueSeriesItem[]>(response);
}

export async function getChannelPerformance(): Promise<AdminChannelPerformance[]> {
  const response = await fetch(`${API_BASE_URL}/admin/analytics/channels`, {
    cache: "no-store",
  });

  return parseResponse<AdminChannelPerformance[]>(response);
}

export async function getFulfillmentQueue(): Promise<AdminFulfillmentQueueItem[]> {
  const response = await fetch(`${API_BASE_URL}/admin/analytics/fulfillment-queue`, {
    cache: "no-store",
  });

  return parseResponse<AdminFulfillmentQueueItem[]>(response);
}

export async function getProductInventory(): Promise<AdminProductInventoryItem[]> {
  const response = await fetch(`${API_BASE_URL}/admin/analytics/inventory`, {
    cache: "no-store",
  });

  return parseResponse<AdminProductInventoryItem[]>(response);
}