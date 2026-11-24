import apiClient from "./apiClient.js";

const unwrap = (response) => response?.data ?? response;

export const getCompanyProfile = async () => unwrap(await apiClient("/companies/me"));
export const createCompanyProfile = async (payload) => unwrap(await apiClient("/companies", {
  method: "POST",
  body: JSON.stringify(payload),
}));
export const updateCompanyProfile = async (payload) => unwrap(await apiClient("/companies/me", {
  method: "PUT",
  body: JSON.stringify(payload),
}));
export const getCompanyDashboard = async () => unwrap(await apiClient("/companies/dashboard"));
export const getCompanyInternships = async () => unwrap(await apiClient("/internship/mine"));
export const createCompanyInternship = async (payload) => unwrap(await apiClient("/internship", {
  method: "POST",
  body: JSON.stringify(payload),
}));
export const updateCompanyInternship = async (id, payload) => unwrap(await apiClient(`/internship/${id}`, {
  method: "PUT",
  body: JSON.stringify(payload),
}));
export const deleteCompanyInternship = async (id) => unwrap(await apiClient(`/internship/${id}`, {
  method: "DELETE",
}));
export const getCompanyApplications = async () => unwrap(await apiClient("/applications/company"));
export const updateCompanyApplicationStatus = async (id, status) => unwrap(await apiClient(`/applications/${id}/status`, {
  method: "PATCH",
  body: JSON.stringify({ status }),
}));
export const getCompanyNotifications = async () => {
  const result = await apiClient("/notifications/me");
  return { notifications: result?.data ?? [], unreadCount: result?.unreadCount ?? 0 };
};
export const markCompanyNotificationRead = async (id) => unwrap(await apiClient(`/notifications/${id}/read`, {
  method: "PATCH",
}));

export const downloadApplicantCV = async (cvId) => apiClient(`/cvs/applicant/${cvId}/download`, { responseType: "blob" });
