import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface DbFamilyPreferences {
  id: string;
  user_id: string;
  favorite_cuisines: string[] | null;
  cooking_equipment: string[] | null;
  created_at: string;
  updated_at: string;
}

export const useFamilyPreferences = (userId: string | null) => {
  const [isSaving, setIsSaving] = useState(false);
  const query = useQuery({
    queryKey: ["family-preferences", userId],
    enabled: !!userId,
    queryFn: async (): Promise<DbFamilyPreferences | null> => {
      const { data, error } = await supabase
        .from("family_preferences")
        .select("*")
        .eq("user_id", userId as string)
        .maybeSingle();
      if (error) throw error;
      return (data as DbFamilyPreferences | null) ?? null;
    },
    initialData: null,
  });

  const save = async (payload: { favorite_cuisines: string[]; cooking_equipment: string[] }) => {
    if (!userId) return { error: new Error("No user") } as const;
    setIsSaving(true);
    try {
      const { data: existing, error: fetchError } = await supabase
        .from("family_preferences")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();
      if (fetchError) return { error: fetchError } as const;

      if (existing?.id) {
        const { error } = await supabase
          .from("family_preferences")
          .update({
            favorite_cuisines: payload.favorite_cuisines,
            cooking_equipment: payload.cooking_equipment,
          })
          .eq("id", existing.id);
        return { error } as const;
      } else {
        const { error } = await supabase
          .from("family_preferences")
          .insert({
            user_id: userId,
            favorite_cuisines: payload.favorite_cuisines,
            cooking_equipment: payload.cooking_equipment,
          });
        return { error } as const;
      }
    } finally {
      setIsSaving(false);
    }
  };

  return { ...query, save, isSaving };
};
