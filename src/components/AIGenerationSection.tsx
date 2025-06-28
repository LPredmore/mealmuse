
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus } from "lucide-react";

const mockAISuggestions = [
  {
    id: "1",
    name: "Mediterranean Herb-Crusted Salmon",
    cuisine: "Mediterranean",
    complexity: "Moderate",
    timing: "35 min",
    reason: "Perfect for Sarah's gluten-free needs and Mike's taste for familiar flavors"
  },
  {
    id: "2", 
    name: "Classic Chicken & Rice Casserole",
    cuisine: "American",
    complexity: "Easy",
    timing: "45 min",
    reason: "Comfort food that appeals to Mike, easily customizable for dietary needs"
  },
  {
    id: "3",
    name: "Vegetarian Stuffed Bell Peppers",
    cuisine: "Mediterranean",
    complexity: "Easy", 
    timing: "40 min",
    reason: "Colorful, nutritious option that accommodates various dietary preferences"
  }
];

export const AIGenerationSection = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState(mockAISuggestions);

  const handleGenerateNew = async () => {
    setIsGenerating(true);
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
    // In real implementation, this would call the AI service
  };

  const handleSaveRecipe = (suggestionId: string) => {
    console.log("Saving recipe:", suggestionId);
    // In real implementation, this would save to the database
  };

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              🤖 AI Meal Suggestions
            </CardTitle>
            <CardDescription>
              Personalized recommendations based on your family's preferences
            </CardDescription>
          </div>
          <Button 
            onClick={handleGenerateNew}
            disabled={isGenerating}
            className="bg-purple-500 hover:bg-purple-600"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            Generate New
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.map((suggestion) => (
          <Card key={suggestion.id} className="bg-white/80 border-purple-100">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <h4 className="font-semibold text-gray-800">{suggestion.name}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-purple-300 text-purple-700">
                      {suggestion.cuisine}
                    </Badge>
                    <Badge variant="outline" className="text-xs border-gray-300 text-gray-700">
                      {suggestion.complexity}
                    </Badge>
                    <span className="text-sm text-gray-600">{suggestion.timing}</span>
                  </div>
                  <p className="text-sm text-gray-600 italic">{suggestion.reason}</p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleSaveRecipe(suggestion.id)}
                  className="border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  Save Recipe
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};
