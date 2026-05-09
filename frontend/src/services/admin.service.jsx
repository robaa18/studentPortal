import axiosClient from "./axiosClient";

export const getAllUsers = async () => {
  const response = await axiosClient.get("/user");
  return response.data.data;
};

export const addUser = async (userData) => {
  const response = await axiosClient.post("/user/add-user", userData);
  return response.data.data;
};

export const updateUser = async (id, userData) => {
  const response = await axiosClient.put(`/user/${id}`, userData);
  return response.data.data;
};

export const deleteUser = async (id) => {
  const response = await axiosClient.delete(`/user/${id}`);
  return response.data;
};

export const getCourses = async () => {
  const response = await axiosClient.get("/course");
  return response.data.data;
};

export const createOrUpdateGrade = async (data) => {
  const response = await axiosClient.post("/grades", data);
  return response.data.data;
};

export const deleteGrade = async (id) => {
  const response = await axiosClient.delete(`/grades/${id}`);
  return response.data.data;
};

export const createCourse = async (courseData) => {
  const response = await axiosClient.post("/course", courseData);
  return response.data.data;
};

export const updateCourse = async (id, courseData) => {
  const response = await axiosClient.put(`/course/${id}`, courseData);
  return response.data.data;
};

export const deleteCourse = async (id) => {
  const response = await axiosClient.delete(`/course/${id}`);
  return response.data;
};

export const getGrades = async () => {
  const response = await axiosClient.get("/grades");
  return response.data.data;
};

export const uploadStudentGrade = async (gradeData) => {
  const response = await axiosClient.post("/grades", gradeData);
  return response.data.data;
};

export const getAnnouncements = async () => {
  const response = await axiosClient.get("/announce");
  return response.data.data;
};

export const createAnnouncement = async (announcementData) => {
  const response = await axiosClient.post("/announce", announcementData);
  return response.data.data;
};
