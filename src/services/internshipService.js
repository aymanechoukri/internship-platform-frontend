import apiClient from "./apiClient.js";

export const getInternships = async (filters = {}) => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && String(value).trim() !== "") params.set(key, String(value));
  }
  const query = params.toString();
  const response = await apiClient(`/internship${query ? `?${query}` : ""}`);
  return { internships: response?.data ?? [], pagination: response?.pagination ?? {} };
};

export const getInternshipById = async (id) => {
  const response = await apiClient(`/internship/${encodeURIComponent(id)}`);
  return response?.data ?? response;
};
