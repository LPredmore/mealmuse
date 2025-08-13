import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Clock } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

const complexityColors = {
  easy: "bg-green-500/20 text-green-300 border-green-500/30",
  moderate: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  difficult: "bg-red-500/20 text-red-300 border-red-500/30"
};

export default function MealSelector({ 
  plannedMeals, 
  selectedMeals, 
  onMealToggle, 
  isLoading 
}) {
  const isMealSelected = (meal) => {
    return selectedMeals.some(m => m.id === meal.id && m.planId === meal.planId);
  };

  if (isLoading) {
    return (
      <Card className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl">
        <CardContent className="p-12 text-center">
          <ChefHat className="w-16 h-16 text-white/50 mx-auto mb-4 animate-pulse" />
          <h3 className="text-white text-xl font-semibold mb-2">Loading Meals...</h3>
        </CardContent>
      </Card>
    );
  }

  if (plannedMeals.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl">
          <CardContent className="p-12 text-center">
            <ChefHat className="w-16 h-16 text-white/50 mx-auto mb-4" />
            <h3 className="text-white text-xl font-semibold mb-2">No Meals Planned</h3>
            <p className="text-white/70">Plan meals in the calendar to generate a shopping list.</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-white text-xl font-bold flex items-center gap-2">
            <ChefHat className="w-5 h-5" />
            Select Meals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 max-h-[70vh] overflow-y-auto">
          <AnimatePresence>
            {plannedMeals.map((meal, index) => {
                const selected = isMealSelected(meal);
                
                return (
                  <motion.div
                    key={`${meal.id}-${meal.planId}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                      selected 
                        ? 'bg-cyan-500/20 border-cyan-400/50 backdrop-blur-sm' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                    onClick={() => onMealToggle(meal)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selected}
                          className="border-white/30"
                        />
                        <div>
                          <div className="text-white font-medium">
                            {meal.name}
                          </div>
                          <div className="text-white/60 text-sm">
                            {format(meal.plannedDate, "MMM d")} • {meal.cuisine_type}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 flex-wrap">
                      {meal.complexity_level && (
                        <Badge className={`${complexityColors[meal.complexity_level]} border text-xs`}>
                          {meal.complexity_level}
                        </Badge>
                      )}
                      {meal.prep_time && (
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 border text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {meal.prep_time}min
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                );
            })}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}