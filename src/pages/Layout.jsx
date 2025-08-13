
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Home, 
  Users, 
  Calendar, 
  ShoppingCart, 
  BookOpen, 
  Settings,
  ChefHat
} from "lucide-react";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: Home,
  },
  {
    title: "Family",
    url: createPageUrl("Family"),
    icon: Users,
  },
  {
    title: "Meal Calendar",
    url: createPageUrl("Calendar"),
    icon: Calendar,
  },
  {
    title: "Shopping List",
    url: createPageUrl("Shopping"),
    icon: ShoppingCart,
  },
  {
    title: "Recipes",
    url: createPageUrl("Recipes"),
    icon: BookOpen,
  }
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="flex h-screen relative z-10">
        {/* Sidebar */}
        <aside className="w-72 p-6 backdrop-blur-xl bg-white/10 border-r border-white/20">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12 p-4 rounded-2xl backdrop-blur-sm bg-white/10 border border-white/20">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">MealMuse</h1>
              <p className="text-white/70 text-sm">AI Meal Planning</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-3">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${
                    isActive
                      ? 'bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg'
                      : 'hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/20'
                  }`}
                >
                  <item.icon className={`w-5 h-5 transition-colors duration-300 ${
                    isActive ? 'text-white' : 'text-white/70 group-hover:text-white'
                  }`} />
                  <span className={`font-medium transition-colors duration-300 ${
                    isActive ? 'text-white' : 'text-white/80 group-hover:text-white'
                  }`}>
                    {item.title}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="mt-auto pt-8">
            <div className="p-4 rounded-2xl backdrop-blur-sm bg-white/10 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-xl flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">U</span>
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Family Account</p>
                  <p className="text-white/60 text-xs">Meal planning made easy</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      <style>{`
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}
