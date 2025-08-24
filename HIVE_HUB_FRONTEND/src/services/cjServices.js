import api from "../utils/axios";

// Get All Categories
export const getAllCategories = async () => {
  const response = await api.get("/cj/categories");
  return response.data;
};

// Get All Products
export const getAllProducts = async (params = "") => {
  const response = await api.get(`/cj/products${params}`);
  return response.data;
};

// Get Products by Category ID
export const getProductsByCategory = async (categoryId,pageNum,pageSize) => {
  const response = await api.get(`/cj/products?categoryId=${categoryId}&pageNum=${pageNum}&pageSize=${pageSize}`);
  return response.data;
};
