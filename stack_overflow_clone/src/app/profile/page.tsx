"use client";

import React, { useEffect, useState } from "react";
import { account, databases } from "../../lib/appwrite/config";
import { Query } from "appwrite";
import { 
  User, 
  MessageSquare, 
  HelpCircle,
  Star,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    questionsCount: 0,
    answersCount: 0,
    rating: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);

        const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
        const qColId = process.env.NEXT_PUBLIC_APPWRITE_QUESTIONS_COLLECTION_ID!;
        const aColId = process.env.NEXT_PUBLIC_APPWRITE_ANSWERS_COLLECTION_ID!;

        // 1. Fetch Questions Count
        const questionsRes = await databases.listDocuments(dbId, qColId, [
          Query.equal("authorId", currentUser.$id),
          Query.limit(1)
        ]);
        
        // 2. Fetch All Answers to calculate likes
        const answersRes = await databases.listDocuments(dbId, aColId, [
          Query.equal("authorId", currentUser.$id)
        ]);

        const totalLikes = answersRes.documents.reduce((acc, doc) => {
          return acc + (doc.likes?.length || 0);
        }, 0);

        // Rating calculation: 1 like = 1 point, max 10
        const rating = Math.min(10, totalLikes);

        setStats({
          questionsCount: questionsRes.total,
          answersCount: answersRes.total,
          rating: rating
        });
      } catch (error) {
        console.error("Not logged in or fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto mt-20 text-center space-y-6">
        <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
            <User className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-3xl font-black text-gray-900">Please Log In</h1>
        <p className="text-gray-500">Log in to view your community statistics.</p>
        <Link 
            href="/login" 
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200"
        >
            Go to Login <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pt-10 pb-20 px-4">
      <div className="flex flex-col items-center text-center mb-16 space-y-4">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-blue-200 rotate-3">
            {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">{user.name}</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Community Profile</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Questions Card */}
        <div className="bg-white border-2 border-gray-50 rounded-[2.5rem] p-10 flex flex-col items-center text-center space-y-4 hover:border-blue-100 transition-all shadow-sm hover:shadow-xl hover:shadow-blue-50/50 group">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
            <HelpCircle className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <p className="text-4xl font-black text-gray-900">{stats.questionsCount}</p>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Questions Asked</p>
          </div>
        </div>

        {/* Answers Card */}
        <div className="bg-white border-2 border-gray-50 rounded-[2.5rem] p-10 flex flex-col items-center text-center space-y-4 hover:border-purple-100 transition-all shadow-sm hover:shadow-xl hover:shadow-purple-50/50 group">
          <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
            <MessageSquare className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <p className="text-4xl font-black text-gray-900">{stats.answersCount}</p>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Answers Shared</p>
          </div>
        </div>

        {/* Rating Card */}
        <div className="bg-white border-2 border-gray-50 rounded-[2.5rem] p-10 flex flex-col items-center text-center space-y-4 hover:border-orange-100 transition-all shadow-sm hover:shadow-xl hover:shadow-orange-50/50 group">
          <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
            <Star className="w-7 h-7 fill-current" />
          </div>
          <div className="space-y-1">
            <p className="text-4xl font-black text-gray-900">{stats.rating.toFixed(1)}<span className="text-xl text-gray-300">/10</span></p>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Community Rating</p>
          </div>
        </div>
      </div>

      <div className="mt-16 pt-10 border-t flex justify-center">
        <Link href="/" className="text-gray-400 hover:text-blue-600 font-bold text-sm transition-colors flex items-center gap-2 group">
          Back to feed <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
