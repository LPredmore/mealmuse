
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface Recipe {
  id: string;
  name: string;
  cuisine: string;
  complexity: string;
  prepTime: number;
  cookTime: number;
  isFavorite: boolean;
  tags: string[];
}

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const getComplexityColor = (complexity: string) => {
    switch (complexity.toLowerCase()) {
      case 'easy': return 'bg-accent/20 text-accent-foreground border-accent';
      case 'moderate': return 'bg-secondary/30 text-foreground border-secondary';
      case 'difficult': return 'bg-destructive/20 text-destructive-foreground border-destructive';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <Card className="hover:shadow-glow transition-shadow duration-200 bg-card/60 backdrop-blur-md border-border/40 rounded-2xl">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h4 className="font-semibold text-foreground flex-1">{recipe.name}</h4>
            {recipe.isFavorite && <span className="text-accent">⭐</span>}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{recipe.prepTime + recipe.cookTime} min total</span>
            <span className="text-muted-foreground/40">•</span>
            <span>{recipe.cuisine}</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant="outline" 
              className={`text-xs ${getComplexityColor(recipe.complexity)}`}
            >
              {recipe.complexity}
            </Badge>
            {recipe.tags.map((tag, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="text-xs border-accent text-accent-foreground/90"
            >
              {tag}
            </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
