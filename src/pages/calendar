import React, { useState, useEffect } from "react";
import { FamilyMember, Meal, MealPlan, FamilyPreferences } from "@/entities/all";
import { InvokeLLM } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar as CalendarIcon, ChefHat, Plus, Star, Sparkles } from "lucide-react";
import { format, addDays, startOfDay } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import CalendarDay from "../components/calendar/CalendarDay";
import FavoritesDialog from "../components/calendar/FavoritesDialog";
import GenerateNewDialog from "../components/calendar/GenerateNewDialog";
import RecipeCard from "../components/calendar/RecipeCard";

export default function Calendar() {
  const [mealPlans, setMealPlans] = useState([]);
  const [meals, setMeals] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [familyPreferences, setFamilyPreferences] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Dialog states
  const [showFavorites, setShowFavorites] = useState(false);
  const [showGenerate, setShowGenerate] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  
  // Generate 14 days starting from today
  const startDate = startOfDay(new Date());
  const calendarDays = Array.from({ length: 14 }, (_, i) => addDays(startDate, i));

  useEffect(() => {
    loadCalendarData();
  }, []);

  const loadCalendarData = async () => {
    setIsLoading(true);
    try {
      const [plans, allMeals, members, prefsList] = await Promise.all([
        MealPlan.list(),
        Meal.list(),
        FamilyMember.list(),
        FamilyPreferences.list()
      ]);
      
      setMealPlans(plans);
      setMeals(allMeals);
      setFamilyMembers(members);
      setFamilyPreferences(prefsList[0] || null);
    } catch (error) {
      console.error("Error loading calendar data:", error);
    }
    setIsLoading(false);
  };

  const getMealForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const plan = mealPlans.find(p => p.date === dateStr);
    if (!plan) return null;
    return meals.find(m => m.id === plan.meal_id);
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const sourceDate = result.source.droppableId;
    const destDate = result.destination.droppableId;
    
    if (sourceDate === destDate) return;

    try {
      // Find the meal plan for the source date
      const sourcePlan = mealPlans.find(p => p.date === sourceDate);
      if (!sourcePlan) return;

      // Remove from source date
      await MealPlan.delete(sourcePlan.id);

      // Check if destination already has a meal
      const destPlan = mealPlans.find(p => p.date === destDate);
      if (destPlan) {
        // Update existing plan
        await MealPlan.update(destPlan.id, {
          meal_id: sourcePlan.meal_id,
          family_members: sourcePlan.family_members
        });
      } else {
        // Create new plan
        await MealPlan.create({
          date: destDate,
          meal_id: sourcePlan.meal_id,
          family_members: sourcePlan.family_members,
          meal_type: 'dinner'
        });
      }

      loadCalendarData();
    } catch (error) {
      console.error("Error moving meal:", error);
    }
  };

  const handleFavoriteSelect = async (meal) => {
    if (!selectedDate) return;
    
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const existingPlan = mealPlans.find(p => p.date === dateStr);
      
      if (existingPlan) {
        await MealPlan.update(existingPlan.id, { meal_id: meal.id });
      } else {
        await MealPlan.create({
          date: dateStr,
          meal_id: meal.id,
          family_members: familyMembers.map(m => m.id),
          meal_type: 'dinner'
        });
      }
      
      setShowFavorites(false);
      setSelectedDate(null);
      loadCalendarData();
    } catch (error) {
      console.error("Error adding favorite meal:", error);
    }
  };

  const handleGeneratedMeal = async (generatedMeal) => {
    if (!selectedDate) return;
    
    try {
      // First create the meal
      const newMeal = await Meal.create(generatedMeal);
      
      // Then create the meal plan
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const existingPlan = mealPlans.find(p => p.date === dateStr);
      
      if (existingPlan) {
        await MealPlan.update(existingPlan.id, { meal_id: newMeal.id });
      } else {
        await MealPlan.create({
          date: dateStr,
          meal_id: newMeal.id,
          family_members: familyMembers.map(m => m.id),
          meal_type: 'dinner'
        });
      }
      
      setShowGenerate(false);
      setSelectedDate(null);
      loadCalendarData();
    } catch (error) {
      console.error("Error adding generated meal:", error);
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-white mb-2 flex items-center gap-3"
        >
          <CalendarIcon className="w-8 h-8" />
          Meal Calendar
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-white/80 text-lg"
        >
          Plan your dinners for the next 2 weeks
        </motion.p>
      </div>

      {/* Calendar */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="space-y-4">
          <AnimatePresence>
            {calendarDays.map((date, index) => {
              const meal = getMealForDate(date);
              const dateStr = format(date, 'yyyy-MM-dd');
              
              return (
                <CalendarDay
                  key={dateStr}
                  date={date}
                  meal={meal}
                  index={index}
                  isLoading={isLoading}
                  onAddFavorite={() => {
                    setSelectedDate(date);
                    setShowFavorites(true);
                  }}
                  onGenerateNew={() => {
                    setSelectedDate(date);
                    setShowGenerate(true);
                  }}
                  onViewRecipe={(meal) => setSelectedRecipe(meal)}
                />
              );
            })}
 
