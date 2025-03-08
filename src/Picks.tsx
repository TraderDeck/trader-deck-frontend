import { useEffect, useState, useRef } from "react";
import useTickers from "./hooks/useTickers";
import { cleanTickerName } from './utils/tickerUtils';
import { Ticker, CategorizedTicker, TickerCategory, tickerPicksFilters } from "./types/Ticker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TickerCard from "./components/TickerCard";
import PicksFilter from "./components/PicksFilter";
import SortMenu from "./components/SortMenu";
import PicksDateSelector from "./components/PicksCalendar";
import { TICKER_CATEGORIES } from "./constants/Ticker";
import NotesEditor from "./components/ui/NotesEditor";
import {
  fetchResearchNotesForTickers,
  fetchResearchNoteForTicker,
  saveResearchNote
} from "./api/researchNoteService"; 
import {
  fetchImplementationNoteForTicker,
  saveImplementationNote
} from "./api/implementationNoteService"; 
import { CollapsibleSection } from "./components/ui/CollapsibleSection";
import {saveTickerCategory} from "./api/tickerCategoryService"; 
import { getCurrentCategories } from "./api/tickerCategoryService";


const NBR_TICKERS_PER_PAGE = 5;
const INIT_IMPLEMENTATION_NOTE_CONTENT = "<ul><li><p><strong>When to buy  ? : </strong></p></li><li><p><strong>How much to buy ? :</strong></p></li><li><p><strong>When to sell ? :</strong></p></li></ul>";

