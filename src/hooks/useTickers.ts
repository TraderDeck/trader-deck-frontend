import { useState, useEffect } from "react";
import { fetchTickers } from "../api/tickerService";
import { Ticker } from "../types/Ticker";


const useTickers = (filters: Record<string, any> | null) => {
  const [tickers, setTickers] = useState<Ticker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log("api trying to get called...filters are", filters);
    if (!filters || Object.values(filters).every(value => !value)) return; 

    const filteredFilters =  Object.fromEntries(
        Object.entries(filters).filter(([key, value]) => value !== "")
      );

    setLoading(true);
    fetchTickers(filteredFilters)
      .then(setTickers)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [filters]);

  return { tickers, loading, error };
};

export default useTickers;