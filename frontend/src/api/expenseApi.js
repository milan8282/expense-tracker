import axiosInstance from "./axiosInstance";

export const getExpenses = (params = {}) => {
  return axiosInstance.get("/expenses", { params });
};

export const createExpense = (data) => {
  return axiosInstance.post("/expenses", data);
};

export const updateExpense = (id, data) => {
  return axiosInstance.patch(`/expenses/${id}`, data);
};

export const deleteExpense = (id) => {
  return axiosInstance.delete(`/expenses/${id}`);
};

export const bulkDeleteExpenses = (ids) => {
  return axiosInstance.post("/expenses/bulk-delete", { ids });
};

export const bulkUploadExpenses = (formData) => {
  return axiosInstance.post("/expenses/bulk-upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getCategorySuggestions = () => {
  return axiosInstance.get("/expenses/categories/suggestions");
};

export const exportExpensesCsv = (params = {}) => {
  return axiosInstance.get("/expenses/export/csv", {
    params,
    responseType: "blob",
  });
};