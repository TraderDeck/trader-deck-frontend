import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Check, Filter, X } from 'lucide-react';
import { Ticker } from '../types/Ticker';
import { cleanTickerName } from '../utils/tickerUtils';

interface Props {
    tickers: Ticker[];
    onFilterApply: (filteredTickers: Ticker[]) => void;
}


const FilterMenu = ({ tickers, onFilterApply }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [minMarketCap, setMinMarketCap] = useState('');
  const [maxMarketCap, setMaxMarketCap] = useState('');
  const [tickerInput, setTickerInput] = useState('');
  const [sectorInput, setSectorInput] = useState('');
  const [industryInput, setIndustryInput] = useState('');
  const [countryInput, setCountryInput] = useState('');

  const uniqueSectors = [...new Set(tickers.map(ticker => ticker.sector))];
  const uniqueCountries = [...new Set(tickers.map(ticker => ticker.country))];
  const uniqueIndustries = [...new Set(tickers.map(ticker => ticker.industry))];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMultiSelect = (inputValue: string, selectedValues: string[], setSelectedValues: React.Dispatch<React.SetStateAction<string[]>>, setInput: React.Dispatch<React.SetStateAction<string>>) => {
    if (inputValue && !selectedValues.includes(inputValue)) {
      setSelectedValues([...selectedValues, inputValue]);
    }
    setInput('');
  };
  
  const applyFilters = () => {

    const filteredTickers = tickers.filter(ticker => 
      (selectedTickers.length === 0 || selectedTickers.includes(`${ticker.symbol}: ${ticker.name}`)) &&
      (selectedSectors.length === 0 || selectedSectors.includes(ticker.sector ?? '')) &&
      (selectedIndustries.length === 0 || selectedIndustries.includes(ticker.industry ?? '')) &&
      (selectedCountries.length === 0 || selectedCountries.includes(ticker.country ?? '')) &&
      (!minMarketCap || (ticker.marketCap ?? 0) >= parseFloat(minMarketCap) * 1_000_000) &&
      (!maxMarketCap || (ticker.marketCap ?? 0) <= parseFloat(maxMarketCap) * 1_000_000)
    );
    console.log("selected countries: ", selectedCountries);
    onFilterApply(filteredTickers);
    setIsMenuOpen(false);
  };

  return (
    <div className="relative">
      <button onClick={toggleMenu} className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center">
        {isMenuOpen ? 'Close Filters' : 'Open Filters'}
        {(selectedTickers.length > 0 || selectedSectors.length > 0 || selectedIndustries.length > 0 || selectedCountries.length > 0 || minMarketCap || maxMarketCap) && <Filter size={16} className="ml-2 text-yellow-500" />}
      </button>
      {isMenuOpen && (
        <div className="absolute left-0 top-full mt-2 w-80 bg-white p-4 border rounded shadow-lg z-50">
          
          <div className="mt-2">
            <h4 className="font-semibold">Ticker</h4>
            <input
              type="text"
              value={tickerInput}
              onChange={(e) => setTickerInput(e.target.value)}
              onBlur={() => handleMultiSelect(tickerInput, selectedTickers, setSelectedTickers, setTickerInput)}
              list="tickers"
              className="w-full p-2 border rounded mt-1"
              placeholder="Search ticker..."
            />
            <datalist id="tickers">
              {tickers.map(t => (
                <option key={t.name} value={`${t.symbol}: ${cleanTickerName(t.name)}`} />
              ))}
            </datalist>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedTickers.map(t => (
                <span key={t} className="px-2 py-1 bg-gray-200 rounded flex items-center">
                  {t} <X size={12} className="ml-1 cursor-pointer" onClick={() => setSelectedTickers(selectedTickers.filter(item => item !== t))} />
                </span>
              ))}
            </div>
          </div>
          
          <div className="mt-2">
            <h4 className="font-semibold">Sector</h4>
            <input
              type="text"
              value={sectorInput}
              onChange={(e) => setSectorInput(e.target.value)}
              onBlur={() => handleMultiSelect(sectorInput, selectedSectors, setSelectedSectors, setSectorInput)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleMultiSelect(sectorInput, selectedSectors, setSelectedSectors, setSectorInput)
                }
              }}
              list="sectors"
              className="w-full p-2 border rounded mt-1"
              placeholder="Search sector..."
            />
            <datalist id="sectors">
              {uniqueSectors.map(s => (
                <option key={s} value={s ?? ''} />
              ))}
            </datalist>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedSectors.map(t => (
                <span key={t} className="px-2 py-1 bg-gray-200 rounded flex items-center">
                  {t} <X size={12} className="ml-1 cursor-pointer" onClick={() => setSelectedSectors(selectedSectors.filter(item => item !== t))} />
                </span>
              ))}
            </div>
          </div>

          <div className="mt-2">
            <h4 className="font-semibold">Industry</h4>
            <input
              type="text"
              value={industryInput}
              onChange={(e) => setIndustryInput(e.target.value)}
              onBlur={() => handleMultiSelect(industryInput, selectedIndustries, setSelectedIndustries, setIndustryInput)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleMultiSelect(industryInput, selectedIndustries, setSelectedIndustries, setIndustryInput)
                }
              }}
              list="industries"
              className="w-full p-2 border rounded mt-1"
              placeholder="Search industry..."
            />
            <datalist id="industries">
              {uniqueIndustries.map(i => (
                <option key={i} value={i ?? ''} />
              ))}
            </datalist>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedIndustries.map(t => (
                <span key={t} className="px-2 py-1 bg-gray-200 rounded flex items-center">
                  {t} <X size={12} className="ml-1 cursor-pointer" onClick={() => setSelectedIndustries(selectedIndustries.filter(item => item !== t))} />
                </span>
              ))}
            </div>
          </div>

          <div className="mt-2">
            <h4 className="font-semibold">Market Cap ($Million)</h4>
            <input 
              type="number" 
              value={minMarketCap} 
              onChange={(e) => setMinMarketCap(e.target.value)}
              className="w-full p-2 border rounded mt-1"
              placeholder="Min Market Cap"
            />
            <input 
              type="number" 
              value={maxMarketCap} 
              onChange={(e) => setMaxMarketCap(e.target.value)}
              className="w-full p-2 border rounded mt-1"
              placeholder="Max Market Cap"
            />
          </div>
          
          <div className="mt-2">
            <h4 className="font-semibold">Country</h4>
            <input
              type="text"
              value={countryInput}
              onChange={(e) => setCountryInput(e.target.value)}
              onBlur={() => handleMultiSelect(countryInput, selectedCountries, setSelectedCountries, setCountryInput)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                    handleMultiSelect(countryInput, selectedCountries, setSelectedCountries, setCountryInput)
                }
              }}
              list="countries"
              className="w-full p-2 border rounded mt-1"
              placeholder="Search country..."
            />
            <datalist id="countries">
              {uniqueCountries.map(c => (
                <option key={c} value={c ?? ''} />
              ))}
            </datalist>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedCountries.map(t => (
                <span key={t} className="px-2 py-1 bg-gray-200 rounded flex items-center">
                  {t} <X size={12} className="ml-1 cursor-pointer" onClick={() => setSelectedCountries(selectedCountries.filter(item => item !== t))} />
                </span>
              ))}
            </div>
          </div>

          <button onClick={applyFilters} className="mt-4 w-full bg-green-500 text-white p-2 rounded">Apply Filters</button>
        </div>
      )}
    </div>
  );
};

export default FilterMenu;
