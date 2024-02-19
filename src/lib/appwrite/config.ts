import { Client,Account,Databases,Storage,Avatars } from "appwrite"


export const appwriteConfig= {
    projectID: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    //env problem ko solve krne ke liye humne vite-env.d.ts file bnai thi 
    url:import.meta.env.VITE_APPWRITE_URL,
    databaseID:import.meta.env.VITE_APPWRITE_DATABSE_ID,
    storageID:import.meta.env.VITE_APPWRITE_STORAGE_ID,
    userCollectionID:import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID,
    postCollectionID:import.meta.env.VITE_APPWRITE_POST_COLLECTION_ID,
    saveCollectionID:import.meta.env.VITE_APPWRITE_SAVES_COLLECTION_ID

}
export const client = new Client();
client.setEndpoint(appwriteConfig.url)
client.setProject(appwriteConfig.projectID)
export const account = new Account(client);
export const databases = new Databases(client)
export const storage = new Storage(client)
export const avatars = new Avatars(client)
