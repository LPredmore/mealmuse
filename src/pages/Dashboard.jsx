
import React, { useState, useEffect } from "react";
import { FamilyMember, Meal, MealPlan, FamilyPreferences } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ChefHat, 
  Users, 
  Calendar, 
  Sparkles, 
  Clock, 
  Star,
  Plus,
  RefreshCw,
  TrendingUp,
  BookOpen, // Added BookOpen
  ShoppingCart // Added ShoppingCart
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";

import QuickStats from "../components/dashboard/QuickStats";
import MealSuggestions from "../components/dashboard/MealSuggestions";
import RecentMeals from "../components/dashboard/RecentMeals";
import UpcomingMeals from "../components/dashboard/UpcomingMeals";

export default function Dashboard() {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [familyPreferences, setFamilyPreferences] = useState(null);
  const [suggestedMeals, setSuggestedMeals] = useState([]);
  const [upcomingMeals, setUpcomingMeals] = useState([]);
  const [recentMeals, setRecentMeals] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [stats, setStats] = useState({
    totalMeals: 0,
    favoriteCount: 0,
    weekPlanned: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [members, meals, plans, prefsList] = await Promise.all([
        FamilyMember.list(),
        Meal.list('-created_date', 10),
        MealPlan.list('-date', 7),
        FamilyPreferences.list()
      ]);

      setFamilyMembers(members);
      setRecentMeals(meals);
      setUpcomingMeals(plans);
      if (prefsList.length > 0) {
        setFamilyPreferences(prefsList[0]);
      }

      // Calculate stats
      const totalMeals = await Meal.list();
      const favorites = totalMeals.filter(meal => meal.is_favorite);
      setStats({
        totalMeals: totalMeals.length,
        favoriteCount: favorites.length,
        weekPlanned: plans.length
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  const generateMealSuggestions = async () => {
    if (familyMembers.length === 0) {
      return;
    }

    setIsGenerating(true);
    try {
      const individualPreferences = familyMembers.map(member => ({
        name: member.name,
        dietary_restrictions: member.dietary_restrictions || [],
        allergies: member.allergies || [],
        adventurousness: member.adventurousness_level || 'moderate',
        other_preferences: member.other_preferences || 'none'
      }));

      const familyCuisines = familyPreferences?.preferred_cuisines || [];

      const prompt = `Generate 3 diverse meal suggestions for a family.
      Family-wide preferred cuisines: ${familyCuisines.join(', ') || 'Any'}.
      Individual preferences: ${JSON.stringify(individualPreferences)}. 
      Consider seasonal ingredients and variety. For each meal, provide:
      - Name
      - Cuisine type (should align with family preferences if possible)
      - Complexity level (easy/moderate/difficult)
      - Prep time and cook time in minutes
      - Can prepare ahead (boolean)
      - Brief description
      - Main ingredients (3-5 key items)
      - Equipment needed
      - Tags for dietary needs
      
      Make the meals appealing, balanced, and suitable for everyone's preferences. Explicitly avoid ingredients listed in allergies.`;

      const result = await InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            meals: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  cuisine_type: { type: "string" },
                  complexity_level: { type: "string", enum: ["easy", "moderate", "difficult"] },
                  prep_time: { type: "number" },
                  cook_time: { type: "number" },
                  can_prepare_ahead: { type: "boolean" },
                  description: { type: "string" },
                  main_ingredients: { type: "array", items: { type: "string" } },
                  equipment_needed: { type: "array", items: { type: "string" } },
                  tags: { type: "array", items: { type: "string" } }
                }
              }
            }
          }
        }
      });

      setSuggestedMeals(result.meals || []);
    } catch (error) {
      console.error("Error generating meal suggestions:", error);
    }
    setIsGenerating(false);
  };

  const saveMealSuggestion = async (meal) => {
    try {
      await Meal.create({
        ...meal,
        servings: 4,
        ingredients: meal.main_ingredients?.map(ing => ({
          name: ing,
          amount: "1",
          unit: "portion"
        })) || [],
        instructions: [`Prepare ${meal.name} according to your preferred method.`]
      });
      
      // Remove from suggestions
      setSuggestedMeals(prev => prev.filter(m => m.name !== meal.name));
      loadDashboardData();
    } catch (error) {
      console.error("Error saving meal:", error);
    }
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
              className="text-4xl font-bold text-white mb-2"
            >
              Welcome to MealMuse
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white/80 text-lg"
            >
              Your AI-powered meal planning companion
            </motion.p>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex gap-4"
          >
            {familyMembers.length > 0 && (
              <Button
                onClick={generateMealSuggestions}
                disabled={isGenerating}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 backdrop-blur-sm px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Get AI Suggestions
                  </>
                )}
              </Button>
            )}
            <Link to={createPageUrl("Calendar")}>
              <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105">
                <Calendar className="w-5 h-5 mr-2" />
                Plan Meals
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Quick Stats */}
      <QuickStats stats={stats} familyCount={familyMembers.length} />

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Suggestions */}
        <div className="lg:col-span-2 space-y-8">
          <MealSuggestions 
            suggestions={suggestedMeals}
            isGenerating={isGenerating}
            onSaveMeal={saveMealSuggestion}
            familyCount={familyMembers.length}
          />
          
          <RecentMeals meals={recentMeals} />
        </div>

        {/* Right Column - Upcoming & Quick Actions */}
        <div className="space-y-8">
          <UpcomingMeals upcomingMeals={upcomingMeals} />
          
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-white text-xl font-bold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link to={createPageUrl("Family")}>
                  <Button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm rounded-2xl justify-start transition-all duration-300 hover:scale-105">
                    <Users className="w-5 h-5 mr-3" />
                    Manage Family
                  </Button>
                </Link>
                <Link to={createPageUrl("Recipes")}>
                  <Button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm rounded-2xl justify-start transition-all duration-300 hover:scale-105">
                    <BookOpen className="w-5 h-5 mr-3" />
                    Add Recipe
                  </Button>
                </Link>
                <Link to={createPageUrl("Shopping")}>
                  <Button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm rounded-2xl justify-start transition-all duration-300 hover:scale-105">
                    <ShoppingCart className="w-5 h-5 mr-3" />
                    Shopping List
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
