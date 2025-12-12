import { useQuery } from "@tanstack/react-query";
import apiClient from "../apis/axiosClient";

// List all categories (optionally active=false)
export const useCategories = ({ q, page, limit, active } = {}) => {
  return useQuery({
    queryKey: ["categories", { q: q || "", page: page || 1, limit: limit || 20, active }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (page) params.set("page", String(page));
      if (limit) params.set("limit", String(limit));
      if (active === false) params.set("active", "false");
      const res = await apiClient.get(`/api/categories${params.toString() ? `?${params.toString()}` : ""}`);
      return res.data;
    },
  });
};

// Category by id
export const useCategory = (id) => {
  return useQuery({
    queryKey: ["category", id],
    queryFn: async () => {
      const res = await apiClient.get(`/api/categories/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};

// Category by slug
export const useCategoryBySlug = (slug) => {
  return useQuery({
    queryKey: ["category", "slug", slug],
    queryFn: async () => {
      const res = await apiClient.get(`/api/categories/by-slug/${slug}`);
      return res.data;
    },
    enabled: !!slug,
  });
};


