import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function UpcomingMeals({ upcomingMeals }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-white text-xl font-bold flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Upcoming Meals
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingMeals.length > 0 ? (
            <div className="space-y-3">
              {upcomingMeals.slice(0, 5).map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium text-sm">
                      {format(new Date(plan.date), "MMM d")}
                    </span>
                    <span className="text-white/60 text-xs uppercase">
                      {plan.meal_type}
                    </span>
                  </div>
                  {plan.is_skipped ? (
                    <p className="text-white/60 text-sm italic">Day skipped</p>
                  ) : (
                    <p className="text-white/80 text-sm">Meal planned</p>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <Calendar className="w-12 h-12 text-white/50 mx-auto mb-3" />
              <p className="text-white/70 text-sm">No upcoming meals planned</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
