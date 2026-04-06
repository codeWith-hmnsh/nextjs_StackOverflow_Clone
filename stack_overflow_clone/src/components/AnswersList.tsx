"use client";

import React from "react";
import LikeButton from "./LikeButton";
import { Clock } from "lucide-react";

interface Answer {
  $id: string;
  content: string;
  authorId: string;
  $createdAt: string;
  likes?: string[];
}

export default function AnswersList({ answers }: { answers: Answer[] }) {
  if (answers.length === 0) {
    return (
      <div className="mt-10 py-12 border-t border-dashed text-center">
        <p className="text-gray-500 italic">No answers yet. Be the first to help!</p>
      </div>
    );
  }

  return (
    <div className="mt-10 space-y-8">
      <div className="flex items-center justify-between border-b pb-4">
        <h3 className="text-xl font-bold text-gray-900">
          {answers.length} {answers.length === 1 ? "Answer" : "Answers"}
        </h3>
      </div>

      <div className="divide-y">
        {answers.map((answer) => (
          <div key={answer.$id} className="py-8 first:pt-0">
            <div className="flex gap-6">
              {/* Like Button */}
              <div className="flex flex-col items-center">
                <LikeButton 
                  documentId={answer.$id}
                  collectionId={process.env.NEXT_PUBLIC_APPWRITE_ANSWERS_COLLECTION_ID!}
                  initialLikes={answer.likes || []}
                  userId={null}
                  size="sm"
                />
              </div>

              {/* Answer Content */}
              <div className="flex-1 space-y-4">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {answer.content}
                </p>

                <div className="flex justify-end pt-4">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight italic leading-none">Response by</span>
                      <span className="text-xs font-black text-blue-700">Community Member</span>
                      <div className="flex items-center gap-1 text-[9px] text-gray-400 font-medium">
                        <Clock className="w-2.5 h-2.5" />
                        {new Date(answer.$createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="w-9 h-9 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-center text-blue-600 font-black shadow-sm">
                      {answer.authorId.slice(0, 1).toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
