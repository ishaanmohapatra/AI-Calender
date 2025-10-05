import { useQuery } from "@tanstack/react-query";
import { Event } from "@shared/schema";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EventCard } from "./EventCard";

interface CalendarViewProps {
  viewMode: "day" | "week" | "month";
  selectedDate: Date;
}

export function CalendarView({ viewMode, selectedDate }: CalendarViewProps) {
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events", viewMode, selectedDate.toISOString()],
  });

  if (isLoading) {
    return (
      <div className="h-full p-6 bg-background">
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (viewMode === "week") {
    return <WeekView selectedDate={selectedDate} events={events || []} />;
  }

  if (viewMode === "day") {
    return <DayView selectedDate={selectedDate} events={events || []} />;
  }

  return <MonthView selectedDate={selectedDate} events={events || []} />;
}

function WeekView({ selectedDate, events }: { selectedDate: Date; events: Event[] }) {
  const startOfWeek = new Date(selectedDate);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  
  const days = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(day.getDate() + i);
    return day;
  });

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate.toDateString() === day.toDateString();
    });
  };

  return (
    <div className="h-full overflow-auto bg-background">
      <div className="min-w-[800px]">
        {/* Day Headers */}
        <div className="grid grid-cols-8 border-b border-border sticky top-0 bg-background z-10">
          <div className="p-3 text-xs text-muted-foreground border-r border-border"></div>
          {days.map((day, i) => {
            const isToday = day.toDateString() === new Date().toDateString();
            return (
              <div
                key={i}
                className={`p-3 text-center border-r border-border last:border-r-0 ${
                  isToday ? "bg-primary/5" : ""
                }`}
              >
                <div className="text-xs text-muted-foreground uppercase">
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div
                  className={`text-2xl font-semibold mt-1 ${
                    isToday ? "text-primary" : ""
                  }`}
                >
                  {day.getDate()}
                </div>
              </div>
            );
          })}
        </div>

        {/* Time Grid */}
        <div className="grid grid-cols-8">
          <div className="border-r border-border">
            {hours.map((hour) => (
              <div key={hour} className="h-16 border-b border-border px-2 py-1 text-xs text-muted-foreground text-right">
                {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
              </div>
            ))}
          </div>
          {days.map((day, dayIndex) => (
            <div key={dayIndex} className="border-r border-border last:border-r-0 relative">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="h-16 border-b border-border hover:bg-accent/30 transition-colors cursor-pointer"
                  data-testid={`cell-${dayIndex}-${hour}`}
                />
              ))}
              {/* Events overlay */}
              <div className="absolute inset-0 pointer-events-none">
                {getEventsForDay(day).map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DayView({ selectedDate, events }: { selectedDate: Date; events: Event[] }) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  const dayEvents = events.filter(event => {
    const eventDate = new Date(event.startTime);
    return eventDate.toDateString() === selectedDate.toDateString();
  });

  return (
    <div className="h-full overflow-auto bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {hours.map((hour) => (
          <div key={hour} className="flex gap-4 mb-2">
            <div className="w-20 text-sm text-muted-foreground text-right py-2">
              {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
            </div>
            <div className="flex-1">
              <Card className="min-h-[60px] p-3 hover:bg-accent/30 transition-colors cursor-pointer relative">
                {dayEvents
                  .filter(event => new Date(event.startTime).getHours() === hour)
                  .map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
              </Card>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MonthView({ selectedDate, events }: { selectedDate: Date; events: Event[] }) {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  
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

  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate.toDateString() === day.toDateString();
    });
  };

  return (
    <div className="h-full overflow-auto bg-background p-6">
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
            {day}
          </div>
        ))}
        {days.map((day, i) => {
          const isCurrentMonth = day.getMonth() === month;
          const isToday = day.toDateString() === new Date().toDateString();
          const dayEvents = getEventsForDay(day);
          
          return (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className={`min-h-[100px] p-2 rounded-lg border transition-all ${
                isCurrentMonth
                  ? "bg-card border-card-border"
                  : "bg-muted/30 border-transparent"
              } ${isToday ? "ring-2 ring-primary" : ""} hover:shadow-sm cursor-pointer`}
              data-testid={`month-cell-${i}`}
            >
              <div className={`text-sm font-medium mb-1 ${
                isToday ? "text-primary" : isCurrentMonth ? "text-foreground" : "text-muted-foreground"
              }`}>
                {day.getDate()}
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map(event => (
                  <div
                    key={event.id}
                    className={`text-xs p-1 rounded truncate bg-${event.color}/20 text-${event.color} border-l-2 border-${event.color}`}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
