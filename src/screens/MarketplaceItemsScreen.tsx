// mobile/src/screens/MarketplaceItemsScreen.tsx
import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { adminService } from '../services/api';
import { Plus, Trash2, Edit, Star } from 'lucide-react-native';
import { RootStackNavigationProp } from '../types/navigation'; // Import the type

const MarketplaceItemsScreen = () => {
    const navigation = useNavigation<RootStackNavigationProp<'MarketplaceItems'>>(); // Type the navigation hook
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const response = await adminService.getMarketplaceItems();
            setItems(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des articles:', error);
            Alert.alert('Erreur', 'Impossible de charger les articles.');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchItems();
        }, [])
    );

    const handleDelete = (id) => {
        Alert.alert(
            'Confirmer la suppression',
            'Êtes-vous sûr de vouloir supprimer cet article ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await adminService.deleteMarketplaceItem(id);
                            Alert.alert('Succès', 'Article supprimé.');
                            fetchItems(); // Refresh list
                        } catch (error) {
                            console.error('Erreur lors de la suppression:', error);
                            Alert.alert('Erreur', 'Impossible de supprimer l\'article.');
                        }
                    },
                },
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <View style={styles.itemTextContainer}>
                <View style={styles.itemHeader}>
                    <Text style={styles.itemTitle}>{item.name}</Text>
                    {item.popular && <Star size={16} color="#facc15" fill="#facc15" />}
                </View>
                <Text style={styles.itemSubtitle}>{item.category}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
                <Text style={styles.itemPrice}>{item.price}{item.period}</Text>
            </View>
            <View style={styles.itemActions}>
                <TouchableOpacity onPress={() => {/* TODO: Navigate to Edit screen */}} style={styles.actionButton}>
                    <Edit size={20} color="#334155" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionButton}>
                    <Trash2 size={20} color="#ef4444" />
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return <ActivityIndicator style={styles.loader} size="large" color="#0f172a" />;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
                ListEmptyComponent={<Text style={styles.emptyText}>Aucun article trouvé.</Text>}
            />
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('AddMarketplaceItem')}
            >
                <Plus size={24} color="#ffffff" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f1f5f9' },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    list: { padding: 16 },
    itemContainer: { backgroundColor: '#ffffff', borderRadius: 8, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'flex-start', elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
    itemTextContainer: { flex: 1 },
    itemHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    itemTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
    itemSubtitle: { fontSize: 12, color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold', marginVertical: 4 },
    itemDescription: { fontSize: 14, color: '#475569', marginTop: 4 },
    itemPrice: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginTop: 8 },
    itemActions: { flexDirection: 'column', alignItems: 'center', marginLeft: 8 },
    actionButton: { padding: 8 },
    fab: { position: 'absolute', right: 24, bottom: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center', elevation: 4 },
    emptyText: { textAlign: 'center', marginTop: 40, fontSize: 16, color: '#64748b' },
});

export default MarketplaceItemsScreen;
