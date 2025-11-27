import { useState } from "react";
import { Itinerary } from "@/types/itinerary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";

interface ItineraryFormProps {
  itinerary?: Itinerary;
  onSubmit: (data: Omit<Itinerary, 'id' | 'days'>) => void;
  onCancel: () => void;
}

export function ItineraryForm({ itinerary, onSubmit, onCancel }: ItineraryFormProps) {
  const [formData, setFormData] = useState({
    title: itinerary?.title || '',
    destination: itinerary?.destination || '',
    startDate: itinerary?.startDate || '',
    endDate: itinerary?.endDate || '',
    totalBudget: itinerary?.totalBudget?.toString() || '',
    currency: itinerary?.currency || 'USD',
    travelers: itinerary?.travelers?.toString() || '1',
    notes: itinerary?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: formData.title,
      destination: formData.destination,
      startDate: formData.startDate,
      endDate: formData.endDate,
      totalBudget: formData.totalBudget ? parseFloat(formData.totalBudget) : undefined,
      currency: formData.currency || undefined,
      travelers: formData.travelers ? parseInt(formData.travelers) : undefined,
      notes: formData.notes || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Trip Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Summer Europe Trip"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="destination">Destination *</Label>
        <Input
          id="destination"
          value={formData.destination}
          onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
          placeholder="e.g., Paris, France"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date *</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date *</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            min={formData.startDate}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="totalBudget">Total Budget</Label>
          <Input
            id="totalBudget"
            type="number"
            step="0.01"
            value={formData.totalBudget}
            onChange={(e) => setFormData({ ...formData, totalBudget: e.target.value })}
            placeholder="0.00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="travelers">Number of Travelers</Label>
          <Input
            id="travelers"
            type="number"
            min="1"
            value={formData.travelers}
            onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Trip Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          placeholder="Any additional information about your trip..."
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {itinerary ? 'Update' : 'Create'} Itinerary
        </Button>
      </DialogFooter>
    </form>
  );
}
