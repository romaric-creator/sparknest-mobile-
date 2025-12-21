import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { Plus, Trash2, Edit } from 'lucide-react-native';
import { adminService } from '../services/api';

const ArticlesScreen = ({ navigation }) => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadArticles();
    }, []);

    const loadArticles = async () => {
        try {
            const response = await adminService.getArticles();
            setArticles(response.data);
        } catch (error) {
            console.error('Erreur lors du chargement des articles:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleDelete = (id) => {
        Alert.alert(
            'Supprimer l\'article',
            'Êtes-vous sûr de vouloir supprimer cet article ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await adminService.deleteArticle(id);
                            loadArticles();
                        } catch (error) {
                            Alert.alert('Erreur', 'Impossible de supprimer l\'article.');
                        }
                    }
                },
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.articleCard}>
            <View style={styles.articleInfo}>
                <Text style={styles.articleTitle} numberOfLines={2}>{item.title}</Text>
                <View style={styles.badge}>
                    <Text style={styles.articleCategory}>{item.category}</Text>
                </View>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity onPress={() => navigation.navigate('EditArticle', { article: item })}>
                    <Edit color="#22d3ee" size={22} style={styles.actionIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <Trash2 color="#ef4444" size={22} />
                </TouchableOpacity>
            </View>
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
                data={articles}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadArticles(); }} tintColor="#22d3ee" />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Aucun article trouvé.</Text>
                    </View>
                }
            />
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('AddArticle')}
            >
                <Plus color="#020617" size={30} />
            </TouchableOpacity>
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
        paddingBottom: 100,
    },
    articleCard: {
        backgroundColor: '#0f172a',
        padding: 20,
        marginHorizontal: 20,
        marginTop: 15,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#1e293b',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    articleInfo: {
        flex: 1,
        marginRight: 15,
    },
    articleTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    badge: {
        backgroundColor: '#1e293b',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    articleCategory: {
        color: '#22d3ee',
        fontSize: 12,
        fontWeight: '600',
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionIcon: {
        marginRight: 20,
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: '#22d3ee',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
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

export default ArticlesScreen;
