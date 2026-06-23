import {
  clearAuthToken,
  getAuthDevice,
  getAuthToken,
  getRefreshToken,
  setAuthTokens,
} from "./tokenService";

const trimTrailingSlash = (value) => value?.replace(/\/+$/, "");

const apiBaseUrl = trimTrailingSlash(import.meta.env.VITE_API_URL);

const authRefreshPath =
  import.meta?.env?.VITE_AUTH_REFRESH_PATH || "/auth/refresh-token";

const authLogoutPath =
  import.meta?.env?.VITE_AUTH_LOGOUT_PATH || "/auth/logout";

let refreshPromise = null;

const extractTokens = (payload) => {
  const data = payload?.data ?? payload;

  return {
    accessToken: data?.accessToken ?? null,
    refreshToken: data?.refreshToken ?? null,
  };
};

const buildRefreshHeaders = (refreshToken) => {
  const headers = {
    "Content-Type": "application/json",
  };
  if (refreshToken) {
    headers["Authorization"] = refreshToken;
  }
  return headers;
};

const buildRefreshBody = (refreshToken) =>
  JSON.stringify({
    refreshToken: refreshToken || undefined,
    device: getAuthDevice(),
  });

async function requestTokenRefresh() {
  if (!apiBaseUrl) {
    return null;
  }

  const refreshToken = getRefreshToken();
  const device = getAuthDevice();

  try {
    const response = await fetch(`${apiBaseUrl}${authRefreshPath}`, {
      method: "POST",
      headers: buildRefreshHeaders(refreshToken),
      body: buildRefreshBody(refreshToken),
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        clearAuthToken();
      }
      return null;
    }

    const payload = await response.json();

    if (payload?.success === false) {
      clearAuthToken();
      return null;
    }

    const { accessToken: nextAccessToken, refreshToken: nextRefreshToken } =
      extractTokens(payload);

    if (!nextAccessToken) {
      clearAuthToken();
      return null;
    }

    setAuthTokens(nextAccessToken, nextRefreshToken || refreshToken, device);
    return nextAccessToken;
  } catch (error) {
    // 
    return null;
  }
}

export async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = requestTokenRefresh().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

export async function restoreAuthSession() {
  if (getAuthToken()) {
    return true;
  }

  // Always attempt to refresh the token using cookies,
  // mimicking the reference HTML script behavior.
  const nextAccessToken = await refreshAccessToken();
  return Boolean(nextAccessToken);
}

export async function logoutSession() {
  const refreshToken = getRefreshToken();
  const accessToken = getAuthToken();

  if (apiBaseUrl) {
    try {
      const headers = buildRefreshHeaders(refreshToken);
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const response = await fetch(`${apiBaseUrl}${authLogoutPath}`, {
        method: "POST",
        headers,
        body: buildRefreshBody(refreshToken),
        credentials: "include",
      });

    } catch (e) {
      // 
    }
  }

  clearAuthToken();
}

export function isDeviceConflictError(error) {
  const message =
    error?.data?.message ||
    error?.data?.errorMessages?.[0]?.message ||
    error?.message ||
    "";

  return message.toLowerCase().includes("another device");
}
