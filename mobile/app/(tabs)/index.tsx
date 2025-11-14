import { Image, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons"
import AntDesign from '@expo/vector-icons/AntDesign';
import SignOutButton from '@/components/SignOutButton'
import { useUserSync } from '@/hooks/useUserSycn';
import { useUser } from "@clerk/clerk-expo";
import PostComposer from '@/components/PostComposer';

const HomeScreen = () => {
    const { user } = useUser();


    useUserSync()
    return (
        <SafeAreaView className="flex-1 bg-black">
            <View className='flex-row items-center px-4 py-3 border-b border-gray-700'>
                <View
                    className='rounded-full bg-gray-200 overflow-hidden items-center justify-center'
                    style={{ width: 36, height: 36 }}
                >
                    {user?.imageUrl ? (
                        <Image
                            source={{ uri: user.imageUrl }}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="cover"
                        />
                    ) : (
                        <Ionicons name="person-circle-outline" size={28} color={"#000"} />
                    )}
                </View>
                <View className='flex-1 items-center'>
                    <AntDesign name="x" size={32} color="white" />
                </View>
                <View
                    className='items-end justify-center'
                    style={{ width: 36 }}
                >
                    <SignOutButton />
                </View>
            </View>
            <View className='flex-1'>

                <PostComposer></PostComposer>
            </View>
        </SafeAreaView>
    )
}

export default HomeScreen