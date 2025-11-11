import SearchBar from '@/components/SearchBar';
import { CONVERSATIONS, ConversationType } from '../../lib/converisation'
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import {
    View,
    Text,
    Alert,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Image,
    Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MessagesScreen = () => {
    const [searchText, setSearchText] = useState("");
    const [conversationsList, setConversationsList] = useState(CONVERSATIONS);
    const [selectedConversation, setSelectedConversation] = useState<ConversationType | null>(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [newMessage, setNewMessage] = useState("");


    const deleteConversation = (conversationId: number) => {
        Alert.alert("Delete Conversation", "Are you sure you want to delete this conversation?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: () => {
                    setConversationsList((prev) => prev.filter((conv) => conv.id !== conversationId));
                },
            },
        ]);
    };

    const openConversation = (conversation: ConversationType) => {
        setSelectedConversation(conversation);
        setIsChatOpen(true);
    };

    const closeConversation = () => {
        setIsChatOpen(false);
        setSelectedConversation(null);
        setNewMessage("");
    }


    const sendMessage = () => {
        if (newMessage.trim() && selectedConversation) {
            setConversationsList((prev) =>
                prev.map((conv) =>
                    conv.id === selectedConversation.id
                        ? {
                            ...conv,
                            lastMessage: newMessage,
                            time: "now",
                            messages: [
                                ...conv.messages,
                                {
                                    id: (conv.messages[conv.messages.length - 1]?.id ?? 0) + 1,
                                    text: newMessage,
                                    fromUser: true,
                                    timestamp: new Date(),
                                    time: "now",
                                },
                            ],
                        }
                        : conv
                )
            );
            setSelectedConversation((prev) =>
                prev
                    ? {
                        ...prev,
                        lastMessage: newMessage,
                        time: "now",
                        messages: [
                            ...prev.messages,
                            {
                                id: (prev.messages[prev.messages.length - 1]?.id ?? 0) + 1,
                                text: newMessage,
                                fromUser: true,
                                timestamp: new Date(),
                                time: "now",
                            },
                        ],
                    }
                    : prev
            );
            setNewMessage("");
            Alert.alert(
                "Message Sent!",
                `Your message has been sent to ${selectedConversation.user.name}`
            );
        }
    }

    // Local filtering for conversations (by name, username, last message)
    const filteredConversations = (() => {
        const q = searchText.trim().toLowerCase();
        if (!q) return conversationsList;
        return conversationsList.filter((c) => {
            const inName = c.user.name.toLowerCase().includes(q);
            const inUsername = c.user.username.toLowerCase().includes(q);
            const inLastMessage = c.lastMessage.toLowerCase().includes(q);
            return inName || inUsername || inLastMessage;
        });
    })();


    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* HEADER */}
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
                <Text className="text-xl font-bold text-gray-900">Messages</Text>
                <TouchableOpacity>
                    <Feather name="edit" size={24} color="#1DA1F2" />
                </TouchableOpacity>
            </View>

            {/* SEARCH BAR */}
            <SearchBar
                placeholder="Search messages"
                onChangeText={setSearchText}
                value={searchText}
            />

            {/* CONVERSATION LIST */}
            <ScrollView className="flex-1">
                {filteredConversations.map((conv) => (
                    <TouchableOpacity
                        key={conv.id}
                        className="flex-row items-center px-4 py-3 border-b border-gray-100 active:opacity-80"
                        onPress={() => openConversation(conv)}
                        onLongPress={() => deleteConversation(conv.id)}
                        delayLongPress={300}
                    >
                        <Image
                            source={{ uri: conv.user.avatar }}
                            className="w-12 h-12 rounded-full mr-3"
                        />
                        <View className="flex-1">
                            <View className="flex-row items-center justify-between">
                                <Text className="text-gray-900 font-semibold">{conv.user.name}</Text>
                                <Text className="text-gray-500 text-xs">{conv.time}</Text>
                            </View>
                            <Text className="text-gray-500 number-of-lines-1" numberOfLines={1}>
                                {conv.lastMessage}
                            </Text>
                        </View>

                    </TouchableOpacity>
                ))}
                {filteredConversations.length === 0 && (
                    <View className="px-4 py-8">
                        <Text className="text-center text-gray-500">No conversations found</Text>
                    </View>
                )}
            </ScrollView>

            {/* CHAT MODAL */}
            <Modal visible={isChatOpen} animationType="slide" presentationStyle="pageSheet">
                <SafeAreaView className="flex-1 bg-white">
                    {/* Chat Header */}
                    <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
                        <TouchableOpacity onPress={closeConversation} className="pr-3">
                            <Feather name="chevron-left" size={28} color="#111827" />
                        </TouchableOpacity>
                        {selectedConversation && (
                            <View className="flex-row items-center">
                                <Image
                                    source={{ uri: selectedConversation.user.avatar }}
                                    className="w-9 h-9 rounded-full mr-2"
                                />
                                <View>
                                    <Text className="text-gray-900 font-semibold">{selectedConversation.user.name}</Text>
                                    <Text className="text-gray-500 text-xs">@{selectedConversation.user.username}</Text>
                                </View>
                            </View>
                        )}
                    </View>

                    {/* Messages */}
                    <ScrollView
                        className="flex-1 px-4 py-3"
                        contentContainerStyle={{ paddingBottom: 12 }}
                    >
                        {selectedConversation?.messages.map((m) => (
                            <View
                                key={m.id}
                                className={`mb-2 max-w-[80%] px-3 py-2 rounded-2xl ${m.fromUser ? 'self-end bg-[#1DA1F2]' : 'self-start bg-gray-100'}`}
                            >
                                <Text className={`${m.fromUser ? 'text-white' : 'text-gray-900'}`}>
                                    {m.text}
                                </Text>
                                <Text className={`text-[10px] mt-1 ${m.fromUser ? 'text-white/90' : 'text-gray-500'}`}>
                                    {m.time}
                                </Text>
                            </View>
                        ))}
                    </ScrollView>

                    {/* Input */}
                    <View className="flex-row items-center px-4 py-3 border-t border-gray-100">
                        <TextInput
                            placeholder="Write a message"
                            placeholderTextColor="#9CA3AF"
                            className="flex-1 bg-gray-100 border border-gray-200 rounded-full px-4 py-2 mr-2 text-gray-900"
                            value={newMessage}
                            onChangeText={setNewMessage}
                            multiline
                        />
                        <TouchableOpacity
                            onPress={sendMessage}
                            className="w-10 h-10 rounded-full items-center justify-center"
                        >
                            <Feather name="send" size={22} color={newMessage.trim() ? "#1DA1F2" : "#9CA3AF"} />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    )
}

export default MessagesScreen