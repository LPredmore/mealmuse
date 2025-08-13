
import { Button } from "@/components/ui/button";
import { User, Calendar, List, Edit } from "lucide-react";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: List },
    { id: "family", label: "Family", icon: User },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "recipes", label: "Recipes", icon: Edit },
    { id: "shopping", label: "Shopping", icon: List }
  ];

  return (
    <nav className="bg-card/60 backdrop-blur-md border-b border-border/40 sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant={activeTab === id ? "default" : "ghost"}
                size="sm"
                onClick={() => onTabChange(id)}
                className={
                  activeTab === id
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/80 hover:text-primary hover:bg-primary/10"
                }
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
