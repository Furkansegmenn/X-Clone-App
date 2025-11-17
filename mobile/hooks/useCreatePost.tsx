import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useApiClient } from "../utils/api";

export interface PostData {
    content: string
    imageUri?: string
}

export const useCreatePost = () => {
    const [content, setContent] = useState("")
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const api = useApiClient()
    const queryClient = useQueryClient();

    const createPostMutation = useMutation({
        mutationFn: async (postData: PostData) => {
            const formData = new FormData();

            if (postData.content) formData.append("content", postData.content)

            if (postData.imageUri) {
                console.log(postData.imageUri)
                const uriParts = postData.imageUri.split(".");
                console.log(uriParts)
                const fileType = uriParts[uriParts.length - 1].toLowerCase()

                const mimeTypeMap: Record<string, string> = {
                    png: "image/png",
                    jgp: "image/jpg",
                    webp: "image/webp"
                }
                const mimeType = mimeTypeMap[fileType] || "image/jpeg";

                formData.append("image", {
                    uri: postData.imageUri,
                    name: `image.${fileType}`,
                    type: mimeType,
                } as any)
            }

            return api.post("/posts", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
        },
        onSuccess: () => {
            setContent("")
            setSelectedImage(null)
            queryClient.invalidateQueries({ queryKey: ["posts"] })
            Alert.alert("Success", "Post created successfully!");
        },
        onError: () => {
            Alert.alert("Error", "Failed to create post. Please try again.")
        }
    })

    const handleImagePicker = async (useCamera: boolean = false) => {
        try {
            const permission = useCamera
                ? await ImagePicker.requestCameraPermissionsAsync()
                : await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permission.granted) {
                Alert.alert(
                    "Permission required",
                    useCamera
                        ? "Lütfen kamera erişimine izin verin."
                        : "Lütfen galeri erişimine izin verin."
                );
                return;
            }

            const pickerResult = useCamera
                ? await ImagePicker.launchCameraAsync({
                    allowsEditing: true,
                    mediaTypes: ["images"],
                    quality: 0.8,
                })
                : await ImagePicker.launchImageLibraryAsync({
                    allowsEditing: true,
                    mediaTypes: ["images"],
                    quality: 0.8,
                });

            if (!pickerResult.canceled && pickerResult.assets?.length) {
                setSelectedImage(pickerResult.assets[0].uri);
            }
        } catch (error) {
            console.error("handleImagePicker error", error);
            Alert.alert("Error", "There was a problem selecting the image.");
        }
    }


    const createPost = () => {
        if (!content.trim() && !selectedImage) {
            Alert.alert("Empty Post", "Please write something or add an image before posting!");
            return
        }

        createPostMutation.mutate({
            content: content.trim(),
            imageUri: selectedImage ?? undefined,
        })
    }

    return {
        content,
        setContent,
        selectedImage,
        isCreating: createPostMutation.isPending,
        pickImageFromGallery: () => handleImagePicker(false),
        takePhoto: () => handleImagePicker(true),
        removeImage: () => setSelectedImage(null),
        createPost,
    }
}

