import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, addDays, subDays, isWeekend } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../components/ui/Button";

interface Props {
  onDateChange: (date: Date) => void;
}

const PicksDateSelector = ({ onDateChange }:Props) => {
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    let today = new Date();
    while (isWeekend(today)) {
      today = subDays(today, 1);
    }
    return today;
  });

  const updateDate = (date: Date) => {
    setSelectedDate(date);
    onDateChange(date); 
  };

  const getNextWeekday = (date: Date) => {
    let nextDate = addDays(date, 1);
    while (isWeekend(nextDate)) {
      nextDate = addDays(nextDate, 1);
    }
    return nextDate;
  };

  const getPreviousWeekday = (date: Date) => {
    let prevDate = subDays(date, 1);
    while (isWeekend(prevDate)) {
      prevDate = subDays(prevDate, 1);
    }
    return prevDate;
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => updateDate(getPreviousWeekday(selectedDate))}
      >
        <ChevronLeft size={20} />
      </Button>

      <DatePicker
  selected={selectedDate}
  onChange={(date) => date && updateDate(date)}
  filterDate={(date) => !isWeekend(date)}
  dateFormat="EEE, MMM dd, yyyy"
  customInput={
    <button
      className="px-4 py-2 border rounded-lg bg-white shadow-sm focus:outline-none"
      tabIndex={-1}
      onMouseDown={(e) => e.preventDefault()}
      onBlur={(e) => e.target.blur()} 
    >
      {format(selectedDate, "EEE, MMM dd, yyyy")}
    </button>
  }
/>

      <Button
        variant="outline"
        size="icon"
        onClick={() => updateDate(getNextWeekday(selectedDate))}
      >
        <ChevronRight size={20} />
      </Button>
    </div>
  );
};

export default PicksDateSelector;
