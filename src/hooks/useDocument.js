// src/hooks/useDocument.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../apis/axiosClient";

// ---------- Create Document ----------
export const useCreateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (documentData) => {
      const formData = new FormData();
      formData.append('title', documentData.title);
      formData.append('description', documentData.description);
      if (documentData.isPublic !== undefined) {
        formData.append('isPublic', String(documentData.isPublic));
      }
      if (documentData.category) {
        formData.append('category', documentData.category);
      }
      if (documentData.keywords && documentData.keywords.length) {
        for (const kw of documentData.keywords) formData.append('keywords', kw);
      }
      
      if (documentData.allowedUsers && documentData.allowedUsers.length > 0) {
        formData.append('allowedUsers', JSON.stringify(documentData.allowedUsers));
      }
      
      if (documentData.file) {
        formData.append('file', documentData.file);
      }

      const res = await apiClient.post("/api/documents", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    },
    onSuccess: () => {
      // Invalidate and refetch documents
      queryClient.invalidateQueries(["documents"]);
      queryClient.invalidateQueries(["userDocuments"]);
    },
  });
};

// ---------- Get User Documents ----------
export const useUserDocuments = () => {
  return useQuery({
    queryKey: ["userDocuments"],
    queryFn: async () => {
      const res = await apiClient.get("/api/documents/user");
      return res.data;
    },
  });
};

// ---------- Get Public Documents ----------
export const usePublicDocuments = ({ page = 1, limit = 12 } = {}) => {
  return useQuery({
    queryKey: ["publicDocuments", { page, limit }],
    queryFn: async () => {
      const res = await apiClient.get("/api/documents/public", {
        params: { page, limit },
      });
      return res.data;
    },
  });
};

// ---------- Update Document ----------
export const useUpdateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, documentData }) => {
      const formData = new FormData();
      formData.append('title', documentData.title);
      formData.append('description', documentData.description);
      if (documentData.isPublic !== undefined) {
        formData.append('isPublic', String(documentData.isPublic));
      }
      if (documentData.category) {
        formData.append('category', documentData.category);
      }
      if (documentData.keywords && documentData.keywords.length) {
        for (const kw of documentData.keywords) formData.append('keywords', kw);
      }
      
      if (documentData.allowedUsers && documentData.allowedUsers.length > 0) {
        formData.append('allowedUsers', JSON.stringify(documentData.allowedUsers));
      }
      
      if (documentData.file) {
        formData.append('file', documentData.file);
      }

      const res = await apiClient.put(`/api/documents/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    },
    onSuccess: () => {
      // Invalidate and refetch documents
      queryClient.invalidateQueries(["documents"]);
      queryClient.invalidateQueries(["userDocuments"]);
      queryClient.invalidateQueries(["publicDocuments"]);
    },
  });
};

// ---------- Delete Document ----------
export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const res = await apiClient.delete(`/api/documents/${id}`);
      return res.data;
    },
    onSuccess: () => {
      // Invalidate and refetch documents
      queryClient.invalidateQueries(["documents"]);
      queryClient.invalidateQueries(["userDocuments"]);
      queryClient.invalidateQueries(["publicDocuments"]);
    },
  });
};

// ---------- Get Single Document ----------
export const useDocument = (id) => {
  return useQuery({
    queryKey: ["document", id],
    queryFn: async () => {
      const res = await apiClient.get(`/api/documents/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};

// ---------- Download Document ----------
export const useDownloadDocument = () => {
  return useMutation({
    mutationFn: async (documentId) => {
      const res = await apiClient.get(`/api/documents/${documentId}/download`, {
        responseType: 'blob',
      });
      return res.data;
    },
  });
};
