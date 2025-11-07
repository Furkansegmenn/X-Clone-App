import { View, Text, Button } from 'react-native'
import React from 'react'
import { useClerk } from '@clerk/clerk-expo'

const HomeScreen = () => {
    const { signOut } = useClerk();
    return (
        <View className='flex-1 justify-center items-center'>
            <Text>Selam</Text>
            <Button title='Logout' onPress={() => signOut()}></Button>
        </View>
    )
}

export default HomeScreen