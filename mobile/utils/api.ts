import axios, { AxiosInstance } from "axios";
import { useAuth } from "@clerk/clerk-expo";
import { PostData } from "@/hooks/useCreatePost";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL; // production
// const API_BASE_URL = "http://localhost:5001/api" // development

console.log("API Base URL:", API_BASE_URL);

export const createApiClient = (getToken: () => Promise<string | null>): AxiosInstance => {
  const api = axios.create({ baseURL: API_BASE_URL });

  api.interceptors.request.use(async (config) => {
    const token = await getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  return api;
};

export const useApiClient = (): AxiosInstance => {
  const { getToken } = useAuth();
  return createApiClient(getToken);
};

export const userApi = {
  syncUser: (api: AxiosInstance) => api.post("/users/sync"),
  getCurrentUser: (api: AxiosInstance) => api.get("/users/me"),
  updateProfile: (api: AxiosInstance, data: any) => api.put("/users/update", data),
};

export const postsApi = {
  createPost: (api: AxiosInstance , data: PostData) => api.post("/posts" , data),
  getPosts: (api: AxiosInstance) => api.get("/posts"),
  getUserPosts: (api: AxiosInstance , username:string) => api.put(`/posts/user/${username}`),
  likePost: (api: AxiosInstance , postId:string) => api.post(`/posts/${postId}/like`),
  deletePost: (api: AxiosInstance , postId:string) => api.delete(`/posts/${postId}`),
};

export const commentsApi = {
  createComment: (api: AxiosInstance, postId: string, content: string) =>
    api.post(`/comments/post/${postId}`, { content }),
};