import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface MiniCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function MiniCalendar({ selectedDate, onDateSelect }: MiniCalendarProps) {
  const [viewDate, setViewDate] = useState(selectedDate);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - startDate.getDay());
  
  const days = [];
  const currentDate = new Date(startDate);
  
  while (days.length < 42) {
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setViewDate(newDate);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">
          {viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => navigateMonth('prev')}
            data-testid="button-mini-prev"
          >
            <ChevronLeft className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => navigateMonth('next')}
            data-testid="button-mini-next"
          >
            <ChevronRight className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className="text-xs text-muted-foreground font-medium">
            {day}
          </div>
        ))}
        {days.map((day, i) => {
          const isCurrentMonth = day.getMonth() === month;
          const isSelected = day.toDateString() === selectedDate.toDateString();
          const isToday = day.toDateString() === new Date().toDateString();
          
          return (
            <button
              key={i}
              onClick={() => onDateSelect(day)}
              className={`
                h-8 text-sm rounded-md transition-colors
                ${isCurrentMonth ? "" : "text-muted-foreground/50"}
                ${isSelected ? "bg-primary text-primary-foreground font-medium" : ""}
                ${isToday && !isSelected ? "ring-1 ring-primary" : ""}
                ${!isSelected ? "hover:bg-accent" : ""}
              `}
              data-testid={`mini-day-${i}`}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
