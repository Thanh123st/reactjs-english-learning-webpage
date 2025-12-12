// src/hooks/useSaved.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../apis/axiosClient";

// ---------- Save Item (question/document/lecture/collection) ----------
export const useSaveItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ kind, ref }) => {
      const res = await apiClient.post(`/api/saved`, { kind, ref });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["saved"]);
    },
  });
};

// ---------- Remove Saved Item ----------
export const useRemoveSavedItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ kind, ref }) => {
      const res = await apiClient.delete(`/api/saved/${kind}/${ref}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["saved"]);
    },
  });
};

// ---------- List Saved (all kinds/public) ----------
export const useSaved = ({ page = 1, limit = 20, kind } = {}) => {
  return useQuery({
    queryKey: ["saved", { page, limit, kind }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (kind) params.set("kind", kind);
      if (page) params.set("page", String(page));
      if (limit) params.set("limit", String(limit));
      const res = await apiClient.get(`/api/saved?${params.toString()}`);
      return res.data;
    },
  });
};


