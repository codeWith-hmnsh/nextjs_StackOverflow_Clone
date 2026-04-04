import { IndexType, Permission } from "node-appwrite";
import { db, commentCollection } from "../name";
import { databases } from "./config";

export default async function createCommentCollection() {
    try {
        await databases.createCollection(db, commentCollection, commentCollection, [
            Permission.read("any"),
            Permission.create("users"),
            Permission.update("users"),
            Permission.delete("users"),
        ]);
        console.log("Comment collection created");

        // creating attributes
        await Promise.all([
            databases.createStringAttribute(db, commentCollection, "content", 10000, true),
            databases.createStringAttribute(db, commentCollection, "authorId", 50, true),
            databases.createStringAttribute(db, commentCollection, "type", 20, true), // "question" or "answer"
            databases.createStringAttribute(db, commentCollection, "typeId", 50, true), // questionId or answerId
        ]);
        console.log("Comment attributes created");

        // creating indexes
        await databases.createIndex(
            db,
            commentCollection,
            "typeId_idx",
            IndexType.Key,
            ["typeId"]
        );
        console.log("Comment indexes created");
    } catch (error: any) {
        if (error.code === 409) {
            console.log("Comment collection already exists");
        } else {
            console.error("Error creating comment collection:", error);
        }
    }
}
