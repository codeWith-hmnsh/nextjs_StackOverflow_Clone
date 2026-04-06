"use server";

import { databases } from "@/lib/appwrite/config";
import { ID, Permission, Role } from "appwrite";

export async function createQuestionAction(formData: {
  title: string;
  content: string;
  authorId: string;
  tags: string;
}) {
  try {
    const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
    const colId =
      process.env.NEXT_PUBLIC_APPWRITE_QUESTIONS_COLLECTION_ID!;

    // ✅ Convert tags string → array
    const tagsArray = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    console.log("Creating question with:", {
      ...formData,
      tagsArray,
    });

    const response = await databases.createDocument(
      dbId,
      colId,
      ID.unique(),
      {
        title: formData.title,
        content: formData.content,
        authorId: formData.authorId,
        tags: tagsArray,
      },
      [
        // ✅ Permissions fix
        Permission.read(Role.any()),
        Permission.write(Role.user(formData.authorId)),
      ]
    );

    console.log("Created successfully:", response.$id);

    return { success: true, id: response.$id };
  } catch (error: any) {
    console.error("Server Action Error:", error);

    return {
      success: false,
      error: error.message || "Something went wrong",
    };
  }
}