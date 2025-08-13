import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, User, Calendar, List, Edit } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AuthStatus } from "@/components/AuthStatus";
import { FamilyMemberCard } from "@/components/FamilyMemberCard";
import { RecipeCard } from "@/components/RecipeCard";
import { AIGenerationSection } from "@/components/AIGenerationSection";
import { FamilySection } from "@/components/family/FamilySection";
import { FamilyPreferencesSection } from "@/components/family/FamilyPreferencesSection";
import QuickStats from "@/components/dashboard/QuickStats";
import MealSuggestions from "@/components/dashboard/MealSuggestions";
import RecentMeals from "@/components/dashboard/RecentMeals";
import UpcomingMeals from "@/components/dashboard/UpcomingMeals";

// Mock data for demonstration
const mockFamilyMembers = [
  {
    id: "1",
    name: "Sarah",
    age: 35,
    dietaryRestrictions: ["Gluten-Free"],
    allergies: ["Nuts"],
    adventurousness: "Moderate",
    preferences: "Loves Mediterranean cuisine"
  },
  {
    id: "2", 
    name: "Mike",
    age: 38,
    dietaryRestrictions: [],
    allergies: [],
    adventurousness: "Conservative",
    preferences: "Prefers comfort food"
  }
];

const mockFavoriteRecipes = [
  {
    id: "1",
    name: "Mediterranean Quinoa Bowl",
    cuisine: "Mediterranean",
    complexity: "Easy",
    prepTime: 15,
    cookTime: 20,
    isFavorite: true,
    tags: ["Gluten-Free", "Vegetarian"]
  },
  {
    id: "2",
    name: "Classic Beef Tacos",
    cuisine: "Mexican", 
    complexity: "Easy",
    prepTime: 10,
    cookTime: 15,
    isFavorite: true,
    tags: ["Quick Dinner"]
  }
]; 

// Mock dashboard data to match the design reference
const mockUpcomingMeals = [
  { id: "u1", date: "Jun 14", label: "DINNER", note: "Meal planned" },
  { id: "u2", date: "Jun 12", label: "DINNER", note: "Meal planned" },
  { id: "u3", date: "Jun 11", label: "DINNER", note: "Meal planned" },
];

const mockRecentMeals = [
  { id: "r1", name: "Savory Herb-Crusted Beef Tenderloin", cuisine: "American", difficulty: "moderate", time: "50 min", servings: 4 },
  { id: "r2", name: "Honey Garlic Chicken Stir Fry", cuisine: "Asian", difficulty: "moderate", time: "35 min", servings: 4 },
];

const mockSuggestedMeals = [
  { id: "s1", name: "Teriyaki Salmon Bowl", cuisine: "Asian", difficulty: "easy", time: "25 min", description: "Healthy and delicious" },
  { id: "s2", name: "Italian Pasta Primavera", cuisine: "Italian", difficulty: "moderate", time: "35 min", description: "Fresh vegetables and pasta" },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isGenerating, setIsGenerating] = useState(false);
  
  useEffect(() => {
    document.title = "MealMuse Dashboard - AI Meal Planning";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "MealMuse dashboard with AI meal suggestions, upcoming meals, and quick actions.");
  }, []);

  const handleSaveMeal = (meal) => {
    console.log("Saving meal:", meal);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen app-gradient flex">
        <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1">
          <header className="h-14 flex items-center justify-between container mx-auto px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setActiveTab('dashboard')} className="rounded-2xl">Get AI Suggestions</Button>
              <Button variant="outline" onClick={() => setActiveTab('calendar')} className="rounded-2xl">Plan Meals</Button>
            </div>
            <AuthStatus />
          </header>
          <div className="container mx-auto px-4 py-8">
          <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="backdrop-blur-xl bg-card/40 border border-border/40 rounded-3xl p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                  <h1 className="text-4xl md:text-5xl font-bold heading-gradient">Welcome to MealMuse</h1>
                  <p className="text-lg text-muted-foreground">Your AI-powered meal planning companion</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="secondary" onClick={() => setActiveTab('dashboard')} className="rounded-2xl px-6">
                    Get AI Suggestions
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab('calendar')} className="rounded-2xl px-6">
                    Plan Meals
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <QuickStats
              familyCount={mockFamilyMembers.length}
              totalMeals={4}
              favoriteCount={2}
              weekPlanned={3}
            />

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Suggestions and Recent */}
              <div className="lg:col-span-2 space-y-8">
                <MealSuggestions 
                  suggestions={mockSuggestedMeals}
                  isGenerating={isGenerating}
                  onSaveMeal={handleSaveMeal}
                  familyCount={mockFamilyMembers.length}
                />
                <RecentMeals meals={mockRecentMeals} />
              </div>

              {/* Right Column - Upcoming & Quick Actions */}
              <div className="space-y-8">
                <UpcomingMeals upcomingMeals={mockUpcomingMeals} />

                {/* Quick Actions */}
                <Card className="backdrop-blur-xl bg-card/50 border border-border/40 rounded-3xl overflow-hidden">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-foreground text-xl font-bold">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start rounded-2xl" onClick={() => setActiveTab("family")}>
                      <User className="h-4 w-4 mr-3" />
                      Manage Family
                    </Button>
                    <Button className="w-full justify-start rounded-2xl" onClick={() => setActiveTab("recipes")}>
                      <List className="h-4 w-4 mr-3" />
                      Add Recipe
                    </Button>
                    <Button className="w-full justify-start rounded-2xl" onClick={() => setActiveTab("shopping")}>
                      <Calendar className="h-4 w-4 mr-3" />
                      Shopping List
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

        {activeTab === "family" && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-primary">Family Management</h1>
            <p className="text-muted-foreground">Manage individual profiles and family-wide preferences.</p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <FamilySection />
              </div>
              <div>
                <FamilyPreferencesSection />
              </div>
            </div>
          </div>
        )}

        {activeTab === "calendar" && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-primary">Meal Calendar</h2>
            <p className="text-muted-foreground">Plan your family's meals for the next 14 days.</p>
            <div className="text-center py-12 text-muted-foreground">
              Meal calendar interface coming soon...
            </div>
          </div>
        )}

        {activeTab === "recipes" && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-primary">Recipe Library</h2>
            <p className="text-muted-foreground">Browse and manage your family's recipe collection.</p>
            <div className="text-center py-12 text-muted-foreground">
              Recipe library interface coming soon...
            </div>
          </div>
        )}

        {activeTab === "shopping" && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-primary">Shopping List</h2>
            <p className="text-muted-foreground">Generate and manage your grocery shopping lists.</p>
            <div className="text-center py-12 text-muted-foreground">
              Shopping list interface coming soon...
            </div>
          </div>
        )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;