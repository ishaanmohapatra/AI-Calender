import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Moon, Sun, LogOut, Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { CalendarView } from "@/components/CalendarView";
import { MiniCalendar } from "@/components/MiniCalendar";
import { AICopilot } from "@/components/AICopilot";
import { ScenarioTemplates } from "@/components/ScenarioTemplates";
import { motion, AnimatePresence } from "framer-motion";

type ViewMode = "day" | "week" | "month";

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [copilotOpen, setCopilotOpen] = useState(true);
  const [templatesOpen, setTemplatesOpen] = useState(false);

  const formatDateRange = () => {
    if (viewMode === "week") {
      const start = new Date(selectedDate);
      start.setDate(start.getDate() - start.getDay());
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else if (viewMode === "month") {
      return selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    return selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (viewMode === "day") {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setSelectedDate(newDate);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Left Sidebar */}
      <motion.aside
        initial={{ width: 280 }}
        animate={{ width: 280 }}
        className="border-r border-border bg-sidebar flex-shrink-0 flex flex-col"
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">AI Calendar</span>
          </div>

          {/* View Mode Buttons */}
          <div className="space-y-1">
            <Button
              variant={viewMode === "day" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setViewMode("day")}
              data-testid="button-view-day"
            >
              Day
            </Button>
            <Button
              variant={viewMode === "week" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setViewMode("week")}
              data-testid="button-view-week"
            >
              Week
            </Button>
            <Button
              variant={viewMode === "month" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setViewMode("month")}
              data-testid="button-view-month"
            >
              Month
            </Button>
          </div>
        </div>

        {/* Mini Calendar */}
        <div className="p-4 border-b border-sidebar-border">
          <MiniCalendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </div>

        {/* Templates Section */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium text-sidebar-foreground">Quick Templates</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTemplatesOpen(!templatesOpen)}
              data-testid="button-toggle-templates"
            >
              {templatesOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
          {templatesOpen && <ScenarioTemplates />}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-sidebar-border flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            data-testid="button-theme-toggle"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          <a href="/api/logout" className="flex-1">
            <Button variant="ghost" className="w-full gap-2" data-testid="button-logout">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </a>
        </div>
      </motion.aside>

      {/* Main Calendar Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-10">
          <div className="px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigateDate('prev')}
                  data-testid="button-prev-period"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigateDate('next')}
                  data-testid="button-next-period"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
              <h2 className="text-2xl font-semibold" data-testid="text-date-range">
                {formatDateRange()}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setSelectedDate(new Date())}
                data-testid="button-today"
              >
                Today
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCopilotOpen(!copilotOpen)}
                data-testid="button-toggle-copilot"
              >
                {copilotOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </header>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-hidden">
          <CalendarView
            viewMode={viewMode}
            selectedDate={selectedDate}
          />
        </div>
      </div>

      {/* AI Copilot Sidebar */}
      <AnimatePresence>
        {copilotOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 360, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-l border-border bg-card flex-shrink-0 overflow-hidden"
          >
            <AICopilot />
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
