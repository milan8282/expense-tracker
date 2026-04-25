import axiosInstance from "./axiosInstance";

export const getDashboardStats = (params) => {
  return axiosInstance.get("/stats/dashboard", { params });
};

export const getMonthlyStats = (params) => {
  return axiosInstance.get("/stats/monthly", { params });
};

export const getCategoryStats = (params) => {
  return axiosInstance.get("/stats/category", { params });
};

export const getPaymentMethodStats = (params) => {
  return axiosInstance.get("/stats/payment-method", { params });
};