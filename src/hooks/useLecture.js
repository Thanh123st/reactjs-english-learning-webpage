// src/hooks/useLecture.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../apis/axiosClient";

// ---------- Create Lecture ----------
export const useCreateLecture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lectureData) => {
      const formData = new FormData();
      formData.append('title', lectureData.title);
      formData.append('description', lectureData.description);
      if (lectureData.isPublic !== undefined) {
        formData.append('isPublic', String(lectureData.isPublic));
      }
      if (lectureData.category) {
        formData.append('category', lectureData.category);
      }
      if (lectureData.keywords && lectureData.keywords.length) {
        for (const kw of lectureData.keywords) formData.append('keywords', kw);
      }
      
      if (lectureData.allowedUsers && lectureData.allowedUsers.length > 0) {
        formData.append('allowedUsers', JSON.stringify(lectureData.allowedUsers));
      }
      
      if (lectureData.video) {
        formData.append('video', lectureData.video);
      }

      const res = await apiClient.post("/api/lectures", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    },
    onSuccess: () => {
      // Invalidate and refetch lectures
      queryClient.invalidateQueries(["lectures"]);
      queryClient.invalidateQueries(["userLectures"]);
    },
  });
};

// ---------- Get User Lectures ----------
export const useUserLectures = () => {
  return useQuery({
    queryKey: ["userLectures"],
    queryFn: async () => {
      const res = await apiClient.get("/api/lectures/user");
      return res.data;
    },
  });
};

// ---------- Get Public Lectures ----------
export const usePublicLectures = ({ page = 1, limit = 12 } = {}) => {
  return useQuery({
    queryKey: ["publicLectures", { page, limit }],
    queryFn: async () => {
      const res = await apiClient.get("/api/lectures/public", {
        params: { page, limit },
      });
      return res.data;
    },
  });
};

// ---------- Update Lecture ----------
export const useUpdateLecture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, lectureData }) => {
      const formData = new FormData();
      formData.append('title', lectureData.title);
      formData.append('description', lectureData.description);
      if (lectureData.isPublic !== undefined) {
        formData.append('isPublic', String(lectureData.isPublic));
      }
      if (lectureData.category) {
        formData.append('category', lectureData.category);
      }
      if (lectureData.keywords && lectureData.keywords.length) {
        for (const kw of lectureData.keywords) formData.append('keywords', kw);
      }
      
      if (lectureData.allowedUsers && lectureData.allowedUsers.length > 0) {
        formData.append('allowedUsers', JSON.stringify(lectureData.allowedUsers));
      }
      
      if (lectureData.video) {
        formData.append('video', lectureData.video);
      }

      const res = await apiClient.put(`/api/lectures/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    },
    onSuccess: () => {
      // Invalidate and refetch lectures
      queryClient.invalidateQueries(["lectures"]);
      queryClient.invalidateQueries(["userLectures"]);
      queryClient.invalidateQueries(["publicLectures"]);
    },
  });
};

// ---------- Delete Lecture ----------
export const useDeleteLecture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const res = await apiClient.delete(`/api/lectures/${id}`);
      return res.data;
    },
    onSuccess: () => {
      // Invalidate and refetch lectures
      queryClient.invalidateQueries(["lectures"]);
      queryClient.invalidateQueries(["userLectures"]);
      queryClient.invalidateQueries(["publicLectures"]);
    },
  });
};

// ---------- Get Single Lecture ----------
export const useLecture = (id) => {
  return useQuery({
    queryKey: ["lecture", id],
    queryFn: async () => {
      const res = await apiClient.get(`/api/lectures/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};
