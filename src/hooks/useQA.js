// src/hooks/useQA.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../apis/axiosClient";

// ---------- Create Question (multipart) ----------
export const useCreateQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ title, content, tags, attachments }) => {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (tags) formData.append("tags", Array.isArray(tags) ? tags.join(",") : tags);
      if (attachments && attachments.length) {
        for (const file of attachments) formData.append("attachments", file);
      }
      const res = await apiClient.post("/api/qa/questions", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["qa","questions"]);
      queryClient.invalidateQueries(["qa","my"]);
    },
  });
};

// ---------- Update Question Status ----------
export const useUpdateQuestionStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ questionId, status }) => {
      const res = await apiClient.patch(`/api/qa/questions/${questionId}/status`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["qa","questions"]);
      queryClient.invalidateQueries(["qa","question"]);
    },
  });
};

// ---------- Create Answer (multipart) ----------
export const useCreateAnswer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ questionId, content, attachments }) => {
      const formData = new FormData();
      formData.append("questionId", questionId);
      formData.append("content", content);
      if (attachments && attachments.length) {
        for (const file of attachments) formData.append("attachments", file);
      }
      const res = await apiClient.post("/api/qa/answers", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: (_data, variables) => {
      const questionId = variables?.questionId;
      if (questionId) {
        queryClient.invalidateQueries(["qa","question", questionId]);
      }
      queryClient.invalidateQueries(["qa","my"]);
    },
  });
};

// ---------- Update Answer Status ----------
export const useUpdateAnswerStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ answerId, status }) => {
      const res = await apiClient.patch(`/api/qa/answers/${answerId}/status`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["qa","question"]);
      queryClient.invalidateQueries(["qa","my"]);
    },
  });
};

// ---------- List Published Questions ----------
export const usePublishedQuestions = () => {
  return useQuery({
    queryKey: ["qa","questions"],
    queryFn: async () => {
      const res = await apiClient.get("/api/qa/questions");
      return res.data;
    },
  });
};

// ---------- Get Question Detail (with Answers) ----------
export const useQuestionDetail = (questionId) => {
  return useQuery({
    queryKey: ["qa","question", questionId],
    queryFn: async () => {
      const res = await apiClient.get(`/api/qa/questions/${questionId}`);
      return res.data;
    },
    enabled: !!questionId,
  });
};

// ---------- List My Q&A ----------
export const useMyQA = () => {
  return useQuery({
    queryKey: ["qa","my"],
    queryFn: async () => {
      const res = await apiClient.get(`/api/qa/my`);
      return res.data;
    },
  });
};

// ---------- Query: search + pagination for questions ----------
export const useSearchQuestions = ({ q = "", page = 1, limit = 10, tag = "" } = {}) => {
  return useQuery({
    queryKey: ["qa","questions","search", { q, page, limit, tag }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (page) params.set("page", String(page));
      if (limit) params.set("limit", String(limit));
      if (tag) params.set("tag", tag);
      const res = await apiClient.get(`/api/qa/questions?${params.toString()}`);
      return res.data;
    },
  });
};


