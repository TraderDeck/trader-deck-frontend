import React, { useState, useRef, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import { CategorizedTicker, tickerPicksFilters} from '../types/Ticker';
import { TickerCategory} from "../types/Ticker";
import {TICKER_CATEGORIES} from "../constants/Ticker";
import { cleanTickerName } from '../utils/tickerUtils';
import { SquarePlay, Square, SquareSigma } from "lucide-react";


interface Props {
    tickers: CategorizedTicker[];
    appliedFilters: tickerPicksFilters;
    onFilterApply: (selectedFilters: tickerPicksFilters) => void;
  }


const FilterMenu = ({ tickers, appliedFilters, onFilterApply }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [selectedCategories, setSelectedCategories] = useState<TickerCategory[]>(appliedFilters.categories || []);
  const [selectedTickers, setSelectedTickers] = useState<string[]>(appliedFilters.tickers || []);
  const [selectedSectors, setSelectedSectors] = useState<string[]>(appliedFilters.sectors || []);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(appliedFilters.industries || []);
  const [selectedCountries, setSelectedCountries] = useState<string[]>(appliedFilters.countries || []);
  const [minMarketCap, setMinMarketCap] = useState<string>(appliedFilters.minMarketCap ?? '');
  const [maxMarketCap, setMaxMarketCap] = useState<string>(appliedFilters.maxMarketCap ?? '');

  useEffect(() => {
    setSelectedCategories(appliedFilters.categories || []);
    setSelectedTickers(appliedFilters.tickers || []);
    setSelectedSectors(appliedFilters.sectors || []);
    setSelectedIndustries(appliedFilters.industries || []);
    setSelectedCountries(appliedFilters.countries || []);
    setMinMarketCap(appliedFilters.minMarketCap || '');
    setMaxMarketCap(appliedFilters.maxMarketCap || '');
  }, [appliedFilters]);

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

  const toggleCategory = (category: TickerCategory) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };
  
  const applyFilters = () => {
    setIsMenuOpen(false);
  
    onFilterApply({
      categories: selectedCategories,
      tickers: selectedTickers,
      sectors: selectedSectors,
      industries: selectedIndustries,
      countries: selectedCountries,
      minMarketCap,
      maxMarketCap
    });
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        event.target instanceof Node && 
        !menuRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [])
  

  return (
    <div className="relative ml-12" ref={menuRef}>
      <button onClick={toggleMenu} className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center">
        {isMenuOpen ? 'Close Filters' : 'Open Filters'}
        {(selectedTickers.length > 0 || selectedSectors.length > 0 || selectedIndustries.length > 0 || selectedCountries.length > 0 || minMarketCap || maxMarketCap) && <Filter size={16} className="ml-2 text-yellow-500" />}
      </button>
      {isMenuOpen && (
        
        <div className="absolute left-0 top-full mt-2 w-80 bg-white p-4 border rounded shadow-lg z-50">
          
          <div className="mt-2">
          <h4 className="font-semibold">Categories</h4>
          <div className="flex space-x-4 mt-1">
            <div 
              className={`p-2 border-3 rounded cursor-pointer ${selectedCategories.includes(TICKER_CATEGORIES.PLAYING) ? 'border-blue-500' : 'border-gray-300'}`} 
              onClick={() => toggleCategory(TICKER_CATEGORIES.PLAYING)}
            >
              <SquarePlay className="w-6 h-6 text-kelly-green" />
            </div>
            <div 
              className={`p-2 border-3 rounded cursor-pointer ${selectedCategories.includes(TICKER_CATEGORIES.CONSIDERING) ? 'border-blue-500' : 'border-gray-300'}`} 
              onClick={() => toggleCategory(TICKER_CATEGORIES.CONSIDERING)}
            >
              <SquareSigma className="w-6 h-6 text-yellow-green" />
            </div>
            <div 
              className={`p-2 border-3 rounded cursor-pointer ${selectedCategories.includes(TICKER_CATEGORIES.NONE) ? 'border-blue-500' : 'border-gray-300'}`} 
              onClick={() => toggleCategory(TICKER_CATEGORIES.NONE)}
            >
              <Square className="w-6 h-6 text-bittersweet-shimmer" />
            </div>
          </div>
        </div>

          <div className="mt-2">
            <h4 className="font-semibold">Ticker</h4>
            <input
              type="text"
              value={tickerInput}
              onChange={(e) => setTickerInput(e.target.value)}
              onBlur={() => handleMultiSelect(tickerInput, selectedTickers, setSelectedTickers, setTickerInput)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleMultiSelect(tickerInput, selectedTickers, setSelectedTickers, setTickerInput)
                }
              }}
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
