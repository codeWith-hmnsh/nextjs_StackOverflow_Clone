"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Share2, Video, Home, LogIn } from "lucide-react";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";

const menuItems = [
  { name: "Home Page", icon: Home, href: "/" },
  { name: "Social Share", icon: Share2, href: "/social-share" },
  { name: "Video Upload", icon: Video, href: "/video-upload" },
];

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <div className="drawer lg:drawer-open z-50">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col min-h-screen bg-base-100">
        {/* Page content here */}
        <label htmlFor="my-drawer" className="btn btn-primary drawer-button lg:hidden fixed top-4 left-4 z-50 shadow-xl">
          Menu
        </label>
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
          {children}
        </main>
      </div>
      <div className="drawer-side border-r border-base-300">
        <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 space-y-2 flex flex-col">
          {/* Sidebar content here */}
          <div className="flex items-center gap-2 px-4 mb-8">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-primary-content shadow-lg shadow-primary/30">
              <LayoutDashboard size={20} />
            </div>
            <span className="text-xl font-black tracking-tight">Cloudinary SaaS</span>
          </div>
          
          <div className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all font-semibold ${
                      isActive 
                        ? "bg-primary text-primary-content shadow-md shadow-primary/20" 
                        : "hover:bg-base-300 text-base-content/70 hover:text-base-content"
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </div>

          {isLoaded && (
            <div className="mt-auto pt-8 border-t border-base-300 mb-4">
              {isSignedIn ? (
                <div className="flex items-center gap-4 p-4 bg-base-300/50 rounded-2xl border border-base-300">
                  <UserButton appearance={{ elements: { userButtonAvatarBox: "w-10 h-10" } }} />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">My Account</span>
                    <span className="text-xs text-base-content/60">Manage settings</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="bg-primary/10 p-4 rounded-2xl flex flex-col gap-2 border border-primary/20">
                    <span className="font-bold text-sm text-primary">Ready to upload?</span>
                    <span className="text-xs text-base-content/60 mb-2">Sign in to access media uploads and AI transforms.</span>
                    <SignInButton mode="modal">
                      <button className="btn btn-primary shadow-lg shadow-primary/30 rounded-xl gap-2 w-full">
                        <LogIn size={18} />
                        Sign In to Account
                      </button>
                    </SignInButton>
                  </div>
                </div>
              )}
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}
