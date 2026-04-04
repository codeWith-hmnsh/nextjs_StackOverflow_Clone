import { databases } from "./config";
import { db } from "../name";
// Notice: No curly braces because they are 'export default'
import createQuestionCollection from "./question.collection";
import createAnswerCollection from "./answer.collection";
import createCommentCollection from "./comment.collection";
import createVoteCollection from "./vote.collection";

export default async function getOrCreateDB() {
    try {
        // 1. Check if DB exists
        await databases.get(db);
        console.log("Database connection verified");
    } catch (error: any) {
        // 2. Create DB if it's missing (Error 404)
        if (error.code === 404) {
            try {
                await databases.create(db, db);
                console.log("Database created successfully");
            } catch (createErr) {
                console.error("Failed to create database:", createErr);
            }
        } else {
            console.error("Error connecting to database:", error);
        }
    }

    // 3. Initialize all collections concurrently
    try {
        await Promise.all([
            createQuestionCollection(),
            createAnswerCollection(),
            createCommentCollection(),
            createVoteCollection(),
        ]);
        console.log("All collections are ready.");
    } catch (error) {
        console.error("Error initializing collections:", error);
    }
}