import { Users, UtensilsCrossed, Star, Calendar as CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsProps {
  familyCount: number;
  totalMeals: number;
  favoriteCount: number;
  weekPlanned: number;
}

export default function QuickStats({ familyCount, totalMeals, favoriteCount, weekPlanned }: StatsProps) {
  const items = [
    { label: "Family Members", value: familyCount, icon: Users },
    { label: "Total Meals", value: totalMeals, icon: UtensilsCrossed },
    { label: "Favorites", value: favoriteCount, icon: Star },
    { label: "Week Planned", value: weekPlanned, icon: CalendarIcon },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {items.map(({ label, value, icon: Icon }) => (
        <Card key={label} className="bg-card/60 backdrop-blur-xl border-border/40 rounded-3xl hover:shadow-glow transition-all animate-fade-in">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/80 to-secondary/80 text-primary-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg text-foreground/90">{label}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
