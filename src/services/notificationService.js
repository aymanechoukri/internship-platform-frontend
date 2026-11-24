import apiClient from "./apiClient.js";

export const getMyNotifications = async () => {
  const response = await apiClient("/notifications/me");
  return { notifications: response?.data ?? [], unreadCount: response?.unreadCount ?? 0 };
};

export const markNotificationRead = async (notificationId) => apiClient(`/notifications/${encodeURIComponent(notificationId)}/read`, { method: "PATCH" });
export const markAllNotificationsRead = async () => apiClient("/notifications/read-all", { method: "PATCH" });
export const deleteMyNotification = async (notificationId) => apiClient(`/notifications/${encodeURIComponent(notificationId)}`, { method: "DELETE" });
