import { useState, useEffect, useRef } from 'react';
import { Sparkles, TrendingUp, DollarSign, Newspaper, AlertCircle, Loader2, Target, TrendingDown } from 'lucide-react';
import TickerSelector from './components/TickerSelector';
import { Ticker } from './types/Ticker';
import useTickers from './hooks/useTickers';
import { startAnalysis, getAnalysisResult, AnalysisResponse, AgentResponse } from './api/analysisService';
import { cleanTickerName } from './utils/tickerUtils';
import { useToast } from './context/ToastContext';

const renderInline = (line: string) => {
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-gray-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
};

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const renderStyledLine = (line: string, key: number) => {
  const numMatch = line.match(/^\s*(\d+)\.\s+(.*)$/);
  if (numMatch) {
    const [, num, rest] = numMatch;
    return (
      <div key={key} className="flex items-start gap-2 mb-1">
        <span className="text-gray-500 min-w-6 text-right">{num}.</span>
        <span className="flex-1">{renderInline(rest)}</span>
      </div>
    );
  }

  const bulletMatch = line.match(/^\s*[•\-]\s+(.*)$/);
  if (bulletMatch) {
    const [, rest] = bulletMatch;
    return (
      <div key={key} className="flex items-start gap-2 mb-1">
        <span className="text-gray-500">•</span>
        <span className="flex-1">{renderInline(rest)}</span>
      </div>
    );
  }

  return (
    <div key={key} className="mb-1 whitespace-pre-wrap">{renderInline(line)}</div>
  );
};

const renderMultiline = (text?: string) => {
  if (!text) return null;

  const hasNewlines = /\r\n|\r|\n|\\n/.test(text);
  let normalized = text;

  if (!hasNewlines) {
    const headers = [
      '🚩 Red Flags:',
      '✅ Green Flags:',
      'Key Valuation Metrics:',
      'Interpretation:',
      'Investors should note',
      'Market Context:',
      'Potential Catalysts:',
      'Risks:',
      'Trade Plan:',
      'Why:',
      'Decision:',
    ];

    headers.forEach((h) => {
      const re = new RegExp('(?:^|\u00A0|\s)(' + escapeRegExp(h) + ')', 'g');
      normalized = normalized.replace(re, '\n$1');
    });

    normalized = normalized.replace(/\s(\d+)\.\s/g, '\n$1. ');
    normalized = normalized.replace(/\s-\s/g, '\n- ');
    normalized = normalized.replace(/\s•\s/g, '\n• ');
    normalized = normalized.replace(/(:)\s-\s/g, '$1\n- ');
    normalized = normalized.replace(/([.!?])\s+(?=(🚩|✅|-|•|[A-Z0-9]))/g, '$1\n');
    normalized = normalized.replace(/\n\s+/g, '\n').trim();
  }

  const lines = normalized.split(/\r\n|\r|\n|\\n/g);

  return lines.map((line, idx) => {
    const trimmed = line.trim();
    if (trimmed === '') return <div key={idx} className="h-3" />;

    const isHeading = /^(?![-•])[^:]{2,}:\s*$/.test(line) || /^(🚩|✅)\s+[^:]+:\s*$/.test(line);
    if (isHeading) {
      return (
        <div key={idx} className="mt-3 mb-1 font-semibold text-gray-800">
          {renderInline(line)}
        </div>
      );
    }

    return renderStyledLine(line, idx);
  });
};

const formatTradeReasoning = (reasoning: any): string => {
  let items: string[] = [];
  
  if (Array.isArray(reasoning)) {
    items = reasoning;
  } else if (typeof reasoning === 'string') {
    // Handle JSON string arrays like "[\"item1\",\"item2\"]"
    try {
      const parsed = JSON.parse(reasoning);
      if (Array.isArray(parsed)) {
        items = parsed;
      } else {
        // If it's not an array, treat as single item
        items = [reasoning];
      }
    } catch {
      // If JSON parsing fails, treat as single item
      items = [reasoning];
    }
  } else {
    items = [String(reasoning)];
  }
  
  // Format each item as a paragraph with bold category headers
  return items.map(item => {
    const match = item.match(/^(Fundamentals|Technicals|News):\s*(.*)$/);
    if (match) {
      const [, category, content] = match;
      return `**${category}**: ${content}`;
    }
    return item;
  }).join('\n\n');
};

