import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface RecentMealItem {
  id: string;
  name: string;
  cuisine: string;
  difficulty: "easy" | "moderate" | "difficult";
  time: string;
  servings: number;
}

export default function RecentMeals({ meals }: { meals: RecentMealItem[] }) {
  return (
    <Card className="backdrop-blur-xl bg-card/50 border border-border/40 rounded-3xl overflow-hidden animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-foreground text-xl font-bold">Recent Meals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {meals.map((meal) => (
          <div
            key={meal.id}
            className="flex items-center justify-between rounded-2xl bg-background/40 border border-border/30 p-4 hover-scale"
          >
            <div>
              <div className="font-semibold text-foreground">{meal.name}</div>
              <div className="text-sm text-muted-foreground">{meal.cuisine}</div>
              <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {meal.time}</span>
                <span>{meal.servings} servings</span>
              </div>
            </div>
            <span className="rounded-full px-3 py-1 text-xs font-medium bg-secondary/70 text-secondary-foreground border border-border/40 capitalize">
              {meal.difficulty}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
