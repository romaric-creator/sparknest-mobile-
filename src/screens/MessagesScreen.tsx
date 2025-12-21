import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { Mail, MailOpen, CheckCircle } from 'lucide-react-native';
import { adminService } from '../services/api';

const MessagesScreen = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadMessages();
    }, []);

    const loadMessages = async () => {
        try {
            const response = await adminService.getMessages();
            setMessages(response.data);
        } catch (error) {
            console.error('Erreur lors du chargement des messages:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleMarkRead = async (id) => {
        try {
            await adminService.markMessageRead(id);
            loadMessages();
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de marquer le message comme lu.');
        }
    };

    const renderItem = ({ item }) => (
        <View style={[styles.messageCard, !item.read && styles.unreadCard]}>
            <View style={styles.messageHeader}>
                <View style={styles.senderInfo}>
                    <Text style={styles.senderName}>{item.name}</Text>
                    <Text style={styles.senderEmail}>{item.email}</Text>
                </View>
                {!item.read ? (
                    <Mail color="#22d3ee" size={20} />
                ) : (
                    <MailOpen color="#94a3b8" size={20} />
                )}
            </View>
            <Text style={styles.subject}>{item.subject}</Text>
            <Text style={styles.content} numberOfLines={3}>{item.content}</Text>

            {!item.read && (
                <TouchableOpacity
                    style={styles.readButton}
                    onPress={() => handleMarkRead(item.id)}
                >
                    <CheckCircle color="#22d3ee" size={16} />
                    <Text style={styles.readButtonText}>Marquer comme lu</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#22d3ee" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadMessages(); }} tintColor="#22d3ee" />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Aucun message reçu.</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020617',
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#020617',
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingBottom: 30,
    },
    messageCard: {
        backgroundColor: '#0f172a',
        padding: 20,
        marginHorizontal: 20,
        marginTop: 15,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#1e293b',
    },
    unreadCard: {
        borderColor: '#22d3ee',
        borderWidth: 1,
        shadowColor: '#22d3ee',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 2,
    },
    messageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    senderInfo: {
        flex: 1,
    },
    senderName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    senderEmail: {
        color: '#94a3b8',
        fontSize: 12,
    },
    subject: {
        color: '#22d3ee',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 5,
    },
    content: {
        color: '#cbd5e1',
        fontSize: 14,
        lineHeight: 20,
    },
    readButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
        alignSelf: 'flex-end',
        backgroundColor: 'rgba(34, 211, 238, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    readButtonText: {
        color: '#22d3ee',
        fontSize: 12,
        marginLeft: 5,
        fontWeight: '600',
    },
    emptyContainer: {
        marginTop: 100,
        alignItems: 'center',
    },
    emptyText: {
        color: '#94a3b8',
        fontSize: 16,
    },
});

export default MessagesScreen;
