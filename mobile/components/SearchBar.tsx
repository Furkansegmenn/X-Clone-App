import React, { useState } from 'react'
import { View, TextInput, StyleSheet } from 'react-native'
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
        <View style={styles.container}>
            <View style={styles.inputRow}>
                <Feather name="search" size={18} color="#6B7280" style={styles.icon} />
                <TextInput
                    value={textValue}
                    onChangeText={handleChange}
                    placeholder={placeholder}
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="none"
                    autoCorrect={false}
                    clearButtonMode="while-editing"
                    style={styles.input}
                    returnKeyType="search"
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 8,
        backgroundColor: 'white'
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 10
    },
    input: {
        flex: 1,
        color: '#111827',
        paddingLeft: 8
    },
    icon: {
        marginRight: 4
    }
})

export default SearchBar


