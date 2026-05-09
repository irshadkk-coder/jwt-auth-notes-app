import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

// ✅ All public/auth routes — never trigger refresh or redirect
const AUTH_ROUTES = ["/user/login", "/user/register", "/user/api/refresh" ,"/user/me" ];
const isAuthRoute = (url = "") =>
  AUTH_ROUTES.some((route) => url.includes(route));

const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

const redirectToLogin = () => {
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRoute(originalRequest.url)  // ✅ covers register, login, refresh
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(API(originalRequest)),
            reject: (err) => reject(err),
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await API.post("/user/api/refresh");
        processQueue(null);
        return API(originalRequest);

      } catch (err) {
        processQueue(err);
        redirectToLogin();
        return Promise.reject(err);

      } finally {
        isRefreshing = false;
      }
    }

    // ✅ Auth route errors just reject — component handles the message
    return Promise.reject(error);
  }
);

export default API;