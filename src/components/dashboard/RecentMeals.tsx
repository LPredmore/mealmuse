import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Star, ChefHat } from "lucide-react";
import { motion } from "framer-motion";

const complexityColors = {
  easy: "bg-green-500/20 text-green-300 border-green-500/30",
  moderate: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  difficult: "bg-red-500/20 text-red-300 border-red-500/30"
};

export default function RecentMeals({ meals }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-white text-xl font-bold">Recent Meals</CardTitle>
        </CardHeader>
        <CardContent>
          {meals.length > 0 ? (
            <div className="space-y-4">
              {meals.map((meal, index) => (
                <motion.div
                  key={meal.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-white font-medium flex items-center gap-2">
                        {meal.name}
                        {meal.is_favorite && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                      </h4>
                      <p className="text-white/60 text-sm">{meal.cuisine_type}</p>
                    </div>
                    <Badge className={`${complexityColors[meal.complexity_level]} border backdrop-blur-sm text-xs`}>
                      {meal.complexity_level}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-white/60 text-sm">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {(meal.prep_time || 0) + (meal.cook_time || 0)} min
                    </span>
                    <span>{meal.servings || 4} servings</span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ChefHat className="w-12 h-12 text-white/50 mx-auto mb-3" />
              <p className="text-white/70">No meals added yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
