import { useMutation } from "@tanstack/react-query";
import apiClient from "../apis/axiosClient";

export const useContact = () => {
  return useMutation({
    mutationFn: async (contactData) => {
      const response = await apiClient.post("/api/contacts", contactData);
      return response.data;
    },
    onSuccess: (data) => {
      console.log('✅ Contact form submitted successfully:', data);
    },
    onError: (error) => {
      console.error('❌ Contact form submission failed:', error);
    },
  });
};
