import apiClient from "./apiClient.js";

export const getMyCVs = async () => {
  const response = await apiClient("/cvs/me");
  return response?.data ?? [];
};

export const uploadMyCV = async (file) => {
  const formData = new FormData();
  formData.append("cv", file);
  const response = await apiClient("/cvs", { method: "POST", body: formData });
  return response?.data ?? response;
};

export const downloadMyCV = async (cvId) => apiClient(`/cvs/${encodeURIComponent(cvId)}/download`, { responseType: "blob" });

export const deleteMyCV = async (cvId) => apiClient(`/cvs/${encodeURIComponent(cvId)}`, { method: "DELETE" });
