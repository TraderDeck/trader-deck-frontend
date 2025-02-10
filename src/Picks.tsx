import { useEffect, useState, useRef } from "react";
import useTickers from "./hooks/useTickers";
import { Eye, Filter, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import TickerCard from "./components/TickerCard";




const Picks = () => {
    const [filters, setFilters] = useState<Record<string, any>>({
      symbol: "",
      name: "",
      industry: "", 
      sector: "",
      marketCapMin: "",
    });

    const [submittedFilters, setSubmittedFilters] = useState<null | typeof filters>(null);

    const { tickers, loading, error } = useTickers(submittedFilters);


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
          console.log("current page is set and it is : ", currentPage);
          console.log("ticker are: ", tickers);
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
  
      console.log("Iam here2");
  
      window.addEventListener("resize", updateItemsPerPage);
      updateItemsPerPage(); 
      console.log("Iam here3");
  
      return () => window.removeEventListener("resize", updateItemsPerPage);
    }, []);
  
    if (itemsPerPage === 0) return null;
  
    const totalPages = Math.ceil(tickers.length / itemsPerPage);
    const currentTickers = tickers.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    useEffect(()=> {
      updatePageNumber();

    }, [inputValue]); 


    useEffect(()=> {
      console.log("setting submitted filters...");
      setSubmittedFilters({
        symbol: "",
        name: "",
        industry: "", 
        sector: "Technology",
        marketCapMin: "",
      });

    }, []); 





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
  
    return (
      //      <div className="flex flex-col min-h-screen">

      <div className="flex flex-col min-h-screen">
        <div className="h-12 bg-parchment border-b-4 border-b-parchment shadow-md flex space-x-4 p-4 items-center">
        <Eye className="w-6 h-6 text-bittersweet-shimmer ml-8 mr-6" />
        <Filter className="w-6 h-6 text-green-500" />

        <ChevronUp className="w-6 h-6 text-gray-700" />
        <ChevronDown className="w-6 h-6 text-gray-700" />
        <ChevronLeft className="w-6 h-6 text-gray-700 cursor-pointer hover:text-black" 
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
        <ChevronRight className="w-6 h-6 text-gray-700 cursor-pointer hover:text-black" 
        onClick={() => SetPrevOrNextPage(true)} /> 

      
        </div>
 
        <div className="ml-6 mr-6 mt-2 flex flex-grow"> 
 
          <div ref={containerRef} className="w-3/10 bg-gray-50"> 
          {currentTickers.map((ticker) => <TickerCard key={ticker.symbol} ticker={ticker} />)}

          </div>

          <div className="w-7/10 bg-red-300"> 

          {/* <TickerList tickers={}\> */}


          </div>

          {/* <h2 className="text-2xl font-bold mb-4">Search Tickers</h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
            <input
              type="text"
              name="symbol"
              placeholder="Symbol"
              value={filters.symbol}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={filters.name}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="industry"
              placeholder="Industry"
              value={filters.industry}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="sector"
              placeholder="Sector"
              value={filters.sector}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              type="number"
              name="marketCapMin"
              placeholder="Min Market Cap"
              value={filters.marketCap}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
              Search
            </button>
          </form> */}

          {/* {loading && <p>Loading tickers...</p>}
          {error && <p className="text-red-500">Error: {error.message}</p>} */}

          {/* <div className="mt-4">
            {tickers.length > 0 ? (
              tickers.map((ticker) => <TickerCard key={ticker.symbol} ticker={ticker} />)
            ) : (
              <p>No tickers found.</p>
            )}
          </div> */}
        </div>

      </div>
    );
  };

export default Picks;
