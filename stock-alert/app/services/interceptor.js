import axios from "axios";
const interceptor = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});
interceptor.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");        
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    config.headers["Content-Type"] = "application/json";           
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default interceptor;