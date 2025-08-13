import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DbFamilyMember {
  id: string;
  user_id: string;
  name: string;
  age: number | null;
  adventurousness: string;
  dietary_restrictions: string[] | null;
  allergies: string[] | null;
  preferences: string | null;
  created_at: string;
  updated_at: string;
}

export const useFamilyMembers = (userId: string | null) => {
  const query = useQuery({
    queryKey: ["family-members", userId],
    enabled: !!userId,
    queryFn: async (): Promise<DbFamilyMember[]> => {
      const { data, error } = await supabase
        .from("family_members")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as DbFamilyMember[]) || [];
    },
    initialData: [],
  });

  const addMutation = useMutation({
    mutationFn: async (payload: Omit<DbFamilyMember, "id" | "created_at" | "updated_at">) => {
      const { error } = await supabase.from("family_members").insert(payload);
      if (error) throw error;
    },
  });

  return { ...query, addMutation };
};
