import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Users, ChefHat, Clock, RefreshCw } from "lucide-react";
import { InvokeLLM } from "@/lib/ai";
import { motion } from "framer-motion";

export default function GenerateNewDialog({ 
  open, 
  onClose, 
  familyMembers, 
  familyPreferences, 
  onGenerate 
}) {
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [useWholeFamily, setUseWholeFamily] = useState(true);
  const [difficulty, setDifficulty] = useState("moderate");
  const [prepareAhead, setPrepareAhead] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleClose = () => {
    setSelectedMembers([]);
    setUseWholeFamily(true);
    setDifficulty("moderate");
    setPrepareAhead(false);
    setIsGenerating(false);
    onClose();
  };

  const handleMemberToggle = (memberId) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      const targetMembers = useWholeFamily 
        ? familyMembers 
        : familyMembers.filter(m => selectedMembers.includes(m.id));

      const preferences = targetMembers.map(member => ({
        name: member.name,
        dietary_restrictions: member.dietary_restrictions || [],
        allergies: member.allergies || [],
        adventurousness: member.adventurousness_level || 'moderate',
        other_preferences: member.other_preferences || 'none'
      }));

      const familyCuisines = familyPreferences?.preferred_cuisines || [];
      const availableEquipment = familyPreferences?.cooking_apparatus || [];

      const result = await InvokeLLM({
        prompt: `Generate a dinner meal for family with preferences: ${JSON.stringify(preferences)}`,
        response_json_schema: {
          type: "object",
          properties: {
            name: { type: "string" },
            cuisine_type: { type: "string" },
            complexity_level: { type: "string", enum: ["easy", "moderate", "difficult"] },
            prep_time: { type: "number" },
            cook_time: { type: "number" },
            servings: { type: "number" },
            can_prepare_ahead: { type: "boolean" },
            ingredients: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  amount: { type: "string" },
                  unit: { type: "string" }
                }
              }
            },
            instructions: {
              type: "array",
              items: { type: "string" }
            },
            equipment_needed: {
              type: "array",
              items: { type: "string" }
            },
            tags: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      onGenerate(result);
      handleClose();
    } catch (error) {
      console.error("Error generating meal:", error);
    }
    setIsGenerating(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="backdrop-blur-xl bg-black/40 border border-white/20 rounded-3xl max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl font-bold flex items-center gap-3">
            <Sparkles className="w-6 h-6" />
            Generate New Meal
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Family Members Selection */}
          <div>
            <Label className="text-white text-sm font-medium mb-3 block">Who is this meal for?</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="whole-family"
                  checked={useWholeFamily}
                  onCheckedChange={(checked) => setUseWholeFamily(checked === true)}
                  className="border-white/30"
                />
                <Label htmlFor="whole-family" className="text-white flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Whole Family ({familyMembers.length} members)
                </Label>
              </div>
              
              {!useWholeFamily && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="grid grid-cols-2 gap-2 pl-6"
                >
                  {familyMembers.map(member => (
                    <div key={member.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={member.id}
                        checked={selectedMembers.includes(member.id)}
                        onCheckedChange={() => handleMemberToggle(member.id)}
                        className="border-white/30"
                      />
                      <Label htmlFor={member.id} className="text-white/80 text-sm">
                        {member.name}
                      </Label>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          {/* Difficulty Level */}
          <div>
            <Label className="text-white text-sm font-medium mb-3 block">Difficulty Level</Label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy (30 min or less)</SelectItem>
                <SelectItem value="moderate">Moderate (30-60 min)</SelectItem>
                <SelectItem value="difficult">Difficult (60+ min)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Prepare Ahead Option */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="prepare-ahead"
              checked={prepareAhead}
              onCheckedChange={(checked) => setPrepareAhead(checked === true)}
              className="border-white/30"
            />
            <Label htmlFor="prepare-ahead" className="text-white flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Must be able to prepare ahead
            </Label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleClose}
              variant="outline"
              className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || (!useWholeFamily && selectedMembers.length === 0)}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Meal
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}