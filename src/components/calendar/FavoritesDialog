import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Star, Search, Clock, ChefHat } from "lucide-react";
import { motion } from "framer-motion";

const complexityColors = {
  easy: "bg-green-500/20 text-green-300 border-green-500/30",
  moderate: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  difficult: "bg-red-500/20 text-red-300 border-red-500/30"
};

export default function FavoritesDialog({ open, onClose, meals, onSelect }) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredMeals = meals.filter(meal =>
    meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meal.cuisine_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="backdrop-blur-xl bg-black/40 border border-white/20 rounded-3xl max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-white text-2xl font-bold flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-400 fill-current" />
            Choose from Favorites
          </DialogTitle>
        </DialogHeader>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search favorite meals..."
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl backdrop-blur-sm pl-10"
          />
        </div>

        {/* Meal List */}
        <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2">
          {filteredMeals.length > 0 ? (
            filteredMeals.map((meal, index) => (
              <motion.div
                key={meal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelect(meal)}
                className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 cursor-pointer hover:bg-white/20 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-white font-semibold text-lg">{meal.name}</h4>
                    <p className="text-white/70 text-sm">{meal.cuisine_type}</p>
                  </div>
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Badge className={`${complexityColors[meal.complexity_level]} border backdrop-blur-sm text-xs`}>
                    {meal.complexity_level}
                  </Badge>
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 border backdrop-blur-sm text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {(meal.prep_time || 0) + (meal.cook_time || 0)} min
                  </Badge>
                  {meal.can_prepare_ahead && (
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 border backdrop-blur-sm text-xs">
                      Prep Ahead
                    </Badge>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <ChefHat className="w-16 h-16 text-white/50 mx-auto mb-4" />
              <p className="text-white/70">
                {searchTerm ? "No meals match your search" : "No favorite meals yet"}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end pt-4 border-t border-white/10">
          <Button
            onClick={onClose}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
