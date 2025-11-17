
import { usePosts } from "@/hooks/usePosts";
import { Post } from "@/types";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { useCurrentUser } from "@/hooks/useCurrenUser";
import PostCard from "./PostCard";


const PostsList = () => {
    const { currentUser } = useCurrentUser();
    const { posts, isLoading, isError, refetch, toggleLike, deletePost, checkİsLiked } =
        usePosts();

    if (isLoading) {
        return (
            <View className="p-8 items-center">
                <ActivityIndicator size="large" color="#1DA1F2" />
                <Text className="text-gray-500 mt-2">Loading posts...</Text>
            </View>
        );
    }

    if (isError) {
        return (
            <View className="p-8 items-center">
                <Text className="text-gray-500 mb-4">Failed to load posts</Text>
                <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-lg" onPress={() => refetch()}>
                    <Text className="text-white font-semibold">Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (posts.length === 0) {
        return (
            <View className="p-8 items-center">
                <Text className="text-gray-500">No posts yet</Text>
            </View>
        );
    }

    return (
        <>
            {posts.map((post: Post) => (
                <PostCard
                    onToggleLike={toggleLike}
                    key={post._id}
                    post={post}
                    onDelete={deletePost}
                    currentUser={currentUser}
                    isLiked={checkİsLiked(post.likes, currentUser)}
                />
            ))}

        </>
    );
};

export default PostsList;