import { CategorizedTicker } from "../types/Ticker";
import { TickerCategory} from "../types/Ticker";
import {TICKER_CATEGORIES, SECTOR_FONT_MAP} from "../constants/Ticker";

import { SquarePlay, Square, SquareSigma, HelpCircle } from "lucide-react";
import { useState } from "react";
import { cleanTickerName } from "../utils/tickerUtils";
import { toCamelCase } from "../utils/stringUtils";

const CATEGORY_TOOLTIPS: Record<TickerCategory, string> = {
  [TICKER_CATEGORIES.PLAYING]: "Playing: To be executed",
  [TICKER_CATEGORIES.CONSIDERING]: "Considering: Under research",
  [TICKER_CATEGORIES.NONE]: "None: No action taken",
};

interface Props {
  ticker: CategorizedTicker;
  active: boolean;
  updateCategory: (symbol: string, category: TickerCategory) => void;
  onClick: (symbol: string) => void;
}

const TickerCard = ({ ticker, active, updateCategory, onClick }: Props) => {
  const [category, setCategory] = useState<TickerCategory>(ticker.category);
  const tickerFont = ticker.sector? `text-l font-${toCamelCase(ticker.sector)}`: "text-l"; 

  const fontFamily = ticker.sector? SECTOR_FONT_MAP[toCamelCase(ticker.sector)] || "sans-serif": "Satoshi, sans-serif";


  const handleClick = () => {
    let newCategory: TickerCategory =
      category === TICKER_CATEGORIES.NONE
        ? TICKER_CATEGORIES.CONSIDERING
        : category === TICKER_CATEGORIES.CONSIDERING
        ? TICKER_CATEGORIES.PLAYING
        : TICKER_CATEGORIES.NONE;

    setCategory(newCategory);
    updateCategory(ticker.symbol, newCategory);
  };

  return (

    <div 
    className={`w-full h-auto flex relative shadow-md pb-4 cursor-pointer transition duration-200 
      border-3 rounded-md hover:border-gray-400 
      ${active ? 'border-dark-green' : 'border-transparent'}`}
    onClick={() => onClick(ticker.symbol)}
    >
      <div className="w-1/5 h-full max-w-26 pt-4 pl-2" >

      {ticker.logoUrl &&
      <img
            src={ticker.logoUrl}
            alt={ticker.symbol}
            className="w-16 h-16 object-contain border border-gray-300 rounded-lg bg-dark-green"
          />
      }
      {!ticker.logoUrl &&
          <div className="flex items-center justify-center w-16 h-16 object-contain border border-gray-300 rounded-lg bg-dark-green">
            <HelpCircle size={24} className="text-white" />
          </div>
      }
      </div>

      
      <div className="w-4/5 h-full flex flex-col">
        <div className="h-1/2 flex">
          <div className="w-full relative flex space-x-2">


            <div className="flex space-x-2 mt-4">
          
              <p className="text-l font-bold ml-2 "> {ticker.symbol}</p>
              <p className={tickerFont} style={{ fontFamily}}> {cleanTickerName(ticker.name)} </p>
        
            </div>
          
            <div className="ml-auto top-0 w-1/8 h-full mt-2">
            <div className="relative group flex ml-auto pr-2 items-center">
            <button onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }} 
            className="flex items-center space-x-2 focus:outline-none">
                {category === TICKER_CATEGORIES.PLAYING ? (
                  <SquarePlay className="w-8 h-8 text-kelly-green" />
                ) : category === TICKER_CATEGORIES.CONSIDERING ? (
                  <SquareSigma className="w-8 h-8 text-yellow-green" />
                ) : (
                  <Square className="w-8 h-8 text-bittersweet-shimmer" />
                )}
              </button>
              <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-1 whitespace-nowrap rounded bg-black/80 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-75 z-50">
                {CATEGORY_TOOLTIPS[category]}
              </span>
            </div>
            </div>

          </div>
        </div>
        
        <div className="h-1/2 ">
          <p className="text-sm ml-2"> {ticker.industry + ' (' + ticker.sector + ')  / ' +  (ticker.country === 'United States'? 'USA': ticker.country )} </p>
        </div>
      </div>
    </div>
  );
};

export default TickerCard;