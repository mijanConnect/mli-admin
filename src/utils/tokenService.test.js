import { describe, it, expect, beforeEach, vi } from "vitest";
import tokenService from "./tokenService";

describe("tokenService", () => {
  beforeEach(() => {
    // Clear storage before each test
    sessionStorage.clear();
    localStorage.clear();
    // Reset internal state by clearing auth token
    tokenService.clearAuthToken();
    tokenService.clearResetToken();
    vi.restoreAllMocks();
  });

  it("should manage access token in memory", () => {
    expect(tokenService.getAuthToken()).toBeNull();
    expect(tokenService.hasAuthToken()).toBe(false);

    tokenService.setAuthToken("test-access-token");
    expect(tokenService.getAuthToken()).toBe("test-access-token");
    expect(tokenService.hasAuthToken()).toBe(true);

    tokenService.clearAuthToken();
    expect(tokenService.getAuthToken()).toBeNull();
    expect(tokenService.hasAuthToken()).toBe(false);
  });

  it("should manage refresh token in sessionStorage", () => {
    expect(tokenService.getRefreshToken()).toBeNull();
    expect(tokenService.hasRefreshToken()).toBe(false);

    tokenService.setRefreshToken("test-refresh-token");
    expect(tokenService.getRefreshToken()).toBe("test-refresh-token");
    expect(tokenService.hasRefreshToken()).toBe(true);
    expect(sessionStorage.getItem("refreshToken")).toBe("test-refresh-token");

    tokenService.clearAuthToken();
    expect(tokenService.getRefreshToken()).toBeNull();
    expect(tokenService.hasRefreshToken()).toBe(false);
    expect(sessionStorage.getItem("refreshToken")).toBeNull();
  });

  it("should manage auth device in sessionStorage", () => {
    // Default should be "admin" (or read from environment)
    expect(tokenService.getAuthDevice()).toBe("admin");

    tokenService.setAuthDevice("mobile");
    expect(tokenService.getAuthDevice()).toBe("mobile");
    expect(sessionStorage.getItem("authDevice")).toBe("mobile");

    tokenService.clearAuthToken();
    expect(tokenService.getAuthDevice()).toBe("admin"); // reverts to default
    expect(sessionStorage.getItem("authDevice")).toBeNull();
  });

  it("should manage reset token in sessionStorage", () => {
    expect(tokenService.getResetToken()).toBeNull();

    tokenService.setResetToken("test-reset-token");
    expect(tokenService.getResetToken()).toBe("test-reset-token");
    expect(sessionStorage.getItem("resetToken")).toBe("test-reset-token");

    tokenService.clearResetToken();
    expect(tokenService.getResetToken()).toBeNull();
    expect(sessionStorage.getItem("resetToken")).toBeNull();
  });

  it("should set all auth tokens at once", () => {
    tokenService.setAuthTokens("access", "refresh", "custom-device");
    expect(tokenService.getAuthToken()).toBe("access");
    expect(tokenService.getRefreshToken()).toBe("refresh");
    expect(tokenService.getAuthDevice()).toBe("custom-device");
  });

  it("should dispatch auth:changed events", () => {
    const dispatchSpy = vi.spyOn(window, "dispatchEvent");

    tokenService.setAuthToken("new-token");
    expect(dispatchSpy).toHaveBeenCalled();
    const call1 = dispatchSpy.mock.calls[0][0];
    expect(call1.type).toBe("auth:changed");
    expect(call1.detail.type).toBe("token-updated");

    dispatchSpy.mockClear();

    tokenService.setResetToken("reset-token");
    expect(dispatchSpy).toHaveBeenCalled();
    const call2 = dispatchSpy.mock.calls[0][0];
    expect(call2.type).toBe("auth:changed");
    expect(call2.detail.type).toBe("reset-token-updated");

    dispatchSpy.mockClear();

    tokenService.clearAuthToken();
    expect(dispatchSpy).toHaveBeenCalled();
    const call3 = dispatchSpy.mock.calls[0][0];
    expect(call3.type).toBe("auth:changed");
    expect(call3.detail.type).toBe("token-cleared");
  });
});
