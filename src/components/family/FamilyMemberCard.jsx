import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, User, AlertCircle, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const adventurinessColors = {
  picky_eater: "bg-red-500/20 text-red-300 border-red-500/30",
  conservative: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  moderate: "bg-green-500/20 text-green-300 border-green-500/30",
  adventurous: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  experimental: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
};

export default function FamilyMemberCard({ member, index, onEdit, onDelete }) {
  const formatAdventurousness = (level) => {
    if (!level) return "Moderate";
    return level.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="h-full flex flex-col backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl hover:bg-white/15 transition-all duration-300 hover:scale-105 overflow-hidden">
        <CardContent className="p-6 flex-grow flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-2xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">{member.name}</h3>
                <p className="text-white/70 text-sm">
                  {member.age ? `${member.age} years old` : 'Age not specified'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={onEdit}
                className="w-8 h-8 p-0 text-white/70 hover:text-white hover:bg-white/20 rounded-xl"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onDelete}
                className="w-8 h-8 p-0 text-red-300 hover:text-red-200 hover:bg-red-500/20 rounded-xl"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Adventurousness Level */}
          <div className="mb-4">
            <Badge className={`${adventurinessColors[member.adventurousness_level || 'moderate']} border backdrop-blur-sm`}>
              {formatAdventurousness(member.adventurousness_level)}
            </Badge>
          </div>

          {/* Dietary Info */}
          <div className="space-y-4 flex-grow">
            {(member.dietary_restrictions && member.dietary_restrictions.length > 0) && (
              <div>
                <span className="text-white/80 text-sm font-medium">Dietary Restrictions</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {member.dietary_restrictions.map((restriction, i) => (
                    <Badge key={i} className="bg-orange-500/20 text-orange-300 border-orange-500/30 border backdrop-blur-sm text-xs">
                      {restriction}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {(member.allergies && member.allergies.length > 0) && (
              <div>
                <span className="text-white/80 text-sm font-medium">Allergies</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {member.allergies.map((allergy, i) => (
                    <Badge key={i} className="bg-red-500/20 text-red-300 border-red-500/30 border backdrop-blur-sm text-xs">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Other Preferences */}
          {member.other_preferences && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-cyan-300" />
                <span className="text-white/80 text-sm font-medium">Other Preferences</span>
              </div>
              <p className="text-white/70 text-sm italic">"{member.other_preferences}"</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}