const renderBulletList = (items: string[], colorClass: string) => {
  return (
    <ul className="text-sm text-gray-600 space-y-1">
      {items.map((item, idx) => {
        const capitalizedItem = item.trim().charAt(0).toUpperCase() + item.trim().slice(1);
        return (
          <li key={idx} className="flex items-start gap-2">
            <span className={`mt-1 ${colorClass}`}>•</span>
            <span>{capitalizedItem}</span>
          </li>
        );
      })}
    </ul>
  );
};

const renderArrayAsBullets = (content: any, colorClass: string) => {
  let items: string[] = [];
  
  if (Array.isArray(content)) {
    items = content;
  } else if (typeof content === 'string') {
    // Handle JSON string arrays like "[\"item1\",\"item2\"]"
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        items = parsed;
      } else {
        // Fallback to old parsing method
        const cleaned = content.replace(/^\[|\]$/g, '').replace(/"/g, '');
        items = cleaned.split(',').map(item => item.trim());
      }
    } catch {
      // If JSON parsing fails, use the old method
      const cleaned = content.replace(/^\[|\]$/g, '').replace(/"/g, '');
      items = cleaned.split(',').map(item => item.trim());
    }
  } else {
    return <div className="text-sm text-gray-600">{String(content)}</div>;
  }
  
  return renderBulletList(items, colorClass);
};

const getAgentByType = (agents: AgentResponse[], type: string): AgentResponse | null => {
  return agents.find(agent => agent.agent === type) || null;
};

const getBuyScoreColor = (score: number | null): string => {
  if (!score) return 'bg-gray-100 text-gray-800';
  if (score >= 8) return 'bg-green-100 text-green-800';
  if (score >= 6) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

const getBuyScoreIcon = (score: number | null) => {
  if (!score) return null;
  if (score >= 6) return <TrendingUp className="h-4 w-4" />;
  return <TrendingDown className="h-4 w-4" />;
};

const Agents = () => {
  const [submittedFilters, setSubmittedFilters] = useState<null | Record<string, any>>(null);
  const { tickers } = useTickers(submittedFilters);
  
  const [selectedTicker, setSelectedTicker] = useState<Ticker | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const activeJobIdRef = useRef<string | null>(null);
  const cancelRef = useRef<boolean>(false);
  const { push: pushToast } = useToast();

  useEffect(() => {
    setSubmittedFilters({
      symbol: "",
      name: "",
      industry: "", 
      sector: "",
      marketCapMin: "0",
    });
  }, []);

  useEffect(() => {
    if (!status) return;
    if (status === 'COMPLETED') pushToast({ message: 'Analysis complete', type: 'success' });
    else if (status === 'ERROR') pushToast({ message: 'Analysis failed', type: 'error' });
    else if (status === 'TIMEOUT') pushToast({ message: 'Analysis still running server-side (timeout)', type: 'warning' });
    else if (status === 'CANCELLED') pushToast({ message: 'Analysis cancelled', type: 'info' });
  }, [status, pushToast]);

  const pollJob = (jid: string, started: number) => {
    if (cancelRef.current) return; // cancelled
    getAnalysisResult(jid).then(r => {
      if (cancelRef.current || activeJobIdRef.current !== jid) return; // stale
      if (r.done && r.result) {
        setAnalysis(r.result);
        setIsLoading(false);
        setStatus('COMPLETED');
        return;
      }
      const now = Date.now();
      const elapsed = now - started;
      if (elapsed >= 4 * 60 * 1000) { // 4 minute timeout
        setIsLoading(false);
        setStatus('TIMEOUT');
        return;
      }
      // progressive backoff
      const delay = elapsed < 30_000 ? 2000 : 4000;
      setTimeout(() => pollJob(jid, started), delay);
    }).catch(err => {
      if (cancelRef.current) return;
      setIsLoading(false);
      setStatus('ERROR');
      setError('Failed while polling analysis job.');
      console.error(err);
    });
  };

  const handleAnalyze = async () => {
    if (!selectedTicker || isLoading) return;
    cancelRef.current = false;
    activeJobIdRef.current = null;
    setAnalysis(null);
    setError(null);
    setStatus('QUEUING');
    setIsLoading(true);
    try {
      const startRes = await startAnalysis({ tickerSymbol: selectedTicker.symbol, userPrompt: '' });
      if (typeof startRes !== 'string') {
        setAnalysis(startRes.result);
        setIsLoading(false);
        setStatus('COMPLETED');
        return;
      }
      const jid = startRes;
      activeJobIdRef.current = jid;
      setStatus('IN_PROGRESS');
      const started = Date.now();
      pollJob(jid, started);
    } catch (e) {
      setIsLoading(false);
      setStatus('ERROR');
      setError('Failed to start analysis.');
    }
  };

  const handleTickerSelect = (ticker: Ticker) => {
    cancelRef.current = true; // cancel any active polling
    activeJobIdRef.current = null;
    setStatus(null);
    setSelectedTicker(ticker);
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-dark-green mb-2">Stock Analysis Agentic Worflow</h1>
          <p className="text-dark-green/80">Select a stock and analyze with our AI agents</p>
        </div>

        {/* Stock Selection - Inline Layout */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-end gap-4">
            <div className="flex-1 max-w-2xl">
              <label className="block text-sm font-medium text-dark-green mb-2">
                Select Stock
              </label>
              <TickerSelector
                tickers={tickers}
                onTickerSelect={handleTickerSelect}
                selectedTicker={selectedTicker}
                placeholder="Search for a stock symbol or company name..."
                hideSelectedDisplay={true}
              />
            </div>
            
            {/* Selected Ticker Display - To the right of search */}
            {selectedTicker && (
              <div className="flex-1 p-3 bg-blue-50 border border-blue-200 rounded-lg mr-16 relative">
                {/* Removed status chip for simplified UI */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-blue-900">{selectedTicker.symbol}</span>
                    <span className="ml-2 text-blue-700">{cleanTickerName(selectedTicker.name)}</span>
                  </div>
                  <div className="text-sm text-blue-600">
                    {selectedTicker.sector} • {selectedTicker.country}
                  </div>
                </div>
              </div>
            )}
            
            <div className="ml-auto">
              <button
                onClick={handleAnalyze}
                disabled={!selectedTicker || isLoading}
                className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                  !selectedTicker || isLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-kelly-green text-white hover:bg-kelly-green/90'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Analyzing...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Analyze
                  </div>
                )}
              </button>
              {/* Removed progress bar, cancel, retry, status, and jobId displays for simplified UI */}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {isLoading && !analysis && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {[0,1,2].map(i => (
              <div key={i} className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-gray-200 animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-6 w-40 bg-gray-200 rounded" />
                  <div className="h-6 w-12 bg-gray-200 rounded" />
                </div>
                <div className="space-y-3">
                  <div className="h-4 w-full bg-gray-200 rounded" />
                  <div className="h-4 w-5/6 bg-gray-200 rounded" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}
        {analysis && (() => {
          const technicalAgent = getAgentByType(analysis.agents, 'technicals');
          const fundamentalsAgent = getAgentByType(analysis.agents, 'fundamentals');
          const newsAgent = getAgentByType(analysis.agents, 'news');
          const tradesAgent = getAgentByType(analysis.agents, 'trades');

          return (
            <div className="space-y-6">
              {/* Three Agent Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Technical Agent */}
                {technicalAgent && (
                  <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-kelly-green">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <TrendingUp className="h-6 w-6 text-kelly-green mr-3" />
                        <h3 className="text-lg font-semibold text-dark-green">Technical Agent</h3>
                      </div>
                      {technicalAgent.buyScore && (
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getBuyScoreColor(technicalAgent.buyScore)}`}>
                          {getBuyScoreIcon(technicalAgent.buyScore)}
                          {technicalAgent.buyScore}/10
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-dark-green/80 mb-1">Analysis</h4>
                        <div className="text-sm text-gray-600 leading-relaxed">
                          {renderMultiline(technicalAgent.summary)}
                        </div>
                      </div>
                      {technicalAgent.greenFlags.length > 0 && (
                        <div>
                          <h4 className="font-medium text-green-600 mb-1">✅ Green Flags</h4>
                          {renderBulletList(technicalAgent.greenFlags, 'text-green-500')}
                        </div>
                      )}
                      {technicalAgent.redFlags.length > 0 && (
                        <div>
                          <h4 className="font-medium text-red-600 mb-1">🚩 Red Flags</h4>
                          {renderBulletList(technicalAgent.redFlags, 'text-red-500')}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Fundamentals Agent */}
                {fundamentalsAgent && (
                  <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-yellow-green">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <DollarSign className="h-6 w-6 text-yellow-green mr-3" />
                        <h3 className="text-lg font-semibold text-dark-green">Fundamentals Agent</h3>
                      </div>
                      {fundamentalsAgent.buyScore && (
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getBuyScoreColor(fundamentalsAgent.buyScore)}`}>
                          {getBuyScoreIcon(fundamentalsAgent.buyScore)}
                          {fundamentalsAgent.buyScore}/10
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-dark-green/80 mb-1">Analysis</h4>
                        <div className="text-sm text-gray-600 leading-relaxed">
                          {renderMultiline(fundamentalsAgent.summary)}
                        </div>
                      </div>
                      {fundamentalsAgent.greenFlags.length > 0 && (
                        <div>
                          <h4 className="font-medium text-green-600 mb-1">✅ Green Flags</h4>
                          {renderBulletList(fundamentalsAgent.greenFlags, 'text-green-500')}
                        </div>
                      )}
                      {fundamentalsAgent.redFlags.length > 0 && (
                        <div>
                          <h4 className="font-medium text-red-600 mb-1">🚩 Red Flags</h4>
                          {renderBulletList(fundamentalsAgent.redFlags, 'text-red-500')}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* News Agent */}
                {newsAgent && (
                  <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-bittersweet-shimmer">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Newspaper className="h-6 w-6 text-bittersweet-shimmer mr-3" />
                        <h3 className="text-lg font-semibold text-dark-green">News Agent</h3>
                      </div>
                      {newsAgent.buyScore && (
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getBuyScoreColor(newsAgent.buyScore)}`}>
                          {getBuyScoreIcon(newsAgent.buyScore)}
                          {newsAgent.buyScore}/10
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      {newsAgent.extra?.sentiment && (
                        <div>
                          <h4 className="font-medium text-dark-green/80 mb-1">Market Sentiment</h4>
                          <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                            newsAgent.extra.sentiment.toLowerCase().includes('bull') ? 'bg-kelly-green/20 text-kelly-green' :
                            newsAgent.extra.sentiment.toLowerCase().includes('bear') ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {newsAgent.extra.sentiment}
                          </span>
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium text-dark-green/80 mb-1">Summary</h4>
                        <div className="text-sm text-gray-600 leading-relaxed">
                          {renderMultiline(newsAgent.summary)}
                        </div>
                      </div>
                      {newsAgent.extra?.impact && (
                        <div>
                          <h4 className="font-medium text-blue-600 mb-1">📈 Impact</h4>
                          {renderArrayAsBullets(newsAgent.extra.impact, 'text-blue-500')}
                        </div>
                      )}
                      {newsAgent.extra?.risks && (
                        <div>
                          <h4 className="font-medium text-red-600 mb-1">⚠️ Risks</h4>
                          {renderArrayAsBullets(newsAgent.extra.risks, 'text-red-500')}
                        </div>
                      )}
                      {newsAgent.extra?.catalysts && (
                        <div>
                          <h4 className="font-medium text-green-600 mb-1">🚀 Catalysts</h4>
                          {renderArrayAsBullets(newsAgent.extra.catalysts, 'text-green-500')}
                        </div>
                      )}
                      {newsAgent.extra?.coverage_note && (
                        <div>
                          <h4 className="font-medium text-gray-600 mb-1">📝 Coverage Note</h4>
                          <div className="text-xs text-gray-500 italic">
                            {newsAgent.extra.coverage_note}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Trade Agent Recommendation */}
              {tradesAgent && (
                <div className="bg-gradient-to-r from-kelly-green/10 to-yellow-green/10 rounded-lg shadow-lg p-6 border border-kelly-green/30">
                  <div className="flex items-center mb-4">
                    <Target className="h-6 w-6 text-kelly-green mr-3" />
                    <h3 className="text-xl font-semibold text-dark-green">Trade Agent Recommendation</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-medium text-dark-green/80 mb-2">Recommendation</h4>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        (tradesAgent.extra?.recommendation || tradesAgent.summary).toLowerCase().includes('buy') ? 'bg-kelly-green/20 text-kelly-green' :
                        (tradesAgent.extra?.recommendation || tradesAgent.summary).toLowerCase().includes('sell') ? 'bg-red-100 text-red-800' :
                        'bg-yellow-green/20 text-yellow-green'
                      }`}>
                        {tradesAgent.extra?.recommendation || 'See summary'}
                      </span>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-medium text-dark-green/80 mb-2">Buy Score</h4>
                      <div className={`flex items-center gap-2 ${tradesAgent.buyScore ? getBuyScoreColor(tradesAgent.buyScore) : 'text-gray-600'} font-semibold text-lg`}>
                        {tradesAgent.buyScore ? (
                          <>
                            {getBuyScoreIcon(tradesAgent.buyScore)}
                            {tradesAgent.buyScore}/10
                          </>
                        ) : (
                          'N/A'
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-medium text-dark-green/80 mb-2">Analysis For</h4>
                      <span className="text-lg font-semibold text-dark-green">{analysis.tickerSymbol}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 bg-white rounded-lg p-4">
                    {tradesAgent.summary && (
                      <>
                        <h4 className="font-medium text-dark-green/80 mb-2">Summary</h4>
                        <div className="text-sm text-gray-600 leading-relaxed mb-4">
                          {renderMultiline(tradesAgent.summary)}
                        </div>
                      </>
                    )}
                    {tradesAgent.extra?.trade_plan && (
                      <>
                        <h4 className="font-medium text-dark-green/80 mb-2">Trade Plan</h4>
                        <div className="text-sm text-gray-600 leading-relaxed mb-4">
                          {renderMultiline(tradesAgent.extra.trade_plan)}
                        </div>
                      </>
                    )}
                    {tradesAgent.extra?.reasoning && (
                      <>
                        <h4 className="font-medium text-dark-green/80 mb-2">Reasoning</h4>
                        <div className="text-sm text-gray-600 leading-relaxed">
                          {renderMultiline(formatTradeReasoning(tradesAgent.extra.reasoning))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* Empty State */}
        {!analysis && !isLoading && !error && (
          <div className="text-center py-16 bg-white rounded-lg shadow-lg">
            <Sparkles className="h-12 w-12 text-kelly-green mx-auto mb-4" />
            <h3 className="text-lg font-medium text-dark-green mb-2">Ready to Analyze</h3>
            <p className="text-dark-green/70">Select a stock above and click "Analyze"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Agents;