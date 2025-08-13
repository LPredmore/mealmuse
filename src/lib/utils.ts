import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function createPageUrl(pageName: string): string {
  const pageMap: { [key: string]: string } = {
    "Dashboard": "/dashboard",
    "Family": "/family",
    "Calendar": "/calendar", 
    "Shopping": "/shopping",
    "Recipes": "/recipes"
  };
  
  return pageMap[pageName] || "/";
}