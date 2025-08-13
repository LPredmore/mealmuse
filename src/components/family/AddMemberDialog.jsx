import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus } from "lucide-react";

const commonDietaryRestrictions = [
  "Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Keto", "Paleo", "Low-Carb", "Low-Fat", "Carnivore"
];

const commonAllergies = [
  "Nuts", "Peanuts", "Shellfish", "Fish", "Eggs", "Dairy", "Soy", "Wheat"
];

export default function AddMemberDialog({ open, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    dietary_restrictions: [],
    allergies: [],
    adventurousness_level: "moderate",
    other_preferences: ""
  });

  const [customInputs, setCustomInputs] = useState({
    restriction: "",
    allergy: ""
  });
  
  const handleClose = () => {
    setFormData({
      name: "",
      age: "",
      dietary_restrictions: [],
      allergies: [],
      adventurousness_level: "moderate",
      other_preferences: ""
    });
    setCustomInputs({ restriction: "", allergy: "" });
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      age: formData.age ? parseInt(formData.age) : undefined
    });
    handleClose();
  };

  const addItem = (field, value) => {
    if (value && !formData[field].includes(value)) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value]
      }));
    }
  };

  const removeItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const addCustomItem = (field, inputField) => {
    const value = customInputs[inputField].trim();
    if (value) {
      addItem(field, value);
      setCustomInputs(prev => ({ ...prev, [inputField]: "" }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="backdrop-blur-xl bg-black/40 border border-white/20 rounded-3xl max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl font-bold">Add Family Member</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 text-white/80">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl backdrop-blur-sm mt-1"
                placeholder="Enter name"
                required
              />
            </div>
            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl backdrop-blur-sm mt-1"
                placeholder="Age"
              />
            </div>
          </div>

          {/* Adventurousness Level */}
          <div>
            <Label>Adventurousness with Food</Label>
            <Select value={formData.adventurousness_level} onValueChange={(value) => setFormData(prev => ({ ...prev, adventurousness_level: value }))}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white rounded-xl backdrop-blur-sm mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black/80 border-white/20 backdrop-blur-xl text-white">
                <SelectItem value="picky_eater">Picky Eater - Very selective</SelectItem>
                <SelectItem value="conservative">Conservative - Prefers familiar foods</SelectItem>
                <SelectItem value="moderate">Moderate - Open to some new things</SelectItem>
                <SelectItem value="adventurous">Adventurous - Loves trying new foods</SelectItem>
                <SelectItem value="experimental">Experimental - Will try anything once</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dietary Restrictions */}
          <div>
            <Label>Dietary Restrictions</Label>
            <div className="flex flex-wrap gap-2 my-2">
              {commonDietaryRestrictions.map((restriction) => (
                <button
                  key={restriction}
                  type="button"
                  onClick={() => addItem('dietary_restrictions', restriction)}
                  className={`px-3 py-1 rounded-xl text-sm transition-all duration-300 ${
                    formData.dietary_restrictions.includes(restriction)
                      ? 'bg-orange-500/30 text-orange-300 border border-orange-500/50'
                      : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
                  }`}
                >
                  {restriction}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={customInputs.restriction}
                onChange={(e) => setCustomInputs(prev => ({ ...prev, restriction: e.target.value }))}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl backdrop-blur-sm"
                placeholder="Add custom restriction"
              />
              <Button
                type="button"
                onClick={() => addCustomItem('dietary_restrictions', 'restriction')}
                className="bg-white/20 hover:bg-white/30 text-white border-0 rounded-xl"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {formData.dietary_restrictions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.dietary_restrictions.map((item, index) => (
                  <Badge key={index} className="bg-orange-500/20 text-orange-300 border-orange-500/30 border backdrop-blur-sm">
                    {item}
                    <button type="button" onClick={() => removeItem('dietary_restrictions', index)} className="ml-2">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          {/* Allergies */}
          <div>
            <Label>Allergies</Label>
             <div className="flex flex-wrap gap-2 my-2">
              {commonAllergies.map((allergy) => (
                <button
                  key={allergy}
                  type="button"
                  onClick={() => addItem('allergies', allergy)}
                  className={`px-3 py-1 rounded-xl text-sm transition-all duration-300 ${
                    formData.allergies.includes(allergy)
                      ? 'bg-red-500/30 text-red-300 border border-red-500/50'
                      : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
                  }`}
                >
                  {allergy}
                </button>
              ))}
            </div>
            {formData.allergies.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.allergies.map((item, index) => (
                  <Badge key={index} className="bg-red-500/20 text-red-300 border-red-500/30 border backdrop-blur-sm">
                    {item}
                    <button type="button" onClick={() => removeItem('allergies', index)} className="ml-2">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Other Preferences */}
          <div>
            <Label htmlFor="other_preferences">Other Preferences</Label>
            <Textarea
              id="other_preferences"
              value={formData.other_preferences}
              onChange={(e) => setFormData(prev => ({...prev, other_preferences: e.target.value}))}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl backdrop-blur-sm mt-1"
              placeholder="e.g., Prefers small amounts of meat, loves mushrooms, dislikes cilantro..."
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              onClick={handleClose}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-xl"
            >
              Add Member
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}