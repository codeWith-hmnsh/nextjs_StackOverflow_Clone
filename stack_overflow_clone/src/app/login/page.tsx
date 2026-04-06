"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { account } from "../../lib/appwrite/config";
import Link from "next/link";
import { LogIn, Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    account.get().then(() => router.push("/")).catch(() => {});
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await account.createEmailPasswordSession(email, password);
      // Redirect using window.location for full state refresh
      const searchParams = new URLSearchParams(window.location.search);
      window.location.href = searchParams.get("redirect") || "/";
    } catch (error: any) {
      alert(error.message || "Failed to log in.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-orange-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>

      <div className="w-full max-w-lg bg-white/70 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] p-10 md:p-14 shadow-2xl relative overflow-hidden">
        <div className="space-y-2 mb-10 text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-200">
                <LogIn className="w-8 h-8 text-white" />
            </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Welcome Back</h1>
          <p className="text-gray-500 font-medium italic">Ready to share your knowledge?</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Work Email</label>
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

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold text-gray-700">Password</label>
                <Link href="#" className="text-xs font-bold text-blue-600 hover:text-blue-700">Forgot?</Link>
            </div>
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
            className="w-full bg-blue-600 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-blue-700 disabled:bg-gray-200 transition-all shadow-xl shadow-blue-200 hover:-translate-y-1 active:translate-y-0"
          >
            {isLoading ? "Authenticating..." : (
                <>
                Sign In <ArrowRight className="w-5 h-5" />
                </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500 font-medium">
                New to the community?{" "}
                <Link href="/register" className="text-blue-600 font-bold hover:underline decoration-2 underline-offset-4">
                    Create account
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
}