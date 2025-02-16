import { useEffect, useState, useRef } from "react";
import useTickers from "./hooks/useTickers";
import { Ticker, CategorizedTicker, TickerCategory } from "./types/Ticker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TickerCard from "./components/TickerCard";
import PicksFilter from "./components/PicksFilter";
import SortMenu from "./components/SortMenu";
import PicksDateSelector from "./components/PicksCalendar";
import { TICKER_CATEGORIES } from "./constants/Ticker";





const Picks = () => {

    const [filters, setFilters] = useState<Record<string, any>>({
      symbol: "",
      name: "",
      industry: "", 
      sector: "",
      marketCapMin: "",
    });
    const [selectedDate, setSelectedDate] = useState<string>(() => {
      const today = new Date();
      return today.toISOString().split("T")[0]; 
    });

    const [submittedFilters, setSubmittedFilters] = useState<null | typeof filters>(null);
    
    const { tickers, loading, error } = useTickers(submittedFilters);

    const [categorizedTickers, setCategorizedTickers] = useState<CategorizedTicker[]>([]);

    const [filteredTickers, setFilteredTickers] = useState<CategorizedTicker[]>(categorizedTickers); 

    const [sortOption, setSortOption] = useState({ field: "symbol", order: "asc" });
  
    const sortedTickers = [...filteredTickers].sort((a, b) => {
      const { field, order } = sortOption;
    
      if (field === "marketCap") {
        const valueA = a.marketCap ?? 0;
        const valueB = b.marketCap ?? 0;
        return order === "asc" ? valueA - valueB : valueB - valueA;
      } else {
        return order === "asc"
          ? (a[field as keyof Ticker] as string).localeCompare(b[field as keyof Ticker] as string)
          : (b[field as keyof Ticker] as string).localeCompare(a[field as keyof Ticker] as string);
      }
    });
    
    //pagination 
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const containerRef = useRef<HTMLDivElement | null>(null); 
    const [inputValue, setInputValue] = useState("1");
    const inputRef = useRef<HTMLInputElement>(null);
  
    
    const SetPrevOrNextPage = (forward: boolean) => {
      if (forward){
          setInputValue(Math.min(Number(inputValue) + 1, totalPages).toString()); 
      }else {
        setInputValue(Math.max(Number(inputValue) - 1, 1).toString());

      }
    }
    
  
    useEffect(() => {
      const updateItemsPerPage = () => {
  
        if (containerRef.current) {
          const itemHeight = 76; 
          const minVisibleItems = 3; 
          const maxVisibleItems = Math.floor((window.innerHeight -200) / itemHeight);
          setItemsPerPage(Math.max(minVisibleItems, maxVisibleItems));
        }
      };

  
      window.addEventListener("resize", updateItemsPerPage);
      updateItemsPerPage(); 
  
      return () => window.removeEventListener("resize", updateItemsPerPage);
    }, []);
  
    if (itemsPerPage === 0) return null;
  
    const totalPages = Math.ceil(sortedTickers.length / itemsPerPage);
    const currentTickers = sortedTickers.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    useEffect(()=> {
      updatePageNumber();

    }, [inputValue]); 

    // submitting filters at the beginning (testing)
    useEffect(()=> {
      console.log("setting submitted filters...");
      setSubmittedFilters({
        symbol: "",
        name: "",
        industry: "", 
        sector: "Technology",
        marketCapMin: "1000000000",
      });
    }, []); 

    //After tickers are retrieved
    useEffect(()=> {
      setCategorizedTickers( tickers.map((ticker) => ({
        ...ticker,
        category: TICKER_CATEGORIES.NONE,
      })) );
      setFilteredTickers(categorizedTickers);
    }, [tickers]); 

    //after categorizedTickers change
    useEffect(()=> {
      setFilteredTickers(categorizedTickers);
    }, [categorizedTickers]); 





    const handlePageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
    };
  
    const updatePageNumber = () => {
      const pageNumber = Number(inputValue);

      if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
      } else {
        setInputValue(currentPage.toString()); // Reset if invalid
      }
    };
  
    const handleBlur = () => {
      updatePageNumber();
    };
  
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        updatePageNumber();
        inputRef.current?.blur(); // Remove focus after entering a valid number
      }
    };

    const handleApplyFilters = (filteredTickers: CategorizedTicker[]) => {
      setFilteredTickers(filteredTickers); 
      setCurrentPage(1); 
    };

    const handleDateChange = (date: Date) => {
      const formattedDate = date.toISOString().split("T")[0]; // Convert Date to 'YYYY-MM-DD'
      setSelectedDate(formattedDate);
  
      console.log("Selected Date (DB Format):", formattedDate);
    };

    const updateCategory = (symbol: string, category: TickerCategory) => {
      const currentTickerSymbols = new Set(currentTickers.map((t) => t.symbol));
     
      setCategorizedTickers((prev) =>
        prev.map((ticker) =>
          currentTickerSymbols.has(ticker.symbol) && ticker.symbol === symbol
            ? { ...ticker, category }
            : ticker
        )
      );
    };
    

    return (
      //      <div className="flex flex-col min-h-screen">

      <div className="flex flex-col min-h-screen">
        <div className="h-12 bg-parchment border-b-4 border-b-parchment shadow-md flex space-x-4 p-4 items-center">
        <div className="ml-6 mr-12">
        <SortMenu setSortOption={setSortOption} />
        </div>
        <PicksFilter tickers={categorizedTickers} onFilterApply={handleApplyFilters}/>

        <ChevronLeft className="w-6 h-6 ml-12 text-gray-700 cursor-pointer hover:text-black" 
        onClick={() => SetPrevOrNextPage(false)} />
        <p> Page  
        <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handlePageChange}
        onBlur={handleBlur} 
        onKeyDown={handleKeyDown}
        className="w-6 ml-2 text-centerfocus:ring font-bold focus:ring-kelly-green"
        /> 
        of <span className ="ml-2 font-bold"> {totalPages} </span>
         </p>
        <ChevronRight className="w-6 h-6 mr-30 text-gray-700 cursor-pointer hover:text-black" 
        onClick={() => SetPrevOrNextPage(true)} /> 

        <PicksDateSelector onDateChange={handleDateChange}/>
        </div>
 
        <div className="ml-6 mr-6 mt-2 flex flex-grow"> 
 
          <div ref={containerRef} className="w-3/10 bg-gray-50"> 
          {currentTickers.map((ticker) => <TickerCard key={ticker.symbol} ticker={ticker} updateCategory={updateCategory} />)}

          </div>

          <div className="w-7/10 bg-red-300"> 

          {/* <TickerList tickers={}\> */}


          </div>

        </div>

      </div>
    );
  };

export default Picks;
