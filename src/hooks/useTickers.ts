import { useState, useEffect } from "react";
import { fetchTickers } from "../api/tickerService";
import { Ticker } from "../types/Ticker";
import { fetchTickerLogosPresignedUrls } from "../api/s3/getPresignedUrls";


const useTickers = (filters: Record<string, any> | null) => {
  const [tickers, setTickers] = useState<Ticker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!filters || Object.values(filters).every(value => !value)) return; 

    const filteredFilters =  Object.fromEntries(
        Object.entries(filters).filter(([key, value]) => value !== "")
      );

    setLoading(true);
    fetchTickers(filteredFilters)
      .then(async (tickerList) => {

        const tickerSymbols = tickerList.map((ticker) => ticker.symbol);

        if (tickerSymbols.length > 0) {
          const logoUrls = await fetchTickerLogosPresignedUrls(tickerSymbols);
          const updatedTickers = tickerList.map((ticker) => ({
            ...ticker,
            logoUrl: logoUrls.find((logo) => logo.key.includes(ticker.symbol))?.url || "",
          }));

          setTickers(updatedTickers); 
      }
  })
      .catch(setError)
      .finally(() => setLoading(false));

  
  }, [filters]);

  return { tickers, loading, error };
};

export default useTickers;