"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { databases, account, ID } from "../lib/appwrite/config";

export default function AnswerForm({ questionId }: { questionId: string }) {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await account.get();
      await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_ANSWERS_COLLECTION_ID!,
        ID.unique(),
        { content, questionid: questionId, authorId: user.$id }
      );
      setContent("");
      router.refresh();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-4">
      <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full p-4 border rounded text-black" placeholder="Your Answer" required />
      <button type="submit" disabled={isLoading} className="bg-blue-600 text-white px-6 py-2 rounded">
        {isLoading ? "Posting..." : "Post Answer"}
      </button>
    </form>
  );
}