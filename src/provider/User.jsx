import React, { useContext, useEffect, useState } from "react";
import { useProfileQuery } from "../redux/apiSlices/authSlice";
import { restoreAuthSession } from "../utils/authSession";
import { getAuthToken } from "../utils/tokenService";

export const UserContext = React.createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getAuthToken());
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    restoreAuthSession().finally(() => {
      if (!cancelled) {
        setToken(getAuthToken());
        setIsAuthReady(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const handleAuthChange = () => {
      setToken(getAuthToken());
    };

    window.addEventListener("auth:changed", handleAuthChange);

    return () => {
      window.removeEventListener("auth:changed", handleAuthChange);
    };
  }, []);

  const {
    data: profile,
    isLoading,
    isError,
    refetch,
  } = useProfileQuery(undefined, {
    skip: !isAuthReady || !token,
  });

  useEffect(() => {
    if (profile && !isLoading && !isError) {
      setUser(profile);
    } else if (isError) {
      setUser(null);
    }

    if (!token && user) {
      setUser(null);
    }
  }, [profile, isLoading, isError, token, user]);

  return (
    <UserContext.Provider
      value={{ user, setUser, isLoading, isAuthReady, refetch }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
