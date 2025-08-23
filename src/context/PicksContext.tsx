import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CategorizedTicker, tickerPicksFilters } from '../types/Ticker';

export type SortOption = { field: 'symbol' | 'name' | 'marketCap'; order: 'asc' | 'desc' };

interface PicksStateContextValue {
  selectedFilters: tickerPicksFilters;
  setSelectedFilters: React.Dispatch<React.SetStateAction<tickerPicksFilters>>;
  sortOption: SortOption;
  setSortOption: React.Dispatch<React.SetStateAction<SortOption>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  activeTicker: CategorizedTicker | null;
  setActiveTicker: React.Dispatch<React.SetStateAction<CategorizedTicker | null>>;
  categorizedTickers: CategorizedTicker[];
  setCategorizedTickers: React.Dispatch<React.SetStateAction<CategorizedTicker[]>>;
  filteredTickers: CategorizedTicker[];
  setFilteredTickers: React.Dispatch<React.SetStateAction<CategorizedTicker[]>>;
}

const defaultFilters: tickerPicksFilters = {
  categories: [],
  tickers: [],
  sectors: [],
  industries: [],
  countries: [],
  minMarketCap: '',
  maxMarketCap: ''
};

const PicksStateContext = createContext<PicksStateContextValue | undefined>(undefined);

export const PicksStateProvider = ({ children }: { children: ReactNode }) => {
  const [selectedFilters, setSelectedFilters] = useState<tickerPicksFilters>(defaultFilters);
  const [sortOption, setSortOption] = useState<SortOption>({ field: 'symbol', order: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValue, setInputValue] = useState('1');
  const [activeTicker, setActiveTicker] = useState<CategorizedTicker | null>(null);
  const [categorizedTickers, setCategorizedTickers] = useState<CategorizedTicker[]>([]);
  const [filteredTickers, setFilteredTickers] = useState<CategorizedTicker[]>([]);

  return (
    <PicksStateContext.Provider value={{
      selectedFilters,
      setSelectedFilters,
      sortOption,
      setSortOption,
      currentPage,
      setCurrentPage,
      inputValue,
      setInputValue,
      activeTicker,
      setActiveTicker,
      categorizedTickers,
      setCategorizedTickers,
      filteredTickers,
      setFilteredTickers
    }}>
      {children}
    </PicksStateContext.Provider>
  );
};

export const usePicksState = () => {
  const ctx = useContext(PicksStateContext);
  if (!ctx) throw new Error('usePicksState must be used within PicksStateProvider');
  return ctx;
};
