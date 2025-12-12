// src/hooks/useAuth.js
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "./useAuthContext";
import apiClient from "../apis/axiosClient";

// ---------- Login ----------
export const useLogin = () => {
  const queryClient = useQueryClient();
  const { login } = useAuthContext();

  return useMutation({
    mutationFn: async (idToken) => {
      // Gửi idToken tới backend, backend sẽ set cookie tự động
      const res = await apiClient.post("/api/auth/login", { idToken });
      return res.data;
    },
    onSuccess: (data) => {
      // Backend đã set cookie, chỉ cần update user state
      login(data.user);
      
      // Update React Query cache
      queryClient.setQueryData(["user"], data.user);
    },
  });
};

// ---------- Refresh Access Token ----------
export const useRefresh = () => {
  const { logout } = useAuthContext();
  
  return useMutation({
    mutationFn: async () => {
      try {
        // Backend sẽ dùng cookie để xác thực và set cookie mới
        const res = await apiClient.post("/api/auth/refresh");
        console.log('✅ Token refreshed successfully');
        return res.data;
      } catch (error) {
        console.error('❌ Token refresh failed:', error);
        // Nếu refresh thất bại, logout người dùng
        logout();
        throw error;
      }
    },
    onError: () => {
      console.log('🔄 Refresh token expired or invalid, logging out...');
      // Đảm bảo logout được gọi khi refresh thất bại
      logout();
    }
  });
};

// ---------- Logout ----------
export const useLogout = () => {
  const queryClient = useQueryClient();
  const { logout } = useAuthContext();

  return useMutation({
    mutationFn: async () => {
      try {
        // Thử gọi logout API, nhưng không cần refresh token
        const res = await apiClient.post("/api/auth/logout");
        return res.data;
      } catch (error) {
        // Nếu logout API thất bại, không sao - chỉ cần clear frontend
        console.warn('Logout API failed (this is okay):', error.response?.data?.message || error.message);
        return { success: true }; 
      }
    },
    onSuccess: () => {
      console.log('✅ Logout successful');
      // Luôn clear frontend state
      logout();
      
      // Clear React Query cache
      queryClient.removeQueries(["user"]);
      queryClient.clear();
    },
  });
};

// ---------- Auto Refresh Hook ----------
export const useAutoRefresh = () => {
  const { user, isRefreshing, refreshToken } = useAuthContext();
  
  React.useEffect(() => {
    if (!user) return;

    // Set up automatic refresh every 15 minutes (900000ms)
    const refreshInterval = setInterval(() => {
      if (user && !isRefreshing) {
        console.log('🔄 Auto-refreshing token...');
        refreshToken().catch((error) => {
          console.error('❌ Auto-refresh failed:', error);
        });
      }
    }, 15 * 60 * 1000); // 15 minutes

    // Cleanup interval on unmount
    return () => {
      clearInterval(refreshInterval);
    };
  }, [user, isRefreshing, refreshToken]);

  return { isRefreshing };
};
