"use server";

import { databases } from "./config";
import { revalidatePath } from "next/cache";

export async function toggleLikeAction({
  documentId,
  collectionId,
  userId,
}: {
  documentId: string;
  collectionId: string;
  userId: string;
}) {
  if (!userId) {
    throw new Error("You must be logged in to like.");
  }

  try {
    const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
    
    // 1. Get the current document
    const doc = await databases.getDocument(dbId, collectionId, documentId);
    
    // 2. Initialize likes array if it doesn't exist (though it should be in schema)
    let likes: string[] = doc.likes || [];
    
    // 3. Toggle the userId
    if (likes.includes(userId)) {
      likes = likes.filter((id) => id !== userId);
    } else {
      likes.push(userId);
    }
    
    // 4. Update the document
    await databases.updateDocument(dbId, collectionId, documentId, {
      likes: likes,
    });
    
    // 5. Revalidate the page to show updated count
    revalidatePath(`/questions/${documentId}`); // Revalidate question detail
    revalidatePath("/"); // Revalidate home feed
    
    return { success: true, count: likes.length, isLiked: likes.includes(userId) };
  } catch (error: any) {
    console.error("Toggle Like Error:", error);
    return { success: false, error: error.message };
  }
}
