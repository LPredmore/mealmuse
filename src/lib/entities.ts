import { supabase } from "@/integrations/supabase/client";

// Family Member Entity
export class FamilyMember {
  static async list() {
    const { data, error } = await supabase.from("family_members").select("*");
    if (error) throw error;
    return data || [];
  }
  
  static async create(data: any) {
    const { data: result, error } = await supabase
      .from("family_members")
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return result;
  }
  
  static async update(id: string, data: any) {
    const { data: result, error } = await supabase
      .from("family_members")
      .update(data)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return result;
  }
  
  static async delete(id: string) {
    const { error } = await supabase
      .from("family_members")
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  }
}

// Family Preferences Entity
export class FamilyPreferences {
  static async list() {
    const { data, error } = await supabase.from("family_preferences").select("*");
    if (error) throw error;
    return data || [];
  }
  
  static async create(data: any) {
    const { data: result, error } = await supabase
      .from("family_preferences")
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return result;
  }
  
  static async update(id: string, data: any) {
    const { data: result, error } = await supabase
      .from("family_preferences")
      .update(data)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return result;
  }
}

// Mock entities for now
export class Meal {
  static async list() {
    return [
      {
        id: "1",
        name: "Spaghetti Carbonara",
        cuisine_type: "Italian",
        complexity_level: "moderate",
        prep_time: 10,
        cook_time: 20,
        servings: 4,
        can_prepare_ahead: false,
        is_favorite: true,
        ingredients: [
          { name: "Spaghetti", amount: "400", unit: "g" },
          { name: "Eggs", amount: "4", unit: "pieces" }
        ],
        instructions: ["Cook pasta", "Make sauce"],
        equipment_needed: ["Pot"],
        tags: ["Italian"]
      }
    ];
  }
  
  static async create(data: any) {
    return { id: Date.now().toString(), ...data };
  }
}

export class MealPlan {
  static async list() {
    return [];
  }
  
  static async create(data: any) {
    return { id: Date.now().toString(), ...data };
  }
  
  static async update(id: string, data: any) {
    return { id, ...data };
  }
  
  static async delete(id: string) {
    return true;
  }
}