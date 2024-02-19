import { INewPost, INewUser, IUpdatePost } from "@/types"
import {
    useQuery,//for fetch the data
    useMutation,//modifiy the data 
    useQueryClient, //there both use for react query
    useInfiniteQuery,
} from "@tanstack/react-query"
import { createPost, createUserAccount, deletePost, deletesavedPost, getCurrentUser, getInfinitePosts, getPostById, getRecentPosts, getUser, getUserById, getUserPost, likePost, savePost, searchPosts, signInAccount, signOutAccount, updatePost } from "../appwrite/api"
import { QUERY_KEYS } from "./queryKeys"


//firstmutation

export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user)
    })
}

export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user: {
            email: string;
            password: string;
        }) => signInAccount(user)
    })
}

export const useSignOutAccount = () => {
    return useMutation({
        mutationFn:signOutAccount
    })
}

export const usecreatePost =()=>{
    const queryclient = useQueryClient();
    return useMutation({
        mutationFn:(post:INewPost)=>createPost(post),
        onSuccess:()=>{
            queryclient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
            })
        }
    })
}

export const useGetRecentPost =()=>{
    return useQuery({
        queryKey:[QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: getRecentPosts,
    })
}

export const userLikePost =()=>{
    const queryClient  = useQueryClient();
    
    return useMutation({
        mutationFn:({postId,likesArray}:{postId:string; 
            likesArray:string[] })=>likePost(postId,likesArray),
            onSuccess:(data)=>{
                queryClient.invalidateQueries({
                    queryKey:[QUERY_KEYS.GET_POST_BY_ID,data?.$id]
                })
                queryClient.invalidateQueries({
                    queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
                })
                queryClient.invalidateQueries({
                    queryKey:[QUERY_KEYS.GET_POSTS]
                })
                queryClient.invalidateQueries({
                    queryKey:[QUERY_KEYS.GET_CURRENT_USER]
                })
            }
    })
}


export const userSavedPost =()=>{
    const queryClient  = useQueryClient();
    
    return useMutation({
        mutationFn:({postId,userId}:{userId:string;postId:string; })=>savePost(postId,userId),
            onSuccess:()=>{
                queryClient.invalidateQueries({
                    queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
                })
                queryClient.invalidateQueries({
                    queryKey:[QUERY_KEYS.GET_POSTS]
                })
                queryClient.invalidateQueries({
                    queryKey:[QUERY_KEYS.GET_CURRENT_USER]
                })
            }
    })
}

export const userDeleteSavedPost =()=>{
    const queryClient  = useQueryClient();
    
    return useMutation({
        mutationFn:(savedRecordId:string)=>deletesavedPost(savedRecordId),
            onSuccess:()=>{
                queryClient.invalidateQueries({
                    queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
                })
                queryClient.invalidateQueries({
                    queryKey:[QUERY_KEYS.GET_POSTS]
                })
                queryClient.invalidateQueries({
                    queryKey:[QUERY_KEYS.GET_CURRENT_USER]
                })
            }
    })
}

export const useGetCurrentUser=()=>{
    return useQuery({
        queryKey:[QUERY_KEYS.GET_CURRENT_USER],
        queryFn:getCurrentUser
    })
}

export const usegetPostbyId=(postId:string)=>{
    return useQuery({
        queryKey:[QUERY_KEYS.GET_POST_BY_ID,postId],
        queryFn:()=>getPostById(postId),
        enabled:!!postId
    })
}

export const useUpdatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (post: IUpdatePost) => updatePost(post),
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
        });
      },
    });
  };
  
  export const useDeletePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ postId, imageId }: { postId: string; imageId: string }) =>
       deletePost(postId,imageId),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        });
      },
    });
  };

  export const useGetUserPosts=(userId:string)=>{
    return useQuery({
        queryKey:[QUERY_KEYS.GET_USER_POSTS,userId],
        queryFn:()=>getUserPost(userId),
        enabled:!!userId,
    })
  }
  

  export const useGetPosts=()=>{
    return useInfiniteQuery({
       queryKey:[QUERY_KEYS.GET_INFINITE_POSTS],
       queryFn:getInfinitePosts,
       getNextPageParam:(lastPage)=>{
        if(lastPage && lastPage.documents.length === 0) return null;

        const lastId = lastPage.documents[lastPage?.documents.length-1].$id;

        return lastId;
       }
    })
  }


  export const useSearchPosts = (searchTerm:string)=>{
    return useQuery({
        queryKey:[QUERY_KEYS.SEARCH_POSTS,searchTerm],
        queryFn:()=>searchPosts(searchTerm),
        enabled:!!searchTerm

    })
  }

  export const useGetUsers = (limit?:number)=>{
    return useQuery({
        queryKey:[QUERY_KEYS.GET_USERS],
        queryFn:()=>getUser(limit),
    });
  };

  export const useGetUserById = (userId:string)=>{
    return useQuery({
        queryKey:[QUERY_KEYS.GET_USER_BY_ID,userId],
        queryFn:()=>getUserById(userId),
        enabled: !!userId,
    })
  }