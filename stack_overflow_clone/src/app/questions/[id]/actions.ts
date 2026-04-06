"use server";

// FIX: Changed @/lib/appwrite/config to relative path
import { databases, ID } from "../../../lib/appwrite/config";

export async function createAnswerAction(formData: {
  content: string;
  questionid: string;
  authorId: string;
}) {
  try {
    const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
    const colId = process.env.NEXT_PUBLIC_APPWRITE_ANSWERS_COLLECTION_ID;

    if (!dbId || !colId) {
      throw new Error("Server: Appwrite Configuration is missing.");
    }

    const response = await databases.createDocument(
      dbId,
      colId,
      ID.unique(),
      {
        content: formData.content,
        questionid: formData.questionid,
        authorId: formData.authorId,
      }
    );

    return { success: true, id: response.$id };
  } catch (error: any) {
    console.error("Server Action Error (Answer):", error);
    return { success: false, error: error.message };
  }
}