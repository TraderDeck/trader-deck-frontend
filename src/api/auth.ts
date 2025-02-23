import apiClient from "./apiClient";

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await apiClient.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    const response = await apiClient.post("/auth/register", { username, email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};
