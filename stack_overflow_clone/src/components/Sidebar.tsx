"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Tag, 
  Users, 
  UserCircle, 
  TrendingUp, 
  Info 
} from "lucide-react";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Questions", href: "/", icon: TrendingUp }, // Currently home shows all questions
];

const secondaryItems = [
  { name: "Profile", href: "/profile", icon: UserCircle },
  { name: "About", href: "/about", icon: Info },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-white/50 backdrop-blur-sm hidden md:flex flex-col h-[calc(100vh-4rem)] sticky top-16 transition-all duration-300">
      <div className="p-4 flex-1 overflow-y-auto">
        <nav className="space-y-1">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Menu
          </p>
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                pathname === item.href
                  ? "bg-blue-50 text-blue-700 shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <item.icon className="w-4 h-4 transition-transform group-hover:scale-110" />
              {item.name}
            </Link>
          ))}
        </nav>

        <nav className="mt-8 space-y-1">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Personal
          </p>
          {secondaryItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                pathname === item.href
                  ? "bg-blue-50 text-blue-700 shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <item.icon className="w-4 h-4 transition-transform group-hover:scale-110" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-6 border-t bg-gray-50/30">
          <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            System Online
          </div>
      </div>
    </aside>
  );
}
