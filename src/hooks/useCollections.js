import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../apis/axiosClient";

/**
 * ======== FETCH HOOKS ========
 */

// Lấy danh sách Collection (public hoặc của tôi)
export const useCollections = ({ mine = false, page = 1, limit = 12 } = {}) => {
  return useQuery({
    queryKey: ["collections", { mine, page, limit }],
    queryFn: async () => {
      const res = await apiClient.get(`/api/collections`, {
        params: { mine, page, limit },
      });
      // API trả về { collections, pagination }
      return res.data;
    },
  });
};

// Lấy chi tiết Collection theo ID
export const useCollectionById = (id) => {
  return useQuery({
    queryKey: ["collection", id],
    queryFn: async () => {
      const res = await apiClient.get(`/api/collections/${id}`);
      // API trả về { collection }
      return res.data.collection || res.data;
    },
    enabled: !!id,
  });
};

/**
 * ======== MUTATION HOOKS ========
 */

// Tạo Collection (hỗ trợ upload ảnh cover)
export const useCreateCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData) => {
      // formData có thể là FormData hoặc object thường
      const data =
        formData instanceof FormData
          ? formData
          : Object.entries(formData).reduce((fd, [k, v]) => {
              fd.append(k, v);
              return fd;
            }, new FormData());
      const res = await apiClient.post(`/api/collections`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["collections"]);
    },
  });
};

// Cập nhật Collection (meta hoặc ảnh cover)
export const useUpdateCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, formData }) => {
      const data =
        formData instanceof FormData
          ? formData
          : Object.entries(formData).reduce((fd, [k, v]) => {
              fd.append(k, v);
              return fd;
            }, new FormData());
      const res = await apiClient.put(`/api/collections/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries(["collection", vars?.id]);
      queryClient.invalidateQueries(["collections"]);
    },
  });
};

// Xóa Collection
export const useDeleteCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await apiClient.delete(`/api/collections/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["collections"]);
    },
  });
};

// Thêm Items (lectures/documents)
export const useAddCollectionItems = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, items }) => {
      const res = await apiClient.post(`/api/collections/${id}/items`, {
        items, // [{ kind: 'lecture', ref: '...', titleOverride }]
      });
      return res.data;
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries(["collection", vars?.id]);
    },
  });
};

// Xóa Item khỏi Collection
export const useRemoveCollectionItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, itemId, kind }) => {
      const res = await apiClient.delete(
        `/api/collections/${id}/items/${itemId}`,
        { params: { kind } }
      );
      return res.data;
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries(["collection", vars?.id]);
    },
  });
};

// Sắp xếp lại Items trong Collection
export const useReorderCollectionItems = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, kind, order }) => {
      const res = await apiClient.post(
        `/api/collections/${id}/items/reorder`,
        { kind, order } // { kind: 'lecture', order: ['id1','id2'] }
      );
      return res.data;
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries(["collection", vars?.id]);
    },
  });
};
