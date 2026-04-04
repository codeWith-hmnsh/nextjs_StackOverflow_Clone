import { DatabasesIndexType, Permission, Role } from "node-appwrite";
import { db, questionCollection } from "../name";
import { databases } from "./config";

export default async function createQuestionCollection() {
    try {
        // Create the Collection
        await databases.createCollection(db, questionCollection, questionCollection, [
            Permission.read(Role.any()),
            Permission.read(Role.users()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ]);
        console.log("Question Collection Created");

        // Create Attributes
        // Note: In some versions of node-appwrite, these need to be awaited individually 
        // to avoid "Collection not ready" errors.
        await databases.createStringAttribute(db, questionCollection, "title", 100, true);
        await databases.createStringAttribute(db, questionCollection, "content", 10000, true);
        await databases.createStringAttribute(db, questionCollection, "authorId", 50, true);
        await databases.createStringAttribute(db, questionCollection, "tags", 50, true, undefined, true);
        await databases.createStringAttribute(db, questionCollection, "attachmentId", 50, false);
        
        console.log("Question Attributes Created");

        // Indexes usually need the attributes to be "available" first.
        // If the red lines persist, it might be a VS Code sync issue.
        await databases.createIndex(db, questionCollection, "title_index", "fulltext", ["title"]);
        await databases.createIndex(db, questionCollection, "content_index", "fulltext", ["content"]);

    } catch (error: any) {
        if (error.code === 409) {
            console.log("Question collection already exists.");
        } else {
            console.error("Error in Question Collection:", error);
        }
    }
}