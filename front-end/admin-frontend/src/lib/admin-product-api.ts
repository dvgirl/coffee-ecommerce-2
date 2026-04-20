export type AdminProductListItem = {
  id: number;
  name: string;
  category: string;
  categoryId?: string | null;
  basePrice: number;
  originalPrice?: number | null;
  inStock: boolean;
  rating: number;
  notes: string;
  description: string;
  origin: string;
  altitude: string;
  process: string;
  image?: string | null;
  images?: string[];
  featured?: boolean;
  stats: {
    acidity: number;
    body: number;
    sweetness: number;
    complexity: number;
    finish: number;
  };
  serve: {
    vessel: string;
    grind: string;
    temp: string;
    time: string;
  };
  variantAttribute?: string;
  variants?: AdminVariantRecord[];
  createdAt?: string;
  updatedAt?: string;
};

export type ProductListResponse = {
  items: AdminProductListItem[];
  filters: {
    categories: string[];
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
  };
};

type ProductQuery = {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sort?: string;
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

const buildQueryString = (query: ProductQuery) => {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    params.set(key, String(value));
  });

  const stringified = params.toString();
  return stringified ? `?${stringified}` : "";
};

const parseResponse = async <T>(response: Response): Promise<T> => {
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.message || "API request failed");
  }
  return payload.data as T;
};

export async function getProducts(
  query: ProductQuery = {},
): Promise<ProductListResponse> {
  const response = await fetch(
    `${API_BASE_URL}/products${buildQueryString(query)}`,
    {
      cache: "no-store",
    },
  );

  return parseResponse<ProductListResponse>(response);
}

export type AdminCategoryRecord = {
  id: string;
  name: string;
  active: boolean;
};

export type AdminVariantRecord = {
  label: string;
  price: number;
  discountPrice?: number | null;
  stock?: number;
};

export type AdminProductRecord = {
  id: number;
  name: string;
  category: string;
  categoryId?: string | null;
  basePrice: number;
  originalPrice?: number | null;
  inStock: boolean;
  rating: number;
  notes: string;
  description: string;
  origin: string;
  altitude: string;
  process: string;
  image?: string | null;
  images?: string[];
  featured?: boolean;
  stats: {
    acidity: number;
    body: number;
    sweetness: number;
    complexity: number;
    finish: number;
  };
  serve: {
    vessel: string;
    grind: string;
    temp: string;
    time: string;
  };
  variantAttribute?: string;
  variants?: AdminVariantRecord[];
  createdAt?: string;
  updatedAt?: string;
};

export async function getCategories(): Promise<AdminCategoryRecord[]> {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    cache: "no-store",
  });

  return parseResponse<AdminCategoryRecord[]>(response);
}

export async function createCategory(
  category: Pick<AdminCategoryRecord, "name">,
): Promise<AdminCategoryRecord> {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  });

  return parseResponse<AdminCategoryRecord>(response);
}

export async function updateCategory(
  categoryId: string,
  category: Partial<Pick<AdminCategoryRecord, "name" | "active">>,
): Promise<AdminCategoryRecord> {
  const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  });

  return parseResponse<AdminCategoryRecord>(response);
}

export async function deleteCategory(categoryId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
    method: "DELETE",
  });

  await parseResponse<void>(response);
}

export async function getProductById(
  productId: number,
): Promise<AdminProductRecord | null> {
  const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  return parseResponse<AdminProductRecord>(response);
}

export async function uploadProductImages(files: File[]): Promise<string[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  const response = await fetch(`${API_BASE_URL}/products/upload-image`, {
    method: "POST",
    body: formData,
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.message || "Failed to upload images");
  }

  return payload.data.urls as string[];
}

export async function createProduct(
  product: Partial<AdminProductRecord> & { id?: number },
): Promise<AdminProductRecord> {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  return parseResponse<AdminProductRecord>(response);
}

export async function updateProduct(
  productId: number,
  product: Partial<AdminProductRecord>,
): Promise<AdminProductRecord> {
  const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  return parseResponse<AdminProductRecord>(response);
}

export async function deleteProduct(productId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: "DELETE",
  });

  await parseResponse<void>(response);
}
