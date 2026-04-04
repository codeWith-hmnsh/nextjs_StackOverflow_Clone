import { IndexType, Permission, Role } from "node-appwrite";
import { db, answerCollection } from "../name";
import { databases } from "./config";

export default async function createAnswerCollection() {
    try {
        await databases.createCollection(db, answerCollection, answerCollection, [
            Permission.read(Role.any()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ]);
        console.log("Answer collection created");

        // creating attributes
        await Promise.all([
            databases.createStringAttribute(db, answerCollection, "content", 10000, true),
            databases.createStringAttribute(db, answerCollection, "authorId", 50, true),
            databases.createStringAttribute(db, answerCollection, "questionId", 50, true),
        ]);
        console.log("Answer attributes created");

        // creating indexes
        await databases.createIndex(
            db,
            answerCollection,
            "questionId_idx",
            IndexType.Key,
            ["questionId"]
        );
        console.log("Answer indexes created");
    } catch (error: any) {
        if (error.code === 409) {
            console.log("Answer collection already exists");
        } else {
            console.error("Error creating answer collection:", error);
        }
    }
}
