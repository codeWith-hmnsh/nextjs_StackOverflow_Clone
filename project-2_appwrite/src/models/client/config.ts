import { env } from "@/app/env";
import { Client, Account,Avatars,Databases,Storage } from "appwrite";

const client = new Client()
    .setEndpoint(env.appwrite.endpoint ) // Your API Endpoint
    .setProject(env.appwrite.projectId); // Your project ID

 const avatars = new Avatars(client);       
const databases = new Databases(client);
const account = new Account(client);
const storage = new Storage(client);

export { client, account, avatars, databases, storage };