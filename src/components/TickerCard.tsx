import { CategorizedTicker } from "../types/Ticker";
import { TickerCategory} from "../types/Ticker";
import {TICKER_CATEGORIES} from "../constants/Ticker";

import { SquarePlay, Square, SquareSigma, HelpCircle } from "lucide-react";
import { useState } from "react";
import { cleanTickerName } from "../utils/tickerUtils";


interface Props {
  ticker: CategorizedTicker;
  updateCategory: (symbol: string, category: TickerCategory) => void;
}


const TickerCard = ({ ticker, updateCategory }: Props) => {
  const [category, setCategory] = useState<TickerCategory>(ticker.category);


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

    <div className="w-full h-auto flex relative shadow-md pt-4 pb-4 ">
      <div className="w-1/5 h-full pt-4" >

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
 
          <p className="text-l font-bold ml-2"> {ticker.symbol}</p>

          <p className="text-l"> {cleanTickerName(ticker.name)} </p>

          
            <div className="ml-auto top-0 w-1/8 h-full">
            <button onClick={handleClick} className="flex ml-auto pr-2 items-center space-x-2 focus:outline-none">
                {category === TICKER_CATEGORIES.PLAYING ? (
                  <SquarePlay className="w-6 h-6 text-kelly-green" />
                ) : category === TICKER_CATEGORIES.CONSIDERING ? (
                  <SquareSigma className="w-6 h-6 text-yellow-green" />
                ) : (
                  <Square className="w-6 h-6 text-bittersweet-shimmer" />
                )}
              </button>
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