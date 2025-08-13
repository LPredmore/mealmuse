import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, ChefHat, Sparkles, Plus, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/lib/utils";

const complexityColors = {
  easy: "bg-green-500/20 text-green-300 border-green-500/30",
  moderate: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30", 
  difficult: "bg-red-500/20 text-red-300 border-red-500/30"
};

export default function MealSuggestions({ suggestions, isGenerating, onSaveMeal, familyCount }) {
  if (familyCount === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl">
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 text-white/50 mx-auto mb-4" />
            <h3 className="text-white text-xl font-semibold mb-2">Add Family Members First</h3>
            <p className="text-white/70 mb-6">Add your family members to get personalized meal suggestions</p>
            <Link to={createPageUrl("Family")}>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 backdrop-blur-sm px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105">
                <Plus className="w-5 h-5 mr-2" />
                Add Family Members
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-white text-2xl font-bold flex items-center gap-3">
            <Sparkles className="w-6 h-6" />
            AI Meal Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center py-12"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <ChefHat className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-white/80 font-medium">Creating personalized meals...</p>
                </div>
              </motion.div>
            ) : suggestions.length > 0 ? (
              <motion.div
                key="suggestions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {suggestions.map((meal, index) => (
                  <motion.div
                    key={meal.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-white font-semibold text-lg">{meal.name}</h4>
                        <p className="text-white/70 text-sm">{meal.cuisine_type}</p>
                      </div>
                      <Button
                        onClick={() => onSaveMeal(meal)}
                        size="sm"
                        className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm rounded-xl transition-all duration-300 hover:scale-105"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                    </div>
                    
                    <p className="text-white/80 text-sm mb-4">{meal.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className={`${complexityColors[meal.complexity_level]} border backdrop-blur-sm`}>
                        {meal.complexity_level}
                      </Badge>
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 border backdrop-blur-sm">
                        <Clock className="w-3 h-3 mr-1" />
                        {meal.prep_time + meal.cook_time} min
                      </Badge>
                      {meal.can_prepare_ahead && (
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 border backdrop-blur-sm">
                          Prep Ahead
                        </Badge>
                      )}
                    </div>
                    
                    <div className="text-white/60 text-sm">
                      <strong>Key ingredients:</strong> {meal.main_ingredients?.join(", ")}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <ChefHat className="w-16 h-16 text-white/50 mx-auto mb-4" />
                <p className="text-white/70">Click "Get AI Suggestions" to discover new meals!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
