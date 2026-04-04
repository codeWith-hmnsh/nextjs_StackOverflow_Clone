import { IndexType, Permission } from "node-appwrite";
import { db, voteCollection } from "../name";
import { databases } from "./config";

export default async function createVoteCollection() {
    try {
        await databases.createCollection(db, voteCollection, voteCollection, [
            Permission.read("any"),
            Permission.create("users"),
            Permission.update("users"),
            Permission.delete("users"),
        ]);
        console.log("Vote collection created");

        // creating attributes
        await Promise.all([
            databases.createStringAttribute(db, voteCollection, "type", 20, true), // "question" or "answer"
            databases.createStringAttribute(db, voteCollection, "typeId", 50, true), // questionId or answerId
            databases.createStringAttribute(db, voteCollection, "votedById", 50, true),
            databases.createStringAttribute(db, voteCollection, "voteStatus", 20, true), // "upvote" or "downvote"
        ]);
        console.log("Vote attributes created");

        // creating indexes
        await databases.createIndex(
            db,
            voteCollection,
            "typeId_idx",
            IndexType.Key,
            ["typeId"]
        );
        console.log("Vote indexes created");
    } catch (error: any) {
        if (error.code === 409) {
            console.log("Vote collection already exists");
        } else {
            console.error("Error creating vote collection:", error);
        }
    }
}
