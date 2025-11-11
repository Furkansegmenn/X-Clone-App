import React from 'react'
import { FlatList, View, Text } from 'react-native'
import { TRENDING_TOPICS, TrendTopic } from '../lib/trends'

const Item = ({ item, index }: { item: TrendTopic; index: number }) => {
    return (
        <View className="flex-row gap-3">
            <Text className="w-6 text-center text-gray-500">{index + 1}</Text>
            <View className="flex-1">
                {!!item.category && <Text className="text-gray-500 text-xs mb-0.5">{item.category} · Trending</Text>}
                <Text className="text-gray-900 text-base font-semibold">{item.title}</Text>
                {!!item.tweetsCount && <Text className="text-gray-500 text-xs mt-0.5">{item.tweetsCount.toLocaleString()} Tweets</Text>}
            </View>
        </View>
    )
}

const keyExtractor = (t: TrendTopic) => t.id

const TrendingTopics = ({ data }: { data?: TrendTopic[] }) => {
    return (
        <FlatList
            data={data ?? TRENDING_TOPICS}
            keyExtractor={keyExtractor}
            renderItem={({ item, index }) => <Item item={item} index={index} />}
            ItemSeparatorComponent={() => <View className="h-px bg-gray-200 my-3" />}
            contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
            showsVerticalScrollIndicator={false}
        />
    )
}

export default TrendingTopics