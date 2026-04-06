"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { account } from "../lib/appwrite/config";
import { useRouter } from "next/navigation";
import { Search, Bell, Menu, User, LogOut } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    account.get()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 h-16 flex items-center">
      <div className="max-w-7xl mx-auto px-4 w-full flex justify-between items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Menu className="md:hidden w-6 h-6 text-gray-600" />
          <Link href="/" className="font-black text-2xl flex items-center">
            <span className="text-orange-500">stack</span>
            <span className="text-gray-900 ml-1">overflow</span>
            <span className="text-orange-500 font-light ml-0.5">_clone</span>
          </Link>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:block">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 p-2 pl-10 rounded-xl text-sm transition-all outline-none text-black"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* Auth / Profile */}
        <div className="flex items-center gap-2 md:gap-4">
          {user ? (
            <>
              <div className="flex items-center gap-3">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm font-bold text-gray-900">{user.name || "Community Member"}</span>
                </div>
                <div className="group relative">
                  <button className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-blue-100 transition-transform active:scale-95">
                    <User className="w-5 h-5" />
                  </button>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link 
                href="/login" 
                className="px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Log In
              </Link>
              <Link 
                href="/register" 
                className="px-4 py-2 text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}