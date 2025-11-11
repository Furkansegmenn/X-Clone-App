import React from 'react'
import { FlatList, View, Text, StyleSheet } from 'react-native'
import { TRENDING_TOPICS, TrendTopic } from '../lib/trends'

const Item = ({ item, index }: { item: TrendTopic; index: number }) => {
    return (
        <View style={styles.itemContainer}>
            <Text style={styles.rank}>{index + 1}</Text>
            <View style={styles.itemContent}>
                {!!item.category && <Text style={styles.category}>{item.category} · Trending</Text>}
                <Text style={styles.title}>{item.title}</Text>
                {!!item.tweetsCount && <Text style={styles.count}>{item.tweetsCount.toLocaleString()} Tweets</Text>}
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
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
        />
    )
}

const styles = StyleSheet.create({
    listContent: {
        paddingHorizontal: 16,
        paddingVertical: 8
    },
    itemContainer: {
        flexDirection: 'row',
        gap: 12
    },
    rank: {
        width: 24,
        textAlign: 'center',
        color: '#6B7280'
    },
    itemContent: {
        flex: 1
    },
    category: {
        color: '#6B7280',
        fontSize: 12,
        marginBottom: 2
    },
    title: {
        color: '#111827',
        fontSize: 16,
        fontWeight: '600'
    },
    count: {
        color: '#6B7280',
        fontSize: 12,
        marginTop: 2
    },
    separator: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 12
    }
})

export default TrendingTopics


