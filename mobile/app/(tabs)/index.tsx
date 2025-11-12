import { Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import SignOutButton from '@/components/SignOutButton'
import { useUserSync } from '@/hooks/useUserSycn';

const HomeScreen = () => {

    useUserSync()
    return (
        <SafeAreaView className="flex-1 justify-center items-center bg-white">
            <Text>HomeScreen</Text>
            <SignOutButton />
        </SafeAreaView>
    )
}

export default HomeScreen