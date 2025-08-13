import React, { useState, useEffect } from "react";
import { MealPlan, Meal } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Printer } from "lucide-react";
import { format, addDays, startOfDay } from "date-fns";
import { motion } from "framer-motion";

import MealSelector from "../components/shopping/MealSelector";
import ShoppingListDisplay from "../components/shopping/ShoppingListDisplay";

export default function Shopping() {
  const [mealPlans, setMealPlans] = useState([]);
  const [meals, setMeals] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [checkedItems, setCheckedItems] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Generate 14 days starting from today to filter meal plans
  const startDate = startOfDay(new Date());
  const availableDates = Array.from({ length: 14 }, (_, i) => addDays(startDate, i));
  const availableDateStrings = availableDates.map(d => format(d, 'yyyy-MM-dd'));

  useEffect(() => {
    loadShoppingData();
  }, []);

  useEffect(() => {
    if (selectedMeals.length > 0) {
      generateShoppingList();
    } else {
      setShoppingList([]);
    }
  }, [selectedMeals]);

  const loadShoppingData = async () => {
    setIsLoading(true);
    try {
      const [plans, allMeals] = await Promise.all([
        MealPlan.list(),
        Meal.list()
      ]);
      
      setMealPlans(plans);
      setMeals(allMeals);
    } catch (error) {
      console.error("Error loading shopping data:", error);
    }
    setIsLoading(false);
  };

  const getPlannedMeals = () => {
    const mealsForDates = [];
    
    // Filter plans to be within the next 14 days
    const upcomingPlans = mealPlans.filter(p => availableDateStrings.includes(p.date));

    upcomingPlans.forEach(plan => {
      const meal = meals.find(m => m.id === plan.meal_id);
      if (meal) {
        mealsForDates.push({
          ...meal,
          // Handle potential date parsing issues across browsers
          plannedDate: new Date(plan.date.replace(/-/g, '/')), 
          planId: plan.id
        });
      }
    });
    
    // Sort meals by date
    return mealsForDates.sort((a,b) => a.plannedDate.getTime() - b.plannedDate.getTime());
  };

  const handleMealToggle = (meal) => {
    setSelectedMeals(prev => {
      const exists = prev.find(m => m.id === meal.id && m.planId === meal.planId);
      
      if (exists) {
        return prev.filter(m => !(m.id === meal.id && m.planId === meal.planId));
      } else {
        return [...prev, meal];
      }
    });
  };

  const generateShoppingList = () => {
    const ingredientMap = new Map();
    
    selectedMeals.forEach(meal => {
      if (meal.ingredients && meal.ingredients.length > 0) {
        meal.ingredients.forEach(ingredient => {
          const key = ingredient.name.toLowerCase();
          
          if (ingredientMap.has(key)) {
            const existing = ingredientMap.get(key);
            // For now, just combine quantities as text - could be enhanced with unit conversion
            existing.combinedAmount = `${existing.combinedAmount} + ${ingredient.amount} ${ingredient.unit}`;
            existing.meals.push(meal.name);
          } else {
            ingredientMap.set(key, {
              name: ingredient.name,
              amount: ingredient.amount,
              unit: ingredient.unit,
              combinedAmount: `${ingredient.amount} ${ingredient.unit}`,
              meals: [meal.name]
            });
          }
        });
      }
    });
    
    const consolidatedList = Array.from(ingredientMap.values()).sort((a, b) => 
      a.name.localeCompare(b.name)
    );
    
    setShoppingList(consolidatedList);
    setCheckedItems(new Set()); // Reset checked items when list changes
  };

  const handleItemCheck = (itemName) => {
    setCheckedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemName)) {
        newSet.delete(itemName);
      } else {
        newSet.add(itemName);
      }
      return newSet;
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const clearAllSelections = () => {
    setSelectedMeals([]);
    setShoppingList([]);
    setCheckedItems(new Set());
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-white mb-2 flex items-center gap-3"
            >
              <ShoppingCart className="w-8 h-8" />
              Shopping List
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white/80 text-lg"
            >
              Select meals to generate your consolidated shopping list
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex gap-3"
          >
            {shoppingList.length > 0 && (
              <Button
                onClick={handlePrint}
                className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105"
              >
                <Printer className="w-5 h-5 mr-2" />
                Print List
              </Button>
            )}
            {selectedMeals.length > 0 && (
              <Button
                onClick={clearAllSelections}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105"
              >
                Clear All
              </Button>
            )}
          </motion.div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Meal Selection */}
        <div className="lg:col-span-1 space-y-6">
          <MealSelector
            plannedMeals={getPlannedMeals()}
            selectedMeals={selectedMeals}
            onMealToggle={handleMealToggle}
            isLoading={isLoading}
          />
        </div>

        {/* Right Column - Shopping List */}
        <div className="lg:col-span-1 space-y-6">
          <ShoppingListDisplay
            shoppingList={shoppingList}
            checkedItems={checkedItems}
            onItemCheck={handleItemCheck}
            selectedMeals={selectedMeals}
          />
        </div>
      </div>
    </div>
  );
}