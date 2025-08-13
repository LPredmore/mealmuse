import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : undefined))
    .refine((v) => v === undefined || (!Number.isNaN(v) && v >= 0), {
      message: "Age must be a positive number",
    }),
  adventurousness: z.enum([
    "Picky Eater - Very Selective",
    "Conservative - Prefers familiar foods",
    "Moderate - Open to some new things",
    "Adventurous - Loves trying new foods",
    "Experimental - will try anything once",
  ]),
  dietaryRestrictions: z.string().optional(),
  allergies: z.string().optional(),
  preferences: z.string().optional(),
});

export type AddMemberForm = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string | null;
  onAdded?: () => void;
}

export const AddFamilyMemberDialog = ({ open, onOpenChange, userId, onAdded }: Props) => {
  const form = useForm<AddMemberForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      age: undefined,
      adventurousness: "Moderate - Open to some new things",
      dietaryRestrictions: "",
      allergies: "",
      preferences: "",
    },
  });

  const onSubmit = async (values: AddMemberForm) => {
    if (!userId) {
      toast.error("You need to sign in to add family members.");
      return;
    }

    const dietary_restrictions = (values.dietaryRestrictions || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const allergies = (values.allergies || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const { error } = await supabase.from("family_members").insert({
      user_id: userId,
      name: values.name,
      age: typeof values.age === "number" ? values.age : undefined,
      adventurousness: values.adventurousness,
      dietary_restrictions,
      allergies,
      preferences: values.preferences || null,
    });

    if (error) {
      console.error(error);
      toast.error("Failed to add member");
      return;
    }

    toast.success("Family member added");
    form.reset();
    onAdded?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Family Member</DialogTitle>
          <DialogDescription>Enter details to personalize meal plans.</DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="e.g. Sarah" {...form.register("name")} />
              {form.formState.errors.name && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" min={0} placeholder="e.g. 12" {...form.register("age")} />
              {form.formState.errors.age && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.age.message as string}</p>
              )}
            </div>
          </div>

          <div>
            <Label>Adventurousness with Food</Label>
            <Select
              defaultValue={form.getValues("adventurousness")}
              onValueChange={(v) => form.setValue("adventurousness", v as AddMemberForm["adventurousness"])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent className="z-50 bg-white">
                <SelectItem value="Picky Eater - Very Selective">Picky Eater - Very Selective</SelectItem>
                <SelectItem value="Conservative - Prefers familiar foods">Conservative - Prefers familiar foods</SelectItem>
                <SelectItem value="Moderate - Open to some new things">Moderate - Open to some new things</SelectItem>
                <SelectItem value="Adventurous - Loves trying new foods">Adventurous - Loves trying new foods</SelectItem>
                <SelectItem value="Experimental - will try anything once">Experimental - will try anything once</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
            <Input
              id="dietaryRestrictions"
              placeholder="Comma-separated, e.g. Gluten-Free, Vegetarian"
              {...form.register("dietaryRestrictions")}
            />
          </div>

          <div>
            <Label htmlFor="allergies">Allergies</Label>
            <Input
              id="allergies"
              placeholder="Comma-separated, e.g. Peanuts, Shellfish"
              {...form.register("allergies")}
            />
          </div>

          <div>
            <Label htmlFor="preferences">Other Preferences</Label>
            <Textarea id="preferences" placeholder="Favorite cuisines, dislikes, etc." {...form.register("preferences")} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-orange-500 hover:bg-orange-600">Save Member</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
