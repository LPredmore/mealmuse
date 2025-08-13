import { ChefHat } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MealSuggestions() {
  return (
    <Card className="backdrop-blur-xl bg-card/50 border border-border/40 rounded-3xl overflow-hidden animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-foreground text-xl font-bold flex items-center gap-2">
          <span>AI Meal Suggestions</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-14 text-muted-foreground">
          <ChefHat className="h-12 w-12 mb-4 opacity-80" />
          <p>Click "Get AI Suggestions" to discover new meals!</p>
        </div>
      </CardContent>
    </Card>
  );
}
