
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Users, ChefHat, Clock, RefreshCw } from "lucide-react";
import { InvokeLLM } from "@/integrations/Core";
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
 
