import apiClient from "./apiClient.js";

export const getStudentProfile = async () => {
  const response = await apiClient("/students/me");
  return response?.data ?? response;
};

export const createStudentProfile = async (payload) => {
  const response = await apiClient("/students", { method: "POST", body: JSON.stringify(payload) });
  return response?.data ?? response;
};

export const updateStudentProfile = async (payload) => {
  const response = await apiClient("/students/me", { method: "PUT", body: JSON.stringify(payload) });
  return response?.data ?? response;
};
