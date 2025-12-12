// src/hooks/useDocumentShare.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../apis/axiosClient";

// ---------- Create Document Share ----------
export const useCreateDocumentShare = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (shareData) => {
      const res = await apiClient.post("/api/document-shares", {
        documentId: shareData.documentId,
        userId: shareData.userId,
      });
      return res.data;
    },
    onSuccess: () => {
      // Invalidate and refetch document shares
      queryClient.invalidateQueries(["documentShares"]);
      queryClient.invalidateQueries(["sharedDocuments"]);
    },
  });
};

// ---------- Get Shared Documents ----------
export const useSharedDocuments = () => {
  return useQuery({
    queryKey: ["sharedDocuments"],
    queryFn: async () => {
      const res = await apiClient.get("/api/document-shares");
      return res.data;
    },
  });
};

// ---------- Get Document Shares by Document ID ----------
export const useDocumentShares = (documentId) => {
  return useQuery({
    queryKey: ["documentShares", documentId],
    queryFn: async () => {
      const res = await apiClient.get(`/api/document-shares/by-document/${documentId}`);
      return res.data;
    },
    enabled: !!documentId,
  });
};

// ---------- Delete Document Share ----------
export const useDeleteDocumentShare = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (shareId) => {
      const res = await apiClient.delete(`/api/document-shares/${shareId}`);
      return res.data;
    },
    onSuccess: () => {
      // Invalidate and refetch document shares
      queryClient.invalidateQueries(["documentShares"]);
      queryClient.invalidateQueries(["sharedDocuments"]);
    },
  });
};

// ---------- Get All Document Shares ----------
export const useAllDocumentShares = () => {
  return useQuery({
    queryKey: ["allDocumentShares"],
    queryFn: async () => {
      const res = await apiClient.get("/api/document-shares");
      return res.data;
    },
  });
};

// ---------- Get Documents Shared With User ----------
export const useDocumentsSharedWithUser = () => {
  return useQuery({
    queryKey: ["documentsSharedWithUser"],
    queryFn: async () => {
      const res = await apiClient.get("/api/document-shares/shared-with-me");
      return res.data;
    },
  });
};
