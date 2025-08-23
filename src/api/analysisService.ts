import apiClient from "./apiClient";

export interface AnalysisRequest {
  tickerSymbol: string;
  userPrompt: string;
}

export interface AgentResponse {
  agent: string;          
  buyScore: number | null; 
  redFlags: string[];     
  greenFlags: string[];   
  summary: string;       
  extra?: Record<string, any>; 
}

export interface AnalysisResponse {
  tickerSymbol: string;
  agents: AgentResponse[];
}

export const analyzeStock = async (request: AnalysisRequest): Promise<AnalysisResponse> => {
  try {
    const response = await apiClient.post('/analysis/analyze', request);
    return response.data;
  } catch (error) {
    console.error("Error analyzing stock:", error);
    throw error;
  }
};