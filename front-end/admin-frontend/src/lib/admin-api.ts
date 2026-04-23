const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

const buildAdminUrl = (path: string) => `${API_BASE_URL}${path}`;

const withServerCookies = async (init: RequestInit = {}) => {
  const headers = new Headers(init.headers);

  if (typeof window === "undefined" && !headers.has("cookie")) {
    const { headers: nextHeaders } = await import("next/headers");
    const requestHeaders = await nextHeaders();
    const cookie = requestHeaders.get("cookie");

    if (cookie) {
      headers.set("cookie", cookie);
    }
  }

  return {
    ...init,
    headers,
    credentials: "include" as RequestCredentials,
  };
};

export async function adminFetch(path: string, init: RequestInit = {}) {
  return fetch(buildAdminUrl(path), await withServerCookies(init));
}
