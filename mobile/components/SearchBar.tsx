import React, { useState } from 'react'
import { View, TextInput } from 'react-native'
import { TRENDING_TOPICS, TrendTopic } from '../lib/trends'
import Feather from '@expo/vector-icons/Feather'

type SearchBarProps = {
    placeholder?: string
    onChangeText?: (text: string) => void
    value?: string
    onResultsChange?: (results: TrendTopic[]) => void
}

const SearchBar = ({ placeholder = 'Search', onChangeText, value, onResultsChange }: SearchBarProps) => {
    const [internalValue, setInternalValue] = useState('')
    const textValue = value !== undefined ? value : internalValue

    const handleChange = (text: string) => {
        if (value === undefined) {
            setInternalValue(text)
        }
        onChangeText?.(text)
        const q = text.trim().toLowerCase()
        if (!q) {
            onResultsChange?.(TRENDING_TOPICS)
            return
        }
        const filtered = TRENDING_TOPICS.filter(t => {
            const inTitle = t.title.toLowerCase().includes(q)
            const inCategory = (t.category || '').toLowerCase().includes(q)
            return inTitle || inCategory
        })
        onResultsChange?.(filtered)
    }

    return (
        <View className="px-4 pt-3 pb-2 bg-white">
            <View className="flex-row items-center h-10 rounded-lg bg-gray-100 border border-gray-200 px-2.5">
                <Feather name="search" size={18} color="#6B7280" style={{ marginRight: 4 }} />
                <TextInput
                    value={textValue}
                    onChangeText={handleChange}
                    placeholder={placeholder}
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="none"
                    autoCorrect={false}
                    clearButtonMode="while-editing"
                    className="flex-1 text-gray-900 pl-2"
                    returnKeyType="search"
                />
            </View>
        </View>
    )
}

export default SearchBar


