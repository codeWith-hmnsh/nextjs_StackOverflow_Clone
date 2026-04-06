"use client";
import React, { useState, useEffect } from "react";
import { ID, databases, account } from "../../../lib/appwrite/config";
// FIXED: lowercase 'u' in useRouter
import { useRouter } from "next/navigation";

export default function AskQuestionPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // Correct usage

  useEffect(() => {
    account.get()
      .then(setUser)
      .catch(() => router.push("/login"));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);
    try {
      const tagsArray = tags.split(",").map(t => t.trim()).filter(Boolean);
      const res = await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_QUESTIONS_COLLECTION_ID!,
        ID.unique(),
        { title, content, authorId: user.$id, tags: tagsArray }
      );
      router.push(`/questions/${res.$id}`);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-6 mt-10 text-black">
      <h1 className="text-3xl font-bold mb-8">Ask a public question</h1>
      <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 space-y-6">
        <input className="w-full border p-2 bg-white" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <textarea className="w-full border p-2 h-48 bg-white" placeholder="Content" value={content} onChange={e => setContent(e.target.value)} required />
        <input className="w-full border p-2 bg-white" placeholder="Tags (comma separated)" value={tags} onChange={e => setTags(e.target.value)} />
        <button type="submit" disabled={isLoading || !user} className="bg-blue-600 text-white px-4 py-2 rounded">
          {isLoading ? "Posting..." : "Post Question"}
        </button>
      </form>
    </main>
  );
}