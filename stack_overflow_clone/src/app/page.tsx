import Link from "next/link";
import { databases } from "../lib/appwrite/config";
import { Query } from "appwrite";
import { 
  Plus, 
  Search, 
  Clock, 
  MessageSquare, 
  TrendingUp, 
  Hash, 
  ChevronRight,
  Filter
} from "lucide-react";

async function getQuestions(searchQuery?: string) {
  try {
    const queries = [Query.orderDesc("$createdAt")];
    
    if (searchQuery) {
      queries.push(Query.search("title", searchQuery));
    }

    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_QUESTIONS_COLLECTION_ID!,
      queries
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
}

export default async function HomePage({
    searchParams
}: {
    searchParams: Promise<{ search?: string }>
}) {
  const { search } = await searchParams;
  const questions = await getQuestions(search);

  return (
    <div className="space-y-10 pb-20">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-tight">
                {search ? `Searching for "${search}"` : "Discover Community Questions"}
            </h1>
            <p className="text-gray-500 font-medium text-lg italic">The knowledge you need, shared by experts.</p>
        </div>
        <Link 
          href="/questions/ask" 
          className="bg-blue-600 text-white px-8 py-4 rounded-3xl font-black flex items-center gap-3 hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 hover:-translate-y-1 active:translate-y-0"
        >
          <Plus className="w-6 h-6 stroke-[3]" />
          Ask Question
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-4 border-b overflow-x-auto pb-4 scrollbar-hide">
        <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-100">
            All Questions
        </button>
        <button className="flex items-center gap-2 px-6 py-2 hover:bg-gray-100 text-gray-600 rounded-2xl font-bold text-sm transition-colors whitespace-nowrap">
            <TrendingUp className="w-4 h-4" /> Trending
        </button>
        <button className="flex items-center gap-2 px-6 py-2 hover:bg-gray-100 text-gray-600 rounded-2xl font-bold text-sm transition-colors whitespace-nowrap">
            <Filter className="w-4 h-4" /> Unanswered
        </button>
        <div className="h-4 w-px bg-gray-200 mx-2 hidden md:block"></div>
        <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
            <span>SHOWING: {questions.length} RESULTS</span>
        </div>
      </div>

      {/* Questions Feed */}
      <div className="flex flex-col gap-6">
        {questions.length === 0 ? (
          <div className="bg-white border-2 border-dashed rounded-[2.5rem] p-24 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-400">
                <Search className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-500 max-w-xs mx-auto">Try adjusting your search or be the first to ask a question!</p>
          </div>
        ) : (
          questions.map((question: any) => (
            <Link 
              key={question.$id} 
              href={`/questions/${question.$id}`}
              className="group bg-white border border-transparent hover:border-blue-100 hover:ring-8 ring-blue-50/50 p-8 rounded-[2rem] transition-all hover:-translate-y-1 block relative overflow-hidden"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-8">
                {/* Stats */}
                <div className="flex md:flex-col gap-4 md:gap-2">
                    <div className="flex flex-col items-center bg-gray-50 border rounded-2xl px-4 py-2 min-w-[70px] group-hover:bg-red-50/50 transition-colors">
                        <span className="text-lg font-black text-gray-900 group-hover:text-red-600 transition-colors">
                          {Array.isArray(question.likes) ? question.likes.length : 0}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-tighter">Likes</span>
                    </div>
                    <div className="flex flex-col items-center border border-blue-100 bg-blue-50/20 rounded-2xl px-4 py-2 min-w-[70px]">
                        <span className="text-lg font-black text-blue-700">0</span>
                        <span className="text-[10px] uppercase font-bold text-blue-400 tracking-tighter">Answers</span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors tracking-tight leading-tight">
                        {question.title}
                    </h2>
                    <p className="text-gray-500 line-clamp-2 text-base font-medium leading-relaxed">
                        {question.content}
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-between items-center gap-4">
                    <div className="flex flex-wrap gap-2">
                      {(typeof question.tags === "string" ? question.tags.split(",") : Array.isArray(question.tags) ? question.tags : []).map((tag: string, index: number) => (
                        tag.trim() && (
                          <span 
                            key={`${tag}-${index}`} 
                            className="bg-blue-50/50 text-blue-700 px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border border-blue-100/50"
                          >
                            <Hash className="w-3 h-3 stroke-[3]" />
                            {tag.trim()}
                          </span>
                        )
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs font-bold">
                        <div className="flex items-center gap-2 text-gray-400">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(question.$createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-gray-400">
                          by <span className="text-orange-500 font-black">Community Member</span>
                        </div>
                    </div>
                  </div>
                </div>

                <div className="hidden lg:flex items-center justify-center translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <ChevronRight className="w-6 h-6" />
                    </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}