import API from "./api.js";



export const loginUser = (email, password) =>
  API.post("/user/login", { email, password });

export const registerUser = (data) =>
  API.post("/user/register", data);

export const verifyOTP = (email, otp) =>
  API.post("/user/verify-email", { email, otp });

export const getMe = () =>
  API.get("/user/me");

export const logoutUser = () =>
  API.post("/user/logout");


export const forgotPassword = (email) =>
  API.post("/user/forget-password", { email });

export const resetPassword = (token, password) =>
  API.post(`/user/reset-password/${token}`, { password });