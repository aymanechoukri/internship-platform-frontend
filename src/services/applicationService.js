import apiClient from "./apiClient.js";

export const getMyApplications = async () => {
  const response = await apiClient("/applications/me");
  return response?.data ?? [];
};

export const applyForInternship = async (internshipId) => {
  const response = await apiClient(`/applications/${encodeURIComponent(internshipId)}`, { method: "POST" });
  return response?.data ?? response;
};

export const withdrawMyApplication = async (applicationId) => {
  return apiClient(`/applications/${encodeURIComponent(applicationId)}`, { method: "DELETE" });
};
