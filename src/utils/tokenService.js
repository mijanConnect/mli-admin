import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";
const RESET_TOKEN_KEY = "resetToken";
const AUTH_DEVICE_KEY = "authDevice";

const DEFAULT_AUTH_DEVICE =
  import.meta?.env?.VITE_AUTH_DEVICE?.trim() || "admin";

const isDev = () => Boolean(import.meta?.env?.DEV);

let accessToken = null;

const reportStorageIssue = (operation, error) => {
  if (isDev()) {
    console.warn(`[auth] ${operation} failed`, error);
  }
};

const purgeLegacyAccessTokens = () => {
  for (const storage of [sessionStorage, localStorage]) {
    try {
      storage.removeItem(ACCESS_TOKEN_KEY);
    } catch (error) {
      reportStorageIssue("purge legacy access token", error);
    }
  }
};

const purgeLegacyLocalData = () => {
  try {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(AUTH_DEVICE_KEY);
    localStorage.removeItem(RESET_TOKEN_KEY);
  } catch (error) {
    reportStorageIssue("purge legacy local data", error);
  }
};

purgeLegacyAccessTokens();
purgeLegacyLocalData();

const readItem = (key) => {
  try {
    return Cookies.get(key) || null;
  } catch (error) {
    reportStorageIssue(`read ${key}`, error);
    return null;
  }
};

const writeItem = (key, value) => {
  try {
    Cookies.set(key, value, { expires: 30, secure: window.location.protocol === "https:", sameSite: 'lax' });
  } catch (error) {
    reportStorageIssue(`write ${key}`, error);
  }
};

const removeItem = (key) => {
  try {
    Cookies.remove(key);
  } catch (error) {
    reportStorageIssue(`remove ${key}`, error);
  }
};

const emitAuthChange = (type) => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent("auth:changed", { detail: { type } }));
};

export function getAuthToken() {
  return accessToken;
}

export function hasAuthToken() {
  return Boolean(accessToken);
}

export function getRefreshToken() {
  return readItem(REFRESH_TOKEN_KEY);
}

export function hasRefreshToken() {
  return Boolean(getRefreshToken());
}

export function setAuthToken(token) {
  if (!token) {
    return;
  }

  accessToken = token;
  emitAuthChange("token-updated");
}

export function setRefreshToken(token) {
  if (!token) {
    return;
  }

  writeItem(REFRESH_TOKEN_KEY, token);
  emitAuthChange("token-updated");
}

export function getAuthDevice() {
  return readItem(AUTH_DEVICE_KEY) || DEFAULT_AUTH_DEVICE;
}

export function setAuthDevice(device) {
  if (!device) {
    return;
  }

  writeItem(AUTH_DEVICE_KEY, device);
}

export function setAuthTokens(
  accessTokenValue,
  refreshTokenValue,
  deviceValue = DEFAULT_AUTH_DEVICE,
) {
  setAuthToken(accessTokenValue);

  if (refreshTokenValue) {
    setRefreshToken(refreshTokenValue);
  }

  setAuthDevice(deviceValue);

  try {
    localStorage.setItem("hasSession", "true");
  } catch (error) {
    reportStorageIssue("write hasSession", error);
  }
}

export function getResetToken() {
  return readItem(RESET_TOKEN_KEY);
}

export function setResetToken(token) {
  if (!token) {
    return;
  }

  writeItem(RESET_TOKEN_KEY, token);
  emitAuthChange("reset-token-updated");
}

export function clearResetToken() {
  removeItem(RESET_TOKEN_KEY);
}

export function clearAuthToken() {
  accessToken = null;
  removeItem(REFRESH_TOKEN_KEY);
  removeItem(AUTH_DEVICE_KEY);
  purgeLegacyAccessTokens();
  purgeLegacyLocalData();
  try {
    localStorage.removeItem("hasSession");
  } catch (error) {
    reportStorageIssue("remove hasSession", error);
  }
  emitAuthChange("token-cleared");
}

export default {
  getAuthToken,
  hasAuthToken,
  getRefreshToken,
  hasRefreshToken,
  clearAuthToken,
  clearResetToken,
  setAuthToken,
  setAuthTokens,
  getAuthDevice,
  setAuthDevice,
  setRefreshToken,
  setResetToken,
  getResetToken,
};
