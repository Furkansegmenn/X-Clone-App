import { View, Text, Image, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { Post, User } from '@/types'
import { Feather } from '@expo/vector-icons'
import { formatDate } from '@/utils/formatter'

interface PostCardProps {
    post: Post
    currentUser: User | null
    onToggleLike: (postId: string) => void
    onDelete: (postId: string) => void
    isLiked: boolean
}

const PostCard: React.FC<PostCardProps> = ({
    post,
    currentUser,
    onToggleLike,
    onDelete,
    isLiked
}) => {
    const isOwner = currentUser?._id === post.user._id

    const handleDelete = () => {
        Alert.alert(
            "Postu Sil",
            "Bu postu silmek istediğinize emin misiniz? Bu işlem geri alınamaz.",
            [
                {
                    text: "İptal",
                    style: "cancel"
                },
                {
                    text: "Sil",
                    style: "destructive",
                    onPress: () => onDelete(post._id)
                }
            ]
        )
    }

    return (
        <View className="border-b border-gray-700 px-4 py-3">
            <View className="flex-row">
                {/* Profile Picture */}
                <View className="mr-3">
                    <View className="rounded-full bg-gray-200 overflow-hidden"
                        style={{ width: 40, height: 40 }}>
                        {post.user.profilePicture && (
                            <Image
                                source={{
                                    uri: post.user.profilePicture || ""
                                }}
                                style={{ width: '100%', height: '100%' }}
                                resizeMode="cover"
                            />
                        )}
                    </View>
                </View>

                {/* Content */}
                <View className="flex-1">
                    {/* User Info */}
                    <View className="flex-row items-center mb-1">
                        <Text className="text-white font-semibold mr-2">
                            {post.user.firstName} {post.user.lastName}
                        </Text>
                        <Text className="text-gray-500 text-sm">
                            @{post.user.username}
                        </Text>
                        <Text className="text-gray-500 text-sm mx-1">·</Text>
                        <Text className="text-gray-500 text-sm">
                            {formatDate(post.createdAt)}
                        </Text>
                    </View>

                    {/* Post Content */}
                    {post.content && (
                        <Text className="text-gray-100 text-base mb-2">
                            {post.content}
                        </Text>
                    )}

                    {/* Post Image */}
                    {post.image && (
                        <View className="mb-2 rounded-2xl overflow-hidden">
                            <Image
                                source={{ uri: post.image }}
                                className="w-full"
                                style={{ height: 300 }}
                                resizeMode="cover"
                            />
                        </View>
                    )}

                    {/* Actions */}
                    <View className="flex-row items-center justify-between mt-2">
                        <View className="flex-row items-center gap-6">
                            {/* Like Button */}
                            <TouchableOpacity
                                onPress={() => onToggleLike(post._id)}
                                className="flex-row items-center gap-2"
                            >
                                <Feather
                                    name={isLiked ? "heart" : "heart"}
                                    size={18}
                                    color={isLiked ? "#ef4444" : "#657786"}
                                    fill={isLiked ? "#ef4444" : "none"}
                                />
                                <Text className={`text-sm ${isLiked ? "text-red-500" : "text-gray-500"}`}>
                                    {post.likes.length}
                                </Text>
                            </TouchableOpacity>

                            {/* Comment Button */}
                            <TouchableOpacity className="flex-row items-center gap-2">
                                <Feather name="message-circle" size={18} color="#657786" />
                                <Text className="text-gray-500 text-sm">
                                    {post.comments.length}
                                </Text>
                            </TouchableOpacity>

                            {/* Share Button */}
                            <TouchableOpacity>
                                <Feather name="share" size={18} color="#657786" />
                            </TouchableOpacity>
                        </View>

                        {/* Delete Button (only for owner) */}
                        {isOwner && (
                            <TouchableOpacity
                                onPress={handleDelete}
                            >
                                <Feather name="trash-2" size={18} color="#ef4444" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </View>
    )
}

export default PostCard

