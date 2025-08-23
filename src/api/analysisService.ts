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

export interface JobAcceptedResponse { jobId: string; }

// Start async analysis and return jobId
export const startAnalysis = async (request: AnalysisRequest): Promise<string | { immediate: true; result: AnalysisResponse }> => {
  const resp = await apiClient.post('/analysis/analyze', request, { validateStatus: s => (s>=200 && s<300) });
  // If backend still synchronous and returns analysis directly
  if (resp.data && resp.data.agents && resp.data.tickerSymbol) {
    return { immediate: true, result: resp.data as AnalysisResponse };
  }
  const jobId = (resp.data as any)?.jobId;
  if (!jobId) {
    console.error('startAnalysis: missing jobId in response', resp.data);
    throw new Error('Missing jobId in analysis start response');
  }
  return jobId;
};

// Fetch current result (may still be processing). Returns { done, result? }
export const getAnalysisResult = async (jobId: string): Promise<{ done: boolean; result?: AnalysisResponse; }> => {
  const resp = await apiClient.get(`/analysis/analyze/${jobId}`, { validateStatus: s => s === 200 || s === 202 });
  if (resp.status === 200) {
    return { done: true, result: resp.data as AnalysisResponse };
  }
  return { done: false };
};

// Backwards-compatible helper used by existing UI. Polls until completion.
export const analyzeStock = async (request: AnalysisRequest): Promise<AnalysisResponse> => {
  const startRes = await startAnalysis(request);
  if (typeof startRes !== 'string') {
    return startRes.result; // immediate synchronous result
  }
  const jobId = startRes;
  const start = Date.now();
  const maxMs = 4 * 60 * 1000; // 4 minute safety cap
  let intervalMs = 2000;
  while (Date.now() - start < maxMs) {
    const { done, result } = await getAnalysisResult(jobId);
    if (done && result) return result;
    await new Promise(r => setTimeout(r, intervalMs));
    if (Date.now() - start > 30_000) intervalMs = 4000; // backoff
  }
  throw new Error('Analysis polling timeout');
};