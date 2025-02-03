import apiClient from "./apiClient";
import { Ticker } from "../types/Ticker";

export const fetchTickers = async (filters: Record<string, any>): Promise<Ticker[]> => {
  try {
    const response = await apiClient.get<Ticker[]>("/tickers/search", { params: filters });
    return response.data;
  } catch (error) {
    console.error("Error fetching tickers:", error);
    throw error;
  }
};