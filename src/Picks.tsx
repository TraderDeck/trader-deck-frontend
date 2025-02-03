

import { useState } from "react";
import TickerCard from "./components/TickerCard";
import useTickers from "./hooks/useTickers";


const Picks = () => {
    const [filters, setFilters] = useState<Record<string, any>>({
      symbol: "",
      name: "",
      industry: "",
      sector: "",
      marketCapMin: "",
    });

    const [submittedFilters, setSubmittedFilters] = useState<null | typeof filters>(null);

    const { tickers, loading, error } = useTickers(submittedFilters);
    console.log("tickers are: ", tickers);
  
    const handleChange = (e: { target: { name: any; value: any; }; }) => {
      setFilters({
        ...filters,
        [e.target.name]: e.target.value,
      });
    };
  
    const handleSubmit = (e: { preventDefault: () => void; }) => {
      e.preventDefault();
      setSubmittedFilters(filters);
      console.log("Fetching tickers with filters:", filters);
    };
  
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Search Tickers</h2>
  
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
          <input
            type="text"
            name="symbol"
            placeholder="Symbol"
            value={filters.symbol}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={filters.name}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="industry"
            placeholder="Industry"
            value={filters.industry}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="sector"
            placeholder="Sector"
            value={filters.sector}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="marketCapMin"
            placeholder="Min Market Cap"
            value={filters.marketCap}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Search
          </button>
        </form>
  
        {loading && <p>Loading tickers...</p>}
        {error && <p className="text-red-500">Error: {error.message}</p>}
  
        <div className="mt-4">
          {tickers.length > 0 ? (
            tickers.map((ticker) => <TickerCard key={ticker.symbol} ticker={ticker} />)
          ) : (
            <p>No tickers found.</p>
          )}
        </div>
      </div>
    );
  };

export default Picks;
