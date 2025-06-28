
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
      case 'easy': return 'bg-green-100 text-green-700 border-green-300';
      case 'moderate': return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'difficult': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 bg-white/60 border-green-100">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h4 className="font-semibold text-gray-800 flex-1">{recipe.name}</h4>
            {recipe.isFavorite && <span className="text-amber-500">⭐</span>}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{recipe.prepTime + recipe.cookTime} min total</span>
            <span className="text-gray-400">•</span>
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
                className="text-xs border-green-300 text-green-700"
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
