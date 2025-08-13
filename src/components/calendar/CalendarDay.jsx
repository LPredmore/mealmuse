import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Sparkles, Clock, ChefHat, Calendar, GripVertical } from "lucide-react";
import { format, isToday, isTomorrow } from "date-fns";
import { motion } from "framer-motion";
import { Droppable, Draggable } from "@hello-pangea/dnd";

const complexityColors = {
  easy: "bg-green-500/20 text-green-300 border-green-500/30",
  moderate: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  difficult: "bg-red-500/20 text-red-300 border-red-500/30"
};

export default function CalendarDay({ 
  date, 
  meal, 
  index, 
  isLoading, 
  onAddFavorite, 
  onGenerateNew, 
  onViewRecipe 
}) {
  const dateStr = format(date, 'yyyy-MM-dd');
  
  const getDateLabel = () => {
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "EEEE");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-bold text-lg">{getDateLabel()}</h3>
              <p className="text-white/70 text-sm">{format(date, "MMM d, yyyy")}</p>
            </div>
            <Calendar className="w-5 h-5 text-white/50" />
          </div>

          <Droppable droppableId={dateStr}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`min-h-[120px] rounded-2xl border-2 border-dashed transition-all duration-300 ${
                  snapshot.isDraggingOver 
                    ? 'border-purple-400 bg-purple-500/10' 
                    : 'border-white/20'
                }`}
              >
                {meal ? (
                  <Draggable draggableId={`meal-${meal.id}-${dateStr}`} index={0}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 cursor-pointer hover:bg-white/20 transition-all duration-300 ${
                          snapshot.isDragging ? 'rotate-2 scale-105 shadow-2xl' : ''
                        }`}
                        onClick={() => onViewRecipe(meal)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="text-white font-semibold text-lg mb-1 flex items-center gap-2">
                              {meal.name}
                              {meal.is_favorite && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                            </h4>
                            <p className="text-white/70 text-sm">{meal.cuisine_type}</p>
                          </div>
                          <div {...provided.dragHandleProps} className="text-white/50 hover:text-white/80 cursor-grab active:cursor-grabbing">
                            <GripVertical className="w-5 h-5" />
                          </div>
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
                      </div>
                    )}
                  </Draggable>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-8 space-y-3">
                    <ChefHat className="w-8 h-8 text-white/40" />
                    <p className="text-white/60 text-sm">No meal planned</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={onAddFavorite}
                        className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm rounded-xl text-xs px-3 py-1"
                      >
                        <Star className="w-3 h-3 mr-1" />
                        Favorites
                      </Button>
                      <Button
                        size="sm"
                        onClick={onGenerateNew}
                        className="bg-gradient-to-r from-purple-500/50 to-pink-500/50 hover:from-purple-500/70 hover:to-pink-500/70 text-white border-0 backdrop-blur-sm rounded-xl text-xs px-3 py-1"
                      >
                        <Sparkles className="w-3 h-3 mr-1" />
                        Generate
                      </Button>
                    </div>
                  </div>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </CardContent>
      </Card>
    </motion.div>
  );
}