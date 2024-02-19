import { INewPost, INewUser, IUpdatePost } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { ID, Query } from "appwrite"

export async function createUserAccount(user: INewUser) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name,
        )

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(user.name);

        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: avatarUrl
        })

        return newUser;
    } catch (error) {
        console.log(error);
        return error
    }
}


export async function saveUserToDB(user: {
    accountId: string,
    email: string,
    name: string,
    imageUrl: URL,
    username?: string
}) {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseID, //passing database id 
            appwriteConfig.userCollectionID, // modification of specific collection
            ID.unique(),// generating new id
            user //passing data 
        )

        return newUser;

    } catch (error) {
        console.log(error)
    }
}

export async function signInAccount(user: { email: string; password: string }) {
    try {
        const session = await account.createEmailSession(user.email, user.password)

        return session;
    } catch (error) {
        console.log(error)
    }
}

export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();

        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseID,
            appwriteConfig.userCollectionID,
            [Query.equal('accountId', currentAccount.$id)])

        if (!currentUser) throw Error;

        return currentUser.documents[0]
    } catch (error) {
        console.log(error)
    }
}

export async function signOutAccount() {
    try {
        const session = await account.deleteSession("current");
        return session;
    } catch (error) {
        console.log(error)
    }
}

export async function createPost(post: INewPost) {
    try {
      
        const uploadedFile = await uploadFile(post.file[0]);
        if (!uploadedFile) throw Error;

        const fileUrl = await getFilePreview(uploadedFile.$id);
        if (!fileUrl) {
            await deleteFile(uploadedFile.$id);
            throw Error;

        }

        // convert tah into array
        const tags = post.tags?.replace(/ /g, "").split(",") || [];

        const newPost = await databases.createDocument(
            appwriteConfig.databaseID,
            appwriteConfig.postCollectionID,
            ID.unique(),
            {
                creator: post.userId,
                caption: post.caption,
                imageUrl: fileUrl,
                imageId: uploadedFile.$id,
                location: post.location,
                tags: tags,

            }
        );

        if (!newPost) {
            await deleteFile(uploadedFile.$id);
            throw Error;
          }
      
          return newPost;
        } catch (error) {
          console.log(error);
        }

}

export async function uploadFile(file:File)
{
    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageID,
            ID.unique(),
            file
        );


        return uploadedFile;
    } catch (error) {
        console.log(error);   
    }

}

export async function getFilePreview(fileId:string){
    try {
        
        const fileUrl = storage.getFilePreview(
            appwriteConfig.storageID,
            fileId,
            2000,
            2000,
            "top",
            100

        )

        return fileUrl;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteFile (fileId:string){
    try {
        await storage.deleteFile(appwriteConfig.storageID,fileId)

        return { status:"Done"};
    } catch (error) {
        console.log(error)
    }
}

export async function getRecentPosts(){
    const posts = await databases.listDocuments(
        appwriteConfig.databaseID,
        appwriteConfig.postCollectionID,
        [Query.orderDesc("$createdAt"),Query.limit(25)]
    )  

    if(!posts) throw Error;

    return posts;
}

export async function likePost(postId:string,likesArray:string[]){
    try {
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseID,
            appwriteConfig.postCollectionID,
            postId,
            {
                likes:likesArray
            }
        )
        if(!updatedPost) throw Error;

        return updatedPost;

    } catch (error) {
        console.log(error);     
    }
}

export async function savePost(postId:string,userId:string){
    try {
        const updatedPost = await databases.createDocument(
            appwriteConfig.databaseID,
            appwriteConfig.saveCollectionID,
            ID.unique(),
            {
                user:userId,
                post:postId
            }
        )
        if(!updatedPost) throw Error;

        return updatedPost;
        
    } catch (error) {
        console.log(error);     
    }
}

export async function deletesavedPost(savedRecordId:string){
    try {
        const statusPost = await databases.deleteDocument(
            appwriteConfig.databaseID,
            appwriteConfig.saveCollectionID,
            savedRecordId,
        )
        if(!statusPost) throw Error;

        return {status:"ok"};
        
    } catch (error) {
        console.log(error);     
    }
}

export async function getPostById(postId:string){
    try {
        const post = await databases.getDocument(
            appwriteConfig.databaseID,
            appwriteConfig.postCollectionID,
            postId
        )
        return post ;
    } catch (error) {
        console.log(error);

    }

}

export async function updatePost(post: IUpdatePost) {
    const hasfileToUpdate= post.file.length>0;
    try {
        let image = {
            imageUrl:post.imageUrl,
            imageId:post.imageId

        }

        if(hasfileToUpdate){
            const uploadedFile = await uploadFile(post.file[0]);
            if(!uploadedFile) throw Error;

            const fileUrl = await getFilePreview(uploadedFile.$id);
            if (!fileUrl) {
                await deleteFile(uploadedFile.$id);
                throw Error;
    
            }
            image = {...image,imageUrl:fileUrl,imageId:uploadedFile.$id};
        }



        // convert tah into array
        const tags = post.tags?.replace(/ /g, "").split(",") || [];

        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseID,
            appwriteConfig.postCollectionID,
            post.postId,
            {
               
                caption: post.caption,
                imageUrl: image.imageUrl,
                imageId: image.imageId,
                location: post.location,
                tags: tags,

            }
        );

        if (!updatedPost) {
           if(hasfileToUpdate){
            await deleteFile(image.imageId);
           }
            throw Error;
          }

          if(hasfileToUpdate){
            await deleteFile(post.imageId);

          }      
          return updatePost;
        } catch (error) {
          console.log(error);
        }

}

export async function deletePost(postId:string,imageId:string){

    if(!postId || !imageId)throw Error;

    try{
        await databases.deleteDocument(
            appwriteConfig.databaseID,
            appwriteConfig.postCollectionID,
            postId
        )
        return {status:"ok"};
    }catch(error){

    }
}

export async function getUserPost(userId?:string){
    if(!userId)return ;

    try {
        const post = await databases.listDocuments(
            appwriteConfig.databaseID,
            appwriteConfig.postCollectionID,
            [Query.equal("creator",userId),Query.orderDesc("$createdAt")]
        );

        if(!post) throw Error;

        return post;
        
    } catch (error) {
       console.log(error) 
    }
}


export async function getInfinitePosts({pageParam}:{pageParam:number}){
    const queries:any[]=[Query.orderDesc('$updatedAt'),Query.limit(10)]

    if(pageParam){
        queries.push(Query.cursorAfter(pageParam.toString()));

    }

    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseID,
            appwriteConfig.postCollectionID,
            queries
        )
        if(!posts) throw Error;

        return posts;

    } catch (error) {
        console.log(error);
    }
 
}


export async function searchPosts(searchTerm:string){
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseID,
            appwriteConfig.postCollectionID,
            [Query.search('caption',searchTerm)]
        )
        if(!posts) throw Error;

        return posts;

    } catch (error) {
        console.log(error);
    }

}

export async function getUser(limit?:number){
    const queries:any[]=[Query.orderDesc("$createdAt")];

    if(limit){
        queries.push(Query.limit(limit))
    }

    try {
        const users = await databases.listDocuments(
            appwriteConfig.databaseID,
            appwriteConfig.userCollectionID,
            queries
        );
        
        if(!users) throw Error;

        return users;

    } catch (error) {
        console.log(error); 
    }
}


export async function  getUserById(userId:string){
    try {
        const user = await databases.getDocument(
            appwriteConfig.databaseID,
            appwriteConfig.userCollectionID,
            userId
        );

        if(!user) throw Error;

        return user;

    } catch (error) {
        console.log(error);
      }
}