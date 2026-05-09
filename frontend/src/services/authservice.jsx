import axiosClient from "./axiosClient";

export const loginApi = async ({ userName, password }) => {
  const response = await axiosClient.post("/auth/login", { userName, password });
  return response.data.data;
};

export const getMeApi = async () => {
  const response = await axiosClient.get("/auth/me");
  return response.data.data;
};

export const logoutApi = async () => {
  await axiosClient.patch("/auth/logout");
};