const Picks = () => {

  /*============= Active elements ==============*/
    const [filters] = useState<Record<string, any>>({
      symbol: "",
      name: "",
      industry: "", 
      sector: "",
      marketCapMin: "",
    });

    // const [selectedDate, setSelectedDate] = useState<string>(() => {
    //   const today = new Date();
    //   return today.toISOString().split("T")[0]; 
    // });

    const [activeTicker, setActiveTicker] = useState<CategorizedTicker | null>(null);

    //For testing to get tickers from db (this will get replaced)
    const [submittedFilters, setSubmittedFilters] = useState<null | typeof filters>(null);
    const { tickers} = useTickers(submittedFilters);

    const [categorizedTickers, setCategorizedTickers] = useState<CategorizedTicker[]>([]);

    const [filteredTickers, setFilteredTickers] = useState<CategorizedTicker[]>(categorizedTickers); 

    const [sortOption, setSortOption] = useState({ field: "symbol", order: "asc" });
    
    /*============= Pagination ==============*/
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(NBR_TICKERS_PER_PAGE);
    const containerRef = useRef<HTMLDivElement | null>(null); 
    const [inputValue, setInputValue] = useState("1");
    const inputRef = useRef<HTMLInputElement>(null);


    const [selectedFilters, setSelectedFilters] = useState<tickerPicksFilters>({
      categories: [],
      tickers: [],
      sectors: [],
      industries: [],
      countries: [],
      minMarketCap: '',
      maxMarketCap: ''
    });

    /*============= Research Notes ==============*/
    const [researchNotes, setResearchNotes] = useState<Record<string, string>>({});

    const handleSaveResearchNote = async (content: string) => {
      if (!activeTicker) return;

      const success = await saveResearchNote(activeTicker.symbol, content);
      if (success) {
          alert("Research note saved!");

          setResearchNotes(prev => ({
              ...prev,
              [activeTicker.symbol]: content
          }));
      } else {
          alert("Failed to save research note.");
      }
  };

    /*============= Implementation Notes ==============*/
      const [implementationNotes, setImplementationNotes] = useState<Record<string, string>>({});

      const handleSaveImplementationNote = async (content: string) => {
        if (!activeTicker) return;
  
        const success = await saveImplementationNote(activeTicker.symbol, content);
        if (success) {
            alert("Implementation note saved!");
  
            setImplementationNotes(prev => ({
                ...prev,
                [activeTicker.symbol]: content
            }));
        } else {
            alert("Failed to save implementation note.");
        }
    };


    const applyFilters = (filters: tickerPicksFilters) => {
      setSelectedFilters(filters);
      const filteredTickers = categorizedTickers.filter(ticker =>
        (filters.tickers.length === 0 || filters.tickers.includes(`${ticker.symbol}: ${cleanTickerName(ticker.name)}`)) &&
        (filters.sectors.length === 0 || ticker.sector && filters.sectors.includes(ticker.sector)) &&
        (filters.industries.length === 0 || ticker.industry && filters.industries.includes(ticker.industry)) &&
        (filters.countries.length === 0 || ticker.country && filters.countries.includes(ticker.country)) &&
        (!filters.minMarketCap || (ticker.marketCap !== null && ticker.marketCap >= parseFloat(filters.minMarketCap) * 1_000_000)) &&
        (!filters.maxMarketCap || (ticker.marketCap !== null && ticker.marketCap <= parseFloat(filters.maxMarketCap) * 1_000_000)) &&
        (filters.categories.length === 0 || filters.categories.includes(ticker.category)) // ✅ Ensure categories persist
      );
    
      setFilteredTickers(filteredTickers);
      setCurrentPage(1); 
    };
  
    
    const SetPrevOrNextPage = (forward: boolean) => {
      if (forward){
          setInputValue(Math.min(Number(inputValue) + 1, totalPages).toString()); 
      }else {
        setInputValue(Math.max(Number(inputValue) - 1, 1).toString());

      }
    }
    
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
        sector: "",
        marketCapMin: "100000000000",
      });
    }, []); 

    //After tickers are retrieved
    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const symbols = tickers.map(ticker => ticker.symbol);
          const response = await getCurrentCategories(symbols);
          const categories = response.data; 
          
          const tickersWithCategories = tickers.map((ticker) => ({
            ...ticker,
            category: categories[ticker.symbol]?.category|| TICKER_CATEGORIES.NONE,
          }));

    
          setCategorizedTickers(tickersWithCategories);
          setFilteredTickers(tickersWithCategories);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };
    
      if (tickers.length > 0) {
        fetchCategories();
      }
    
      // Prefetch research notes for the first page tickers
      const prefetchTickers = tickers.slice(0, NBR_TICKERS_PER_PAGE).map(t => t.symbol);
      fetchResearchNotesForTickers(prefetchTickers).then(notes => {
        setResearchNotes(prev => ({ ...prev, ...notes }));
      });

      // // Prefetch implementation notes for the first page tickers
      // I do not think this is a good idea since loading will take longer ...
      // might remove prefetching of research notes also

    }, [tickers]);

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


    const handleDateChange = (date: Date) => {
      const formattedDate = date.toISOString().split("T")[0]; // Convert Date to 'YYYY-MM-DD'
      console.log(formattedDate);
      // setSelectedDate(formattedDate);
    };

    const updateCategory = (symbol: string, category: TickerCategory) => {

      const currentTickerSymbols = new Set(currentTickers.map((t) => t.symbol));

      if (selectedFilters.categories.length > 0) {
        setFilteredTickers((prev = []) =>
          prev
            .map((ticker) =>
              currentTickerSymbols?.has(ticker.symbol) && ticker.symbol === symbol
                ? { ...ticker, category }
                : ticker
            )
            .filter(ticker => selectedFilters.categories.includes(ticker.category))
        );
      } else {
        setFilteredTickers((prev = []) =>
          prev
            .map((ticker) =>
              currentTickerSymbols?.has(ticker.symbol) && ticker.symbol === symbol
                ? { ...ticker, category }
                : ticker
        ));
      }+
      
      setCategorizedTickers((prev) =>
        prev.map((ticker) =>
          currentTickerSymbols.has(ticker.symbol) && ticker.symbol === symbol
            ? { ...ticker, category }
            : ticker
        )
      );

      if (activeTicker?.symbol == symbol) {
        setActiveTicker({...activeTicker, category: category});
      }

      saveTickerCategory(symbol, category);
    };

    const handleTickerClick = async (tickerSymbol: string) => {
      const selectedTicker = currentTickers.find(
        (ticker) => ticker.symbol === tickerSymbol
      );

      setActiveTicker(selectedTicker || null);

      if (researchNotes[tickerSymbol] === undefined) {
        const researchNoteContent = await fetchResearchNoteForTicker(tickerSymbol);
        setResearchNotes(prev => ({ ...prev, [tickerSymbol]: researchNoteContent }));
      }

      if (selectedTicker?.category === TICKER_CATEGORIES.PLAYING && implementationNotes[tickerSymbol] === undefined){
        const implementationNoteContent = await fetchImplementationNoteForTicker(tickerSymbol);
        setImplementationNotes(prev => ({ ...prev, [tickerSymbol]: implementationNoteContent }));
      }

  };
    

    return (
      <div className="flex flex-col min-h-screen">
        <div className="h-12 bg-parchment border-b-4 border-b-parchment shadow-md flex space-x-4 p-4 items-center">
        <div className="ml-6 mr-12">
        <SortMenu setSortOption={setSortOption} />
        </div>
        <PicksFilter tickers={categorizedTickers}  appliedFilters={selectedFilters} onFilterApply={applyFilters}/>

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
 
          <div ref={containerRef} className="w-3/10 max-w-200 bg-gray-50"> 
          {currentTickers.map((ticker) => <TickerCard 
          key={ticker.symbol} 
          ticker={ticker} 
          active = { ticker.symbol === activeTicker?.symbol}
          updateCategory={updateCategory} 
          onClick={handleTickerClick}
          />)}

          </div>
          
          { activeTicker && 
          <div className="w-7/10 p-4"> 
          
          { activeTicker.category === TICKER_CATEGORIES.PLAYING &&
           <CollapsibleSection title="Implementation Notes"
           headerAdditionalClass = "bg-bittersweet-shimmer text-white"
           >
              <NotesEditor
                initialContent={implementationNotes[activeTicker?.symbol] || INIT_IMPLEMENTATION_NOTE_CONTENT}
                onSave={handleSaveImplementationNote}
              />
            </CollapsibleSection>

          }
          
            <CollapsibleSection title="Research Notes">
              <NotesEditor
                initialContent={activeTicker? researchNotes[activeTicker.symbol]: ''}
                onSave={handleSaveResearchNote}
              />
            </CollapsibleSection>

            <CollapsibleSection title="Strategies">
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                Coming soon...
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Additional Information">
              <div className="h-[200px] flex items-center justify-center text-gray-400">
                Coming soon...
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Links">
              <div className="h-[100px] flex items-center justify-center text-gray-400">
                Coming soon...
              </div>
            </CollapsibleSection>

          </div>
          }

        </div>

      </div>
    );
  };

export default Picks;
