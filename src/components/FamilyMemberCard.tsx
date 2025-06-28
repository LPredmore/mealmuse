
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

interface FamilyMember {
  id: string;
  name: string;
  age?: number;
  dietaryRestrictions: string[];
  allergies: string[];
  adventurousness: string;
  preferences: string;
}

interface FamilyMemberCardProps {
  member: FamilyMember;
}

export const FamilyMemberCard = ({ member }: FamilyMemberCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200 bg-white/60 border-orange-100">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-orange-100 rounded-full">
            <User className="h-4 w-4 text-orange-600" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-800">{member.name}</h4>
              {member.age && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                  {member.age}y
                </Badge>
              )}
            </div>
            
            <div className="space-y-1">
              {member.dietaryRestrictions.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {member.dietaryRestrictions.map((restriction, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-amber-300 text-amber-700">
                      {restriction}
                    </Badge>
                  ))}
                </div>
              )}
              
              {member.allergies.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {member.allergies.map((allergy, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-red-300 text-red-700">
                      ⚠️ {allergy}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            <div className="text-sm text-gray-600">
              <p><span className="font-medium">Adventurousness:</span> {member.adventurousness}</p>
              <p className="mt-1">{member.preferences}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
