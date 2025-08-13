import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, User } from "lucide-react";
import { FamilyMemberCard } from "@/components/FamilyMemberCard";
import { AddFamilyMemberDialog } from "./AddFamilyMemberDialog";
import { useFamilyMembers } from "@/hooks/useFamilyMembers";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const FamilySection = () => {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Family | MealMuse"; // SEO: title tag
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id ?? null);
      if (!data.user) {
        toast("Sign in to save family members to your account");
      }
    };
    init();
  }, []);

  const { data: members, isLoading, refetch } = useFamilyMembers(userId);

  const mappedMembers = useMemo(
    () =>
      (members ?? []).map((m) => ({
        id: m.id,
        name: m.name,
        age: m.age ?? undefined,
        dietaryRestrictions: m.dietary_restrictions ?? [],
        allergies: m.allergies ?? [],
        adventurousness: m.adventurousness,
        preferences: m.preferences ?? "",
      })),
    [members]
  );

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-orange-100">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <User className="h-5 w-5" />
              Family Members
            </CardTitle>
            <CardDescription>Manage preferences and dietary needs</CardDescription>
          </div>
          <Button
            size="sm"
            className="bg-orange-500 hover:bg-orange-600"
            onClick={() => setOpen(true)}
            disabled={!userId}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Member
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="text-gray-500">Loading members...</div>
        ) : mappedMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mappedMembers.map((member) => (
              <FamilyMemberCard key={member.id} member={member} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            {userId
              ? "No family members yet. Click Add Member to get started."
              : "Please sign in to view and add family members."}
          </div>
        )}
      </CardContent>

      <AddFamilyMemberDialog
        open={open}
        onOpenChange={setOpen}
        userId={userId}
        onAdded={() => {
          setOpen(false);
          refetch();
        }}
      />
    </Card>
  );
};
