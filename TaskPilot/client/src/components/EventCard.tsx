import { Event } from "@shared/schema";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const startTime = new Date(event.startTime);
  const endTime = new Date(event.endTime);
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; border: string; text: string }> = {
      'chart-1': { bg: 'bg-chart-1/30', border: 'border-chart-1', text: 'text-chart-1' },
      'chart-2': { bg: 'bg-chart-2/30', border: 'border-chart-2', text: 'text-chart-2' },
      'chart-3': { bg: 'bg-chart-3/30', border: 'border-chart-3', text: 'text-chart-3' },
      'chart-4': { bg: 'bg-chart-4/30', border: 'border-chart-4', text: 'text-chart-4' },
      'chart-5': { bg: 'bg-chart-5/30', border: 'border-chart-5', text: 'text-chart-5' },
    };
    return colorMap[color] || colorMap['chart-1'];
  };

  const colors = getColorClasses(event.color);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      className={`${colors.bg} ${colors.border} border-l-3 rounded-lg p-2 mb-2 pointer-events-auto cursor-pointer transition-shadow hover:shadow-md`}
      data-testid={`event-card-${event.id}`}
    >
      <div className={`font-medium text-sm mb-1 ${colors.text}`}>
        {event.title}
      </div>
      {event.description && (
        <div className="text-xs text-muted-foreground mb-1 line-clamp-2">
          {event.description}
        </div>
      )}
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Clock className="w-3 h-3" />
        <span>{formatTime(startTime)} - {formatTime(endTime)}</span>
      </div>
    </motion.div>
  );
}
