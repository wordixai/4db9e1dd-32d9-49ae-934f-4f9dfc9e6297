import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Itinerary, Day, Activity } from "@/types/itinerary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DaySection } from "@/components/DaySection";
import { ActivityForm } from "@/components/ActivityForm";
import { ItineraryForm } from "@/components/ItineraryForm";
import { formatDate, formatCurrency } from "@/lib/utils";
import { PlusCircle, Calendar, MapPin, Users, DollarSign, Edit } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [showItineraryDialog, setShowItineraryDialog] = useState(false);
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const handleCreateItinerary = (data: Omit<Itinerary, 'id' | 'days'>) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const days: Day[] = [];

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      days.push({
        id: uuidv4(),
        date: date.toISOString().split('T')[0],
        activities: [],
      });
    }

    const newItinerary: Itinerary = {
      id: uuidv4(),
      ...data,
      days,
    };

    setItinerary(newItinerary);
    setShowItineraryDialog(false);
    toast.success("Itinerary created successfully!");
  };

  const handleUpdateItinerary = (data: Omit<Itinerary, 'id' | 'days'>) => {
    if (!itinerary) return;

    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const newDays: Day[] = [];

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0];
      const existingDay = itinerary.days.find(d => d.date === dateStr);

      if (existingDay) {
        newDays.push(existingDay);
      } else {
        newDays.push({
          id: uuidv4(),
          date: dateStr,
          activities: [],
        });
      }
    }

    setItinerary({
      ...itinerary,
      ...data,
      days: newDays,
    });
    setShowItineraryDialog(false);
    toast.success("Itinerary updated successfully!");
  };

  const handleAddActivity = (dayId: string) => {
    setSelectedDayId(dayId);
    setEditingActivity(null);
    setShowActivityDialog(true);
  };

  const handleEditActivity = (dayId: string, activityId: string) => {
    if (!itinerary) return;
    const day = itinerary.days.find(d => d.id === dayId);
    const activity = day?.activities.find(a => a.id === activityId);
    if (activity) {
      setSelectedDayId(dayId);
      setEditingActivity(activity);
      setShowActivityDialog(true);
    }
  };

  const handleSaveActivity = (activityData: Omit<Activity, 'id'>) => {
    if (!itinerary || !selectedDayId) return;

    const updatedDays = itinerary.days.map(day => {
      if (day.id === selectedDayId) {
        if (editingActivity) {
          return {
            ...day,
            activities: day.activities.map(a =>
              a.id === editingActivity.id
                ? { ...activityData, id: a.id }
                : a
            ),
          };
        } else {
          return {
            ...day,
            activities: [...day.activities, { ...activityData, id: uuidv4() }],
          };
        }
      }
      return day;
    });

    setItinerary({ ...itinerary, days: updatedDays });
    setShowActivityDialog(false);
    setSelectedDayId(null);
    setEditingActivity(null);
    toast.success(editingActivity ? "Activity updated!" : "Activity added!");
  };

  const handleDeleteActivity = (dayId: string, activityId: string) => {
    if (!itinerary) return;

    const updatedDays = itinerary.days.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          activities: day.activities.filter(a => a.id !== activityId),
        };
      }
      return day;
    });

    setItinerary({ ...itinerary, days: updatedDays });
    toast.success("Activity deleted");
  };

  const calculateTotalSpent = () => {
    if (!itinerary) return 0;
    return itinerary.days.reduce((total, day) => {
      return total + day.activities.reduce((dayTotal, activity) => {
        return dayTotal + (activity.cost || 0);
      }, 0);
    }, 0);
  };

  if (!itinerary) {
    return (
      <div className="min-h-screen bg-background">
        <div
          className="h-96 bg-cover bg-center relative"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 to-background"></div>
          <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
            <h1 className="text-5xl font-bold mb-4 text-foreground">Travel Itinerary Builder</h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Create detailed travel plans with attractions, reservations, and transportation details
            </p>
            <Button size="lg" onClick={() => setShowItineraryDialog(true)}>
              <PlusCircle className="h-5 w-5" />
              Create Your First Itinerary
            </Button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Plan Days
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Organize your trip day by day with detailed schedules
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Add Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Track attractions, reservations, and transportation
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Manage Budget
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Keep track of costs and stay within budget
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        <Dialog open={showItineraryDialog} onOpenChange={setShowItineraryDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Itinerary</DialogTitle>
            </DialogHeader>
            <ItineraryForm
              onSubmit={handleCreateItinerary}
              onCancel={() => setShowItineraryDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  const totalSpent = calculateTotalSpent();

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-foreground">{itinerary.title}</h1>
                <Button variant="ghost" size="icon" onClick={() => setShowItineraryDialog(true)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{itinerary.destination}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {formatDate(itinerary.startDate)} - {formatDate(itinerary.endDate)}
                  </span>
                </div>
                {itinerary.travelers && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{itinerary.travelers} {itinerary.travelers === 1 ? 'traveler' : 'travelers'}</span>
                  </div>
                )}
                {itinerary.totalBudget && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span>
                      Budget: {formatCurrency(totalSpent, itinerary.currency)} / {formatCurrency(itinerary.totalBudget, itinerary.currency)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {itinerary.days.map((day, index) => (
            <DaySection
              key={day.id}
              day={day}
              dayNumber={index + 1}
              onAddActivity={() => handleAddActivity(day.id)}
              onEditActivity={(activityId) => handleEditActivity(day.id, activityId)}
              onDeleteActivity={(activityId) => handleDeleteActivity(day.id, activityId)}
            />
          ))}
        </div>
      </div>

      <Dialog open={showItineraryDialog} onOpenChange={setShowItineraryDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Itinerary</DialogTitle>
          </DialogHeader>
          <ItineraryForm
            itinerary={itinerary}
            onSubmit={handleUpdateItinerary}
            onCancel={() => setShowItineraryDialog(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showActivityDialog} onOpenChange={setShowActivityDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingActivity ? 'Edit' : 'Add'} Activity</DialogTitle>
          </DialogHeader>
          <ActivityForm
            activity={editingActivity || undefined}
            onSubmit={handleSaveActivity}
            onCancel={() => {
              setShowActivityDialog(false);
              setEditingActivity(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
