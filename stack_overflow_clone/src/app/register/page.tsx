"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { account, ID } from "../../lib/appwrite/config";
import Link from "next/link";
import { UserPlus, Mail, Lock, User, ArrowRight, Sparkles } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    account.get().then(() => router.push("/")).catch(() => {});
  }, [router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await account.create(ID.unique(), email, password, name);
      await account.createEmailPasswordSession(email, password);
      // Redirect using window.location for full state refresh
      window.location.href = "/";
    } catch (error: any) {
      alert(error.message || "Failed to register.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-orange-500/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>

      <div className="w-full max-w-xl bg-white/70 backdrop-blur-3xl border border-white/50 rounded-[3rem] p-10 md:p-14 shadow-2xl relative overflow-hidden">
        {/* Top Glow */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
        
        <div className="space-y-3 mb-10 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-200 rotate-6 translate-y-1 scale-105">
                <UserPlus className="w-8 h-8 text-white" />
            </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center justify-center gap-3">
            Join the Community
            <Sparkles className="w-6 h-6 text-orange-400" />
          </h1>
          <p className="text-gray-500 font-medium italic">Start your journey into the world of shared knowledge.</p>
        </div>

        <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50/50 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 p-4 pl-12 rounded-2xl text-base transition-all outline-none text-black font-medium"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50/50 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 p-4 pl-12 rounded-2xl text-base transition-all outline-none text-black font-medium"
                placeholder="name@email.com"
              />
            </div>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50/50 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 p-4 pl-12 rounded-2xl text-base transition-all outline-none text-black font-medium"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="md:col-span-2 bg-blue-600 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-blue-700 disabled:bg-gray-200 transition-all shadow-xl shadow-blue-200 hover:-translate-y-1 active:translate-y-0"
          >
            {isLoading ? "Preparing your profile..." : (
                <>
                Create Account <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500 font-medium">
                Already part of the community?{" "}
                <Link href="/login" className="text-blue-600 font-bold hover:underline decoration-2 underline-offset-4">
                    Sign in
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
}