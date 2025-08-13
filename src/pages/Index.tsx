import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, User, Calendar, List, Edit } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { FamilyMemberCard } from "@/components/FamilyMemberCard";
import { RecipeCard } from "@/components/RecipeCard";
import { AIGenerationSection } from "@/components/AIGenerationSection";
import { FamilySection } from "@/components/family/FamilySection";
import { FamilyPreferencesSection } from "@/components/family/FamilyPreferencesSection";
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

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen app-gradient">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="container mx-auto px-4 py-8">
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <h1 className="text-5xl font-bold heading-gradient">
                MealMuse
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                AI-powered family meal planning that brings everyone to the table
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-card/60 backdrop-blur-md border-border/40 hover:shadow-glow transition-all duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl font-bold text-primary">2</CardTitle>
                  <CardDescription>Family Members</CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="bg-card/60 backdrop-blur-md border-border/40 hover:shadow-glow transition-all duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl font-bold text-primary">12</CardTitle>
                  <CardDescription>Favorite Recipes</CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="bg-card/60 backdrop-blur-md border-border/40 hover:shadow-glow transition-all duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl font-bold text-primary">5</CardTitle>
                  <CardDescription>Planned Meals</CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="bg-card/60 backdrop-blur-md border-border/40 hover:shadow-glow transition-all duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl font-bold text-primary">3</CardTitle>
                  <CardDescription>AI Suggestions</CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* AI Generation Section */}
            <AIGenerationSection />

            {/* Family Members & Recipes Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Family Members */}
              <Card className="bg-card/70 backdrop-blur-md border-border/40 rounded-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-primary">
                        <User className="h-5 w-5" />
                        Family Members
                      </CardTitle>
                      <CardDescription>Manage preferences and dietary needs</CardDescription>
                    </div>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Member
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockFamilyMembers.map((member) => (
                    <FamilyMemberCard key={member.id} member={member} />
                  ))}
                </CardContent>
              </Card>

              {/* Favorite Recipes */}
              <Card className="bg-card/70 backdrop-blur-md border-border/40 rounded-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-primary">
                        <List className="h-5 w-5" />
                        Favorite Recipes
                      </CardTitle>
                      <CardDescription>Your family's go-to meals</CardDescription>
                    </div>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Recipe
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockFavoriteRecipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-card/60 backdrop-blur-md border-border/40 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-center text-primary">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button onClick={() => setActiveTab("family")}>
                    <User className="h-4 w-4 mr-2" />
                    Manage Family
                  </Button>
                  <Button onClick={() => setActiveTab("calendar")}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Plan Meals
                  </Button>
                  <Button onClick={() => setActiveTab("recipes")}>
                    <Edit className="h-4 w-4 mr-2" />
                    Add Recipe
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

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
      </main>
    </div>
  );
};

export default Index;
