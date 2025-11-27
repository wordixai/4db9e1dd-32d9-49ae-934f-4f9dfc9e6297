import { Day } from "@/types/itinerary";
import { ActivityCard } from "./ActivityCard";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Plus } from "lucide-react";

interface DaySectionProps {
  day: Day;
  dayNumber: number;
  onAddActivity: () => void;
  onEditActivity: (activityId: string) => void;
  onDeleteActivity: (activityId: string) => void;
}

export function DaySection({
  day,
  dayNumber,
  onAddActivity,
  onEditActivity,
  onDeleteActivity
}: DaySectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-3">
            <h2 className="text-2xl font-bold text-foreground">Day {dayNumber}</h2>
            {day.title && (
              <span className="text-lg text-muted-foreground">{day.title}</span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{formatDate(day.date)}</p>
        </div>
        <Button onClick={onAddActivity} size="sm">
          <Plus className="h-4 w-4" />
          Add Activity
        </Button>
      </div>

      <div className="space-y-3">
        {day.activities.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-lg border-2 border-dashed border-border">
            <p className="text-muted-foreground">No activities planned for this day</p>
            <Button onClick={onAddActivity} variant="outline" size="sm" className="mt-4">
              <Plus className="h-4 w-4" />
              Add First Activity
            </Button>
          </div>
        ) : (
          day.activities
            .sort((a, b) => a.startTime.localeCompare(b.startTime))
            .map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onEdit={() => onEditActivity(activity.id)}
                onDelete={() => onDeleteActivity(activity.id)}
              />
            ))
        )}
      </div>
    </div>
  );
}
