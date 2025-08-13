import { Calendar as CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface UpcomingItem {
  id: string;
  date: string; // e.g., "Jun 14"
  label: string; // e.g., "DINNER"
  note: string; // e.g., "Meal planned"
}

export default function UpcomingMeals({ items }: { items: UpcomingItem[] }) {
  return (
    <Card className="backdrop-blur-xl bg-card/50 border border-border/40 rounded-3xl overflow-hidden animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-foreground text-xl font-bold flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Upcoming Meals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((it) => (
          <div key={it.id} className="flex items-center justify-between rounded-2xl bg-background/40 border border-border/30 p-4">
            <div>
              <div className="text-sm font-semibold text-foreground">{it.date}</div>
              <div className="text-xs text-muted-foreground">{it.note}</div>
            </div>
            <span className="rounded-xl px-3 py-1 text-xs font-medium bg-secondary/70 text-secondary-foreground border border-border/40">
              {it.label}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
