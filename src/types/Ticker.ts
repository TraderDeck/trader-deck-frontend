import { TICKER_CATEGORIES } from "../constants/Ticker";

export type Ticker = {
    symbol: string;
    name: string | null;
    country: string | null;
    industry: string | null;
    sector: string | null;
    marketCap: number | null;
    logoUrl? : string; 
};

  
export type TickerCategory = (typeof TICKER_CATEGORIES)[keyof typeof TICKER_CATEGORIES];
  
export interface CategorizedTicker extends Ticker {
  category: TickerCategory;
}
 
export type tickerPicksFilters = {
  categories: TickerCategory[];
  tickers: string[];
  sectors: string[];
  industries: string[];
  countries: string[];
  minMarketCap: string;
  maxMarketCap: string;
}
