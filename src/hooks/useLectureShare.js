// src/hooks/useLectureShare.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../apis/axiosClient";

// ---------- Create Lecture Share ----------
export const useCreateLectureShare = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (shareData) => {
      const res = await apiClient.post("/api/lecture-shares", {
        lectureId: shareData.lectureId,
        userId: shareData.userId,
      });
      return res.data;
    },
    onSuccess: () => {
      // Invalidate and refetch lecture shares
      queryClient.invalidateQueries(["lectureShares"]);
      queryClient.invalidateQueries(["sharedLectures"]);
    },
  });
};

// ---------- Get Shared Lectures ----------
export const useSharedLectures = () => {
  return useQuery({
    queryKey: ["sharedLectures"],
    queryFn: async () => {
      const res = await apiClient.get("/api/lecture-shares");
      return res.data;
    },
  });
};

// ---------- Get Lecture Shares by Lecture ID ----------
export const useLectureShares = (lectureId) => {
  return useQuery({
    queryKey: ["lectureShares", lectureId],
    queryFn: async () => {
      const res = await apiClient.get(`/api/lecture-shares/by-lecture/${lectureId}`);
      return res.data;
    },
    enabled: !!lectureId,
  });
};

// ---------- Delete Lecture Share ----------
export const useDeleteLectureShare = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (shareId) => {
      const res = await apiClient.delete(`/api/lecture-shares/${shareId}`);
      return res.data;
    },
    onSuccess: () => {
      // Invalidate and refetch lecture shares
      queryClient.invalidateQueries(["lectureShares"]);
      queryClient.invalidateQueries(["sharedLectures"]);
    },
  });
};

// ---------- Get All Lecture Shares ----------
export const useAllLectureShares = () => {
  return useQuery({
    queryKey: ["allLectureShares"],
    queryFn: async () => {
      const res = await apiClient.get("/api/lecture-shares");
      return res.data;
    },
  });
};
