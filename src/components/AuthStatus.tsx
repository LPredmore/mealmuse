import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const AuthStatus = () => {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setEmail(session?.user?.email ?? null);
    });

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setEmail(data.session?.user?.email ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Signed out");
    }
  };

  if (!email) {
    return (
      <Link to="/auth">
        <Button variant="outline">Sign in</Button>
      </Link>
    );
  }

  const initials = email[0]?.toUpperCase() ?? "U";

  return (
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 rounded-full bg-primary/15 text-primary grid place-items-center text-xs font-semibold">
        {initials}
      </div>
      <span className="hidden sm:block text-sm text-foreground/80">{email}</span>
      <Button size="sm" variant="ghost" onClick={handleSignOut}>Sign out</Button>
    </div>
  );
};
