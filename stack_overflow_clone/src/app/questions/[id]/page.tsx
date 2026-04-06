import { databases } from "../../../lib/appwrite/config"; 
import { Query } from "appwrite";
import React from "react";
import AnswerForm from "../../../components/AnswersForm";
import AnswersList from "../../../components/AnswersList";
import LikeButton from "../../../components/LikeButton";
import { Clock, User as UserIcon, Tag as TagIcon, MessageSquare } from "lucide-react";

async function getQuestionData(questionId: string) {
    if (!questionId) return null;
    try {
        const response = await databases.getDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            process.env.NEXT_PUBLIC_APPWRITE_QUESTIONS_COLLECTION_ID!,
            questionId 
        );
        return { ...response }; // Ensure it's a plain object
    } catch (error) {
        return null;
    }
}

async function getAnswersData(questionId: string) {
    if (!questionId) return [];
    try {
        const response = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            process.env.NEXT_PUBLIC_APPWRITE_ANSWERS_COLLECTION_ID!,
            [Query.equal("questionid", questionId), Query.orderDesc("$createdAt")]
        );
        return response.documents.map(doc => ({ ...doc })); // Plain-ify all documents
    } catch (error) {
        console.error("Fetch answers error:", error);
        return [];
    }
}

export default async function QuestionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const question = await getQuestionData(id);
    const answers: any = await getAnswersData(id);

    if (!question) return (
        <div className="p-20 text-center min-h-[60vh]">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Question not found</h2>
            <p className="text-gray-500">The question you are looking for does not exist or has been removed.</p>
        </div>
    );

    return (
        <main className="max-w-4xl mx-auto space-y-10 pb-20 pt-10">
            {/* Question Header */}
            <div className="space-y-4">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                    {question.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 border-b pb-6">
                    <div className="flex items-center gap-2 bg-gray-100/50 px-3 py-1 rounded-full border">
                        <Clock className="w-4 h-4" />
                        <span>Asked {new Date(question.$createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-100/50 px-3 py-1 rounded-full border">
                        <MessageSquare className="w-4 h-4" />
                        <span>{answers.length} Answers</span>
                    </div>
                </div>
            </div>

            <div className="flex gap-8">
                {/* Like Button */}
                <div className="flex flex-col items-center">
                    <LikeButton 
                        documentId={question.$id}
                        collectionId={process.env.NEXT_PUBLIC_APPWRITE_QUESTIONS_COLLECTION_ID!}
                        initialLikes={question.likes || []}
                        userId={null} // Will be fetched client-side in the button or smarter way
                        size="lg"
                    />
                </div>

                {/* Content Section */}
                <div className="flex-1 space-y-8">
                    <div className="prose prose-slate max-w-none">
                        <div className="bg-white border ring-1 ring-gray-100 p-8 rounded-2xl shadow-sm text-gray-800 leading-relaxed text-lg whitespace-pre-wrap">
                            {question.content}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {question.tags?.map((tag: string, index: number) => (
                            <span 
                                key={`${tag}-${index}`} 
                                className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-xl border border-blue-100 text-sm font-bold flex items-center gap-2 hover:bg-blue-100 transition-colors cursor-default"
                            >
                                <TagIcon className="w-3.5 h-3.5" />
                                {tag.trim()}
                            </span>
                        ))}
                    </div>

                    <div className="flex justify-end border-t pt-6">
                        <div className="flex items-center gap-4 text-gray-500 text-sm">
                            <span className="font-medium italic">Posted by Community Member</span>
                            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 font-black shadow-sm">
                                {question.authorId ? question.authorId.slice(0, 1).toUpperCase() : "U"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Answers Section */}
            <AnswersList answers={answers} />

            {/* Post Answer Section */}
            <div className="bg-white border border-blue-100 rounded-3xl p-8 mt-12 shadow-xl shadow-blue-50">
                <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                    <MessageSquare className="w-6 h-6 text-blue-600" />
                    Join the Discussion
                </h3>
                <AnswerForm questionId={id} />
            </div>
        </main>
    );
}