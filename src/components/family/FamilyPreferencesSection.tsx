import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useFamilyPreferences } from "@/hooks/useFamilyPreferences";

const PRESET_CUISINES = [
  "Italian","Mexican","Asian","Mediterranean","American","Indian","Thai","Chinese","Japanese"
];

const PRESET_EQUIPMENT = [
  "Stove","Oven","Grill","Crockpot","Slow Cooker","Instant Pot","Air Fryer","Blender",
  "Food Processor","Stand Mixer","Bread Machine","Rice Cooker","Smoker","Deep Fryer",
  "Toaster Oven","Microwave","Steamer","Wok"
];

export const FamilyPreferencesSection = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [customCuisine, setCustomCuisine] = useState("");
  const [customEquipment, setCustomEquipment] = useState("");

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id ?? null);
    };
    init();
  }, []);

  const { data, isLoading, save, refetch, isSaving } = useFamilyPreferences(userId);

  const selectedCuisines = useMemo(() => data?.favorite_cuisines ?? [], [data]);
  const selectedEquipment = useMemo(() => data?.cooking_equipment ?? [], [data]);

  const toggleItem = (list: string[], item: string) =>
    list.includes(item) ? list.filter((i) => i !== item) : [...list, item];

  const handleSave = async (nextCuisines?: string[], nextEquipment?: string[]) => {
    if (!userId) {
      toast("Sign in to save family preferences");
      return;
    }
    const fc = (nextCuisines ?? selectedCuisines).map((s) => s.trim()).filter(Boolean);
    const ce = (nextEquipment ?? selectedEquipment).map((s) => s.trim()).filter(Boolean);
    const { error } = await save({ favorite_cuisines: fc, cooking_equipment: ce });
    if (error) {
      toast.error("Failed to save preferences");
    } else {
      toast.success("Preferences saved");
      refetch();
    }
  };

  const addCustom = (type: "cuisine" | "equipment") => {
    if (type === "cuisine") {
      const val = customCuisine.trim();
      if (!val) return;
      if (selectedCuisines.includes(val)) return;
      handleSave([...selectedCuisines, val], undefined);
      setCustomCuisine("");
    } else {
      const val = customEquipment.trim();
      if (!val) return;
      if (selectedEquipment.includes(val)) return;
      handleSave(undefined, [...selectedEquipment, val]);
      setCustomEquipment("");
    }
  };

  return (
    <Card className="bg-card/70 backdrop-blur-md border-emerald-100">
      <CardHeader>
        <CardTitle className="text-primary">Family Preferences</CardTitle>
        <CardDescription>Favorite cuisines and available cooking equipment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="text-muted-foreground">Loading preferences...</div>
        ) : (
          <>
            <section>
              <h3 className="font-semibold mb-3">Family Favorite Cuisines</h3>
              <div className="flex flex-wrap gap-2 mb-3">
            {PRESET_CUISINES.map((c) => {
              const active = selectedCuisines.includes(c);
              return (
                <Button
                  key={c}
                  variant={active ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => handleSave(toggleItem(selectedCuisines, c), undefined)}
                  className="rounded-full"
                >
                  {c}
                </Button>
              );
            })}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add custom cuisine"
                  value={customCuisine}
                  onChange={(e) => setCustomCuisine(e.target.value)}
                />
                <Button size="sm" onClick={() => addCustom("cuisine")}>Add</Button>
              </div>
              {selectedCuisines.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
              {selectedCuisines.map((c) => (
                <Badge key={c} variant="secondary" className="cursor-pointer rounded-full"
                  onClick={() => handleSave(toggleItem(selectedCuisines, c), undefined)}
                >
                  {c}
                </Badge>
              ))}
                </div>
              )}
            </section>

            <section>
              <h3 className="font-semibold mb-3">Available Cooking Equipment</h3>
              <div className="flex flex-wrap gap-2 mb-3">
            {PRESET_EQUIPMENT.map((eq) => {
              const active = selectedEquipment.includes(eq);
              return (
                <Button
                  key={eq}
                  variant={active ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => handleSave(undefined, toggleItem(selectedEquipment, eq))}
                  className="rounded-full"
                >
                  {eq}
                </Button>
              );
            })}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add custom equipment"
                  value={customEquipment}
                  onChange={(e) => setCustomEquipment(e.target.value)}
                />
                <Button size="sm" onClick={() => addCustom("equipment")}>Add</Button>
              </div>
              {selectedEquipment.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
              {selectedEquipment.map((eq) => (
                <Badge key={eq} variant="secondary" className="cursor-pointer rounded-full"
                  onClick={() => handleSave(undefined, toggleItem(selectedEquipment, eq))}
                >
                  {eq}
                </Badge>
              ))}
                </div>
              )}
            </section>

            <div className="flex justify-end">
              <Button disabled={isSaving || !userId} onClick={() => handleSave()}>
                Save Preferences
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
