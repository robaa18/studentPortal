import axiosClient from "./axiosClient";

export const getProfile = async () => {
  const response = await axiosClient.get("/user/profile");
  return response.data.data;
};

export const updateProfile = async (profileData) => {
  const response = await axiosClient.put("/user/profile", profileData);
  return response.data.data;
};

export const getCourses = async () => {
  const response = await axiosClient.get("/course");
  return response.data.data;
};

export const getMyCourses = async () => {
  const response = await axiosClient.get("/course/my-courses");
  return response.data.data;
};

export const enrollInCourse = async (courseId) => {
  const response = await axiosClient.post("/course/enroll", { courseId });
  return response.data.data;
};

export const withdrawFromCourse = async (courseId) => {
  const response = await axiosClient.delete("/course/withdraw", {
    data: { courseId },
  });
  return response.data;
};

export const getMyGrades = async () => {
  const response = await axiosClient.get("/grades");
  return response.data.data;
};

export const getSchedule = async () => {
  const response = await axiosClient.get("/schedule");
  return response.data.data;
};

export const getAnnouncements = async () => {
  const response = await axiosClient.get("/announce");
  return response.data.data;
};
