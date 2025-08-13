import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Min 6 characters"),
  confirm: z.string().optional(),
}).refine((data) => !data.confirm || data.password === data.confirm, {
  message: "Passwords do not match",
  path: ["confirm"],
});

type FormValues = z.infer<typeof schema>;

const Auth = () => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const navigate = useNavigate();
  const form = useForm<FormValues>({ resolver: zodResolver(schema) });
  const { register, handleSubmit, formState: { errors, isSubmitting } } = form;

  useEffect(() => {
    document.title = mode === "signin" ? "Sign in - MealMuse" : "Sign up - MealMuse";
  }, [mode]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) navigate("/", { replace: true });
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) navigate("/", { replace: true });
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const onSubmit = async (values: FormValues) => {
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (error) return toast.error(error.message);
      toast.success("Signed in!");
      navigate("/", { replace: true });
      return;
    }
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: { emailRedirectTo: redirectUrl },
    });
    if (error) return toast.error(error.message);
    toast.success("Check your email to confirm your account.");
  };

  return (
    <div className="min-h-screen app-gradient flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md bg-card/70 backdrop-blur-md border-border/40 rounded-2xl shadow-glow">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold heading-gradient">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </CardTitle>
          <CardDescription>
            {mode === "signin" ? "Sign in to continue to MealMuse" : "Join MealMuse to plan meals effortlessly"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm Password</Label>
                <Input id="confirm" type="password" placeholder="••••••••" {...register("confirm")} />
                {errors.confirm && <p className="text-sm text-destructive">{errors.confirm.message}</p>}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            {mode === "signin" ? (
              <>
                Don’t have an account?
                <button className="ml-1 text-primary hover:underline" onClick={() => setMode("signup")}>Sign up</button>
              </>
            ) : (
              <>
                Already have an account?
                <button className="ml-1 text-primary hover:underline" onClick={() => setMode("signin")}>Sign in</button>
              </>
            )}
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:underline">Back to home</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
