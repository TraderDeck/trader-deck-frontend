import { useState, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Ticker } from '../types/Ticker';
import { cleanTickerName } from '../utils/tickerUtils';

interface Props {
  tickers: Ticker[];
  onTickerSelect: (ticker: Ticker) => void;
  selectedTicker: Ticker | null;
  placeholder?: string;
  hideSelectedDisplay?: boolean;
}

const TickerSelector = ({ tickers, onTickerSelect, selectedTicker, placeholder = "Search for a stock...", hideSelectedDisplay = false }: Props) => {
  const [tickerInput, setTickerInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleMultiSelect = (inputValue: string) => {
    if (inputValue) {
      const symbol = inputValue.split(':')[0].trim();
      const ticker = tickers.find(t => t.symbol === symbol);
      
      if (ticker) {
        onTickerSelect(ticker);
      }
    }
    setTickerInput('');
  };

  const clearSelection = () => {
    setTickerInput('');
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-" />
        
        <input
          ref={inputRef}
          type="text"
          value={tickerInput}
          onChange={(e) => setTickerInput(e.target.value)}
          onBlur={() => handleMultiSelect(tickerInput)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleMultiSelect(tickerInput);
            }
          }}
          list="ticker-datalist"
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={placeholder}
        />
        
        {tickerInput && (
          <X 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 cursor-pointer hover:text-gray-600" 
            onClick={clearSelection}
          />
        )}
      </div>

      {/* Exact same datalist structure as PicksFilter */}
      <datalist id="ticker-datalist">
        {tickers.map(t => (
          <option key={t.name} value={`${t.symbol}: ${cleanTickerName(t.name)}`} />
        ))}
      </datalist>

      {selectedTicker && !hideSelectedDisplay && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
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
    </div>
  );
};

export default TickerSelector;