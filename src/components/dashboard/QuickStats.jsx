import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, ChefHat, Star, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const statCards = [
  {
    title: "Family Members",
    icon: Users,
    key: "familyCount",
    color: "from-blue-400 to-cyan-400"
  },
  {
    title: "Total Meals",
    icon: ChefHat,
    key: "totalMeals", 
    color: "from-purple-400 to-pink-400"
  },
  {
    title: "Favorites",
    icon: Star,
    key: "favoriteCount",
    color: "from-yellow-400 to-orange-400"
  },
  {
    title: "Week Planned",
    icon: Calendar,
    key: "weekPlanned",
    color: "from-green-400 to-teal-400"
  }
];

export default function QuickStats({ stats, familyCount }) {
  const values = { ...stats, familyCount };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl overflow-hidden hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium">{stat.title}</p>
                  <p className="text-white text-2xl font-bold mt-1">
                    {values[stat.key] || 0}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center backdrop-blur-sm`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}