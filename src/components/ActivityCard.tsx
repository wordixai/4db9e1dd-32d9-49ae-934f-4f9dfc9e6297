import { Activity } from "@/types/itinerary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatTime, formatCurrency } from "@/lib/utils";
import {
  MapPin,
  Clock,
  DollarSign,
  Phone,
  ExternalLink,
  Edit,
  Trash2,
  Train,
  Hotel,
  UtensilsCrossed,
  Landmark
} from "lucide-react";

interface ActivityCardProps {
  activity: Activity;
  onEdit?: () => void;
  onDelete?: () => void;
}

const activityIcons = {
  attraction: Landmark,
  reservation: UtensilsCrossed,
  transportation: Train,
  accommodation: Hotel,
  other: MapPin,
};

const activityColors = {
  attraction: "default",
  reservation: "secondary",
  transportation: "warning",
  accommodation: "success",
  other: "outline",
} as const;

export function ActivityCard({ activity, onEdit, onDelete }: ActivityCardProps) {
  const Icon = activityIcons[activity.type];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2 rounded-lg bg-muted">
              <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-lg">{activity.title}</CardTitle>
                <Badge variant={activityColors[activity.type]}>
                  {activity.type}
                </Badge>
              </div>
              {activity.description && (
                <p className="text-sm text-muted-foreground">{activity.description}</p>
              )}
            </div>
          </div>
          <div className="flex gap-1">
            {onEdit && (
              <Button variant="ghost" size="icon" onClick={onEdit}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button variant="ghost" size="icon" onClick={onDelete}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{formatTime(activity.startTime)}</span>
          {activity.endTime && (
            <span className="text-muted-foreground">- {formatTime(activity.endTime)}</span>
          )}
        </div>

        {activity.location && (
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <div>{activity.location}</div>
              {activity.address && (
                <div className="text-muted-foreground text-xs">{activity.address}</div>
              )}
            </div>
          </div>
        )}

        {activity.cost && (
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>{formatCurrency(activity.cost, activity.currency)}</span>
          </div>
        )}

        {activity.confirmationNumber && (
          <div className="text-sm">
            <span className="text-muted-foreground">Confirmation: </span>
            <span className="font-mono font-medium">{activity.confirmationNumber}</span>
          </div>
        )}

        {activity.phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <a href={`tel:${activity.phone}`} className="text-primary hover:underline">
              {activity.phone}
            </a>
          </div>
        )}

        {activity.url && (
          <div className="flex items-center gap-2 text-sm">
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
            <a
              href={activity.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              View details
            </a>
          </div>
        )}

        {activity.notes && (
          <div className="text-sm text-muted-foreground pt-2 border-t border-border">
            {activity.notes}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
