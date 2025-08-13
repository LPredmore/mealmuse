
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Users, ChefHat, Clock, RefreshCw } from "lucide-react";
import { InvokeLLM } from "@/api/integrations";
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

      const prompt = `Generate a single dinner meal for a family.
      Target family members: ${JSON.stringify(preferences)}
      Family-wide preferred cuisines: ${familyCuisines.join(', ') || 'Any'}
      Available cooking equipment: ${availableEquipment.join(', ') || 'Basic kitchen equipment'}
      Requested difficulty: ${difficulty}
      Must be prepare ahead: ${prepareAhead}
      
      Generate a meal with:
      - Name (creative and appetizing)
      - Cuisine type (align with family preferences if possible)
      - Complexity level (must be "${difficulty}")
      - Prep time and cook time in minutes (realistic for ${difficulty} level)
      - Can prepare ahead (must be ${prepareAhead})
      - Servings (4)
      - Detailed ingredients list with amounts and units
      - Step-by-step cooking instructions
      - Equipment needed (only use equipment from the available list: ${availableEquipment.join(', ')})
      - Tags for dietary needs
      
      Make it suitable for everyone's dietary restrictions and allergies. Be creative but practical.
      Only suggest cooking methods that match the available equipment.`;

      const result = await InvokeLLM({
        prompt,
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
      <DialogContent className="backdrop-blur-xl bg-black/40 border border-white/20 rounded-3xl max-w-lg">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-white text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            Generate New Meal
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Family Selection */}
          <div>
            <Label className="text-white/80 flex items-center gap-2 mb-3">
              <Users className="w-4 h-4" />
              Who is this meal for?
            </Label>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="whole-family"
                  checked={useWholeFamily}
                  onCheckedChange={setUseWholeFamily}
                  className="border-white/30"
                />
                <Label htmlFor="whole-family" className="text-white/80">
                  Whole Family
                </Label>
              </div>
              
              {!useWholeFamily && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-2 pl-6"
                >
                  {familyMembers.map(member => (
                    <div key={member.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`member-${member.id}`}
                        checked={selectedMembers.includes(member.id)}
                        onCheckedChange={() => handleMemberToggle(member.id)}
                        className="border-white/30"
                      />
                      <Label htmlFor={`member-${member.id}`} className="text-white/80">
                        {member.name}
                      </Label>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <Label className="text-white/80 flex items-center gap-2 mb-3">
              <ChefHat className="w-4 h-4" />
              Meal Difficulty
            </Label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white rounded-xl backdrop-blur-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black/80 border-white/20 backdrop-blur-xl text-white">
                <SelectItem value="easy">Easy - Quick & Simple</SelectItem>
                <SelectItem value="moderate">Moderate - Some prep required</SelectItem>
                <SelectItem value="difficult">Difficult - Complex cooking</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Prepare Ahead */}
          <div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="prepare-ahead"
                checked={prepareAhead}
                onCheckedChange={setPrepareAhead}
                className="border-white/30"
              />
              <Label htmlFor="prepare-ahead" className="text-white/80 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Must be prepare ahead
              </Label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
          <Button
            onClick={handleClose}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl"
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || (!useWholeFamily && selectedMembers.length === 0)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-xl"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Feed Me!
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
