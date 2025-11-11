import React, { useState } from 'react'
import SearchBar from '../../components/SearchBar'
import { SafeAreaView } from 'react-native-safe-area-context'
import TrendingTopics from '../../components/TrendingTopics'
import { TRENDING_TOPICS, TrendTopic } from '../../lib/trends'

const SearchScreen = () => {
    const [results, setResults] = useState<TrendTopic[]>(TRENDING_TOPICS)
    return (
        <SafeAreaView className="flex-1 bg-white">
            <SearchBar onResultsChange={setResults} />
            <TrendingTopics data={results} />

        </SafeAreaView>
    )
}

export default SearchScreen