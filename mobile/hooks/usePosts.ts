import { postsApi, useApiClient } from '@/utils/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'



export const usePosts = () => {

    const api = useApiClient()
    const queryClient = useQueryClient()
    
    const {
        data: postsData,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey:["posts"],
        queryFn: () => postsApi.getPosts(api),
        select: (response) => response.data.posts,
    })

    const likePostMutation = useMutation({
        mutationFn:(postId:string) => {
          
            return postsApi.likePost(api,postId);
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({queryKey:["posts"]});
        },
        onError: (error: any) => {
           console.log({error : error.response.data})
        }
    })
 
    const deletePostMutaion = useMutation({
        mutationFn:(postId:string) => {
            console.log("=== DELETE POST MUTATION ===");
            console.log("Post ID:", postId);
            console.log("API Base URL:", api.defaults.baseURL);
            return postsApi.deletePost(api, postId);
        },
        onSuccess: (response) => {
            console.log("Delete post success:", response.data);
            queryClient.invalidateQueries({queryKey:["posts"]});
            queryClient.invalidateQueries({queryKey:["userPosts"]});
        },
        onError: (error: any) => {
            console.error("=== DELETE POST ERROR ===");
            console.error("Error message:", error.message);
            console.error("Error response:", error.response?.data);
            console.error("Error status:", error.response?.status);
            console.error("Request URL:", error.config?.url);
            console.error("Request method:", error.config?.method);
        }
    })

    const checkİsLiked = (postLikes: string[], currentUser: any) => {
        const isLiked = currentUser && postLikes.includes(currentUser._id);
        return isLiked;
    }

    return {
        posts: postsData || [],
        isLoading,
        isError,
        refetch,
        toggleLike : (postId:string) =>likePostMutation.mutate(postId),
        deletePost : (postId:string) =>deletePostMutaion.mutate(postId),
        checkİsLiked
    }
  
}

