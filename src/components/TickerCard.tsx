import { Ticker } from "../types/Ticker";
import { SquarePlay, Square, SquareSigma } from "lucide-react";
import { useState } from "react";


interface Props {
  ticker: Ticker;
}


const TickerCard = ({ ticker }: Props) => {


const [checked, setChecked] = useState<boolean>(false); 

  return (
    // <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
    //   <h3 className="text-xl font-bold">{ticker.name} ({ticker.symbol})</h3>
    //   <p>Industry: {ticker.industry}</p>
    //   <p>Sector: {ticker.sector}</p>
    //   <p>Market Cap: {ticker.marketCap}</p>
    // </div>

    <div className="w-full h-auto flex relative shadow-md pt-4 pb-4 ">
      <div className="w-1/5 h-ful text-center border-2 pt-4" >
       Logo
      </div>
      
      <div className="w-4/5 h-full flex flex-col">
        <div className="h-1/2 flex">
          <div className="w-full relative flex space-x-2">
 
          <p className="text-l font-bold ml-2"> {ticker.symbol}</p>

          <p className="text-l"> {ticker.name} </p>

          
            <div className="ml-auto top-0 w-1/8 h-full">
            <button
              onClick={() => setChecked(!checked)}
              className="flex ml-auto pr-2 items-center space-x-2 focus:outline-none"
            >
              {checked ? (
                <SquarePlay className="w-6 h-6 text-green-500" />
              ) : (
                <Square className="w-6 h-6 text-gray-500" />
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