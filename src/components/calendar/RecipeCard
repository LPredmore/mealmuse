import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, ChefHat, Printer, Star } from "lucide-react";

const complexityColors = {
  easy: "bg-green-500/20 text-green-300 border-green-500/30",
  moderate: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  difficult: "bg-red-500/20 text-red-300 border-red-500/30"
};

export default function RecipeCard({ meal, open, onClose }) {
  if (!meal) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="backdrop-blur-xl bg-black/40 border border-white/20 rounded-3xl max-w-4xl max-h-[90vh] overflow-y-auto print:bg-white print:text-black print:max-w-none print:shadow-none">
        <DialogHeader className="pb-6 print:pb-4">
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-white text-3xl font-bold mb-2 print:text-black flex items-center gap-3">
                {meal.name}
                {meal.is_favorite && <Star className="w-6 h-6 text-yellow-400 fill-current" />}
              </DialogTitle>
              <p className="text-white/80 text-lg print:text-gray-600">{meal.cuisine_type}</p>
            </div>
            <Button
              onClick={handlePrint}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl print:hidden"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Recipe
            </Button>
          </div>
        </DialogHeader>
        
        {/* Recipe Details */}
        <div className="space-y-8 print:space-y-6">
          {/* Quick Info */}
          <div className="flex flex-wrap gap-3">
            <Badge className={`${complexityColors[meal.complexity_level]} border backdrop-blur-sm print:bg-gray-100 print:text-gray-800 print:border-gray-300`}>
              <ChefHat className="w-3 h-3 mr-1" />
              {meal.complexity_level?.charAt(0).toUpperCase() + meal.complexity_level?.slice(1)}
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 border backdrop-blur-sm print:bg-gray-100 print:text-gray-800 print:border-gray-300">
              <Clock className="w-3 h-3 mr-1" />
              Prep: {meal.prep_time || 0}min | Cook: {meal.cook_time || 0}min
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 border backdrop-blur-sm print:bg-gray-100 print:text-gray-800 print:border-gray-300">
              <Users className="w-3 h-3 mr-1" />
              Serves {meal.servings || 4}
            </Badge>
            {meal.can_prepare_ahead && (
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 border backdrop-blur-sm print:bg-gray-100 print:text-gray-800 print:border-gray-300">
                Can Prepare Ahead
              </Badge>
            )}
          </div>

          {/* Ingredients */}
          <div>
            <h3 className="text-white text-xl font-bold mb-4 print:text-black">Ingredients</h3>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 print:bg-gray-50 print:border-gray-200">
              <div className="grid md:grid-cols-2 gap-3">
                {meal.ingredients?.map((ingredient, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-white/10 last:border-b-0 print:border-gray-200">
                    <span className="text-white font-medium print:text-black">{ingredient.name}</span>
                    <span className="text-white/70 print:text-gray-600">
                      {ingredient.amount} {ingredient.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="text-white text-xl font-bold mb-4 print:text-black">Cooking Instructions</h3>
            <div className="space-y-4">
              {meal.instructions?.map((instruction, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 print:bg-gray-50 print:border-gray-200">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold print:bg-gray-800 print:text-white">
                      {index + 1}
                    </div>
                    <p className="text-white leading-relaxed print:text-black">{instruction}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Equipment Needed */}
          {meal.equipment_needed && meal.equipment_needed.length > 0 && (
            <div>
 
