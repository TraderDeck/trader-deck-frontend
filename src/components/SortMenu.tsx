import { useState, useEffect, useRef } from "react";
import { Eye } from "lucide-react";


type SortOption = {
  field: "symbol" | "name" | "marketCap";
  order: "asc" | "desc";
};

type Props = {
  setSortOption: (option: SortOption) => void;
};

export default function SortMenu({ setSortOption }: Props) {

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);


  const [sortField, setSortField] = useState<SortOption["field"]>("symbol");
  const [sortOrder, setSortOrder] = useState<SortOption["order"]>("asc");

  const applySort = () => {
    setSortOption({ field: sortField, order: sortOrder });
    setIsOpen(false); 
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        event.target instanceof Node && 
        !menuRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [])

  return (
    
    <div className="relative" ref={menuRef}>
      <Eye onClick={() => setIsOpen(!isOpen)} className="w-6 h-6 text-bittersweet-shimmer ml-8 mr-6" />

    { isOpen && 
    <div className="absolute left-0 top-full mt-2 w-80 bg-white p-4 border rounded shadow-lg z-50">    
    <h2 className="text-lg font-semibold mb-4">Sort By</h2>

      <div className="mb-4">
        <label className="block mb-2">Sort Field</label>
        <select 
          className="w-full p-2 border rounded" 
          value={sortField} 
          onChange={(e) => setSortField(e.target.value as SortOption["field"])}
        >
          <option value="symbol">Ticker Symbol</option>
          <option value="name">Name</option>
          <option value="marketCap">Market Cap</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2">Sort Order</label>
        <select 
          className="w-full p-2 border rounded" 
          value={sortOrder} 
          onChange={(e) => setSortOrder(e.target.value as SortOption["order"])}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <button onClick={applySort} className="w-full p-2 bg-blue-500 text-white rounded-lg">
        Apply Sort
      </button>

    </div>
    }
    </div>
  );
}
