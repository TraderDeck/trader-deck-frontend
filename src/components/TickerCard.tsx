import { Ticker } from "../types/Ticker";

interface Props {
  ticker: Ticker;
}

const TickerCard = ({ ticker }: Props) => {
  return (
    <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-xl font-bold">{ticker.name} ({ticker.symbol})</h3>
      <p>Industry: {ticker.industry}</p>
      <p>Sector: {ticker.sector}</p>
      <p>Market Cap: {ticker.marketCap}</p>
    </div>
  );
};

export default TickerCard;