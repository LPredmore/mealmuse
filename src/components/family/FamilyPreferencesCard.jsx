import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X, Plus, Heart, Save, ChefHat } from "lucide-react";
import { motion } from "framer-motion";

const commonCuisines = [
  "Italian", "Mexican", "Asian", "Mediterranean", "American", "Indian", "Thai", "Chinese", "Japanese"
];

const cookingEquipment = [
  "Stove", "Oven", "Grill", "Crockpot", "Slow Cooker", "Instant Pot", "Air Fryer", 
  "Blender", "Food Processor", "Stand Mixer", "Bread Machine", "Rice Cooker", 
  "Smoker", "Deep Fryer", "Toaster Oven", "Microwave", "Steamer", "Wok"
];

export default function FamilyPreferencesCard({ preferences, onSave }) {
  const [preferredCuisines, setPreferredCuisines] = useState([]);
  const [cookingApparatus, setCookingApparatus] = useState([]);
  const [customCuisine, setCustomCuisine] = useState("");
  const [customEquipment, setCustomEquipment] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (preferences) {
      setPreferredCuisines(preferences.preferred_cuisines || []);
      setCookingApparatus(preferences.cooking_apparatus || []);
    }
  }, [preferences]);
  
  const handleAddCuisine = (cuisine) => {
    if (cuisine && !preferredCuisines.includes(cuisine)) {
      setPreferredCuisines(prev => [...prev, cuisine]);
      setIsDirty(true);
    }
  };
  
  const handleAddEquipment = (equipment) => {
    if (equipment && !cookingApparatus.includes(equipment)) {
      setCookingApparatus(prev => [...prev, equipment]);
      setIsDirty(true);
    }
  };
  
  const handleAddCustomCuisine = () => {
    if (customCuisine.trim()) {
      handleAddCuisine(customCuisine.trim());
      setCustomCuisine("");
    }
  };
  
  const handleAddCustomEquipment = () => {
    if (customEquipment.trim()) {
      handleAddEquipment(customEquipment.trim());
      setCustomEquipment("");
    }
  };
  
  const handleRemoveCuisine = (index) => {
    setPreferredCuisines(prev => prev.filter((_, i) => i !== index));
    setIsDirty(true);
  };
  
  const handleRemoveEquipment = (index) => {
    setCookingApparatus(prev => prev.filter((_, i) => i !== index));
    setIsDirty(true);
  };
  
  const handleSave = () => {
    onSave({ 
      ...preferences, 
      preferred_cuisines: preferredCuisines,
      cooking_apparatus: cookingApparatus
    });
    setIsDirty(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl">
        <CardContent className="p-6 space-y-8">
          {/* Preferred Cuisines Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-pink-300" />
              <span className="text-white/80 font-semibold">Family Favorite Cuisines</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {commonCuisines.map((cuisine) => (
                <button
                  key={cuisine}
                  type="button"
                  onClick={() => handleAddCuisine(cuisine)}
                  className={`px-3 py-1 rounded-xl text-sm transition-all duration-300 ${
                    preferredCuisines.includes(cuisine)
                      ? 'bg-pink-500/30 text-pink-300 border border-pink-500/50'
                      : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
                  }`}
                >
                  {cuisine}
                </button>
              ))}
            </div>
            
            <div className="flex gap-2 mb-3">
              <Input
                value={customCuisine}
                onChange={(e) => setCustomCuisine(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCustomCuisine()}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl backdrop-blur-sm"
                placeholder="Add custom cuisine"
              />
              <Button
                type="button"
                onClick={handleAddCustomCuisine}
                className="bg-white/20 hover:bg-white/30 text-white border-0 rounded-xl"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {preferredCuisines.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {preferredCuisines.map((item, index) => (
                  <Badge key={index} className="bg-pink-500/20 text-pink-300 border-pink-500/30 border backdrop-blur-sm">
                    {item}
                    <button type="button" onClick={() => handleRemoveCuisine(index)} className="ml-2">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Cooking Equipment Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ChefHat className="w-5 h-5 text-cyan-300" />
              <span className="text-white/80 font-semibold">Available Cooking Equipment</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {cookingEquipment.map((equipment) => (
                <button
                  key={equipment}
                  type="button"
                  onClick={() => handleAddEquipment(equipment)}
                  className={`px-3 py-1 rounded-xl text-sm transition-all duration-300 ${
                    cookingApparatus.includes(equipment)
                      ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
                      : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
                  }`}
                >
                  {equipment}
                </button>
              ))}
            </div>
            
            <div className="flex gap-2 mb-3">
              <Input
                value={customEquipment}
                onChange={(e) => setCustomEquipment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCustomEquipment()}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl backdrop-blur-sm"
                placeholder="Add custom equipment"
              />
              <Button
                type="button"
                onClick={handleAddCustomEquipment}
                className="bg-white/20 hover:bg-white/30 text-white border-0 rounded-xl"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {cookingApparatus.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {cookingApparatus.map((item, index) => (
                  <Badge key={index} className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 border backdrop-blur-sm">
                    {item}
                    <button type="button" onClick={() => handleRemoveEquipment(index)} className="ml-2">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          {/* Save Button */}
          {isDirty && (
            <div className="pt-4 border-t border-white/10">
              <Button
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-xl"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Preferences
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}