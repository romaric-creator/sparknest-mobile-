// mobile/src/screens/TestimonialsScreen.tsx
import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { adminService } from '../services/api';
import { Plus, Trash2, Edit, User } from 'lucide-react-native';
import { RootStackNavigationProp } from '../types/navigation'; // Import the type

const TestimonialsScreen = () => {
    const navigation = useNavigation<RootStackNavigationProp<'Testimonials'>>(); // Type the navigation hook
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTestimonials = async () => {
        try {
            setLoading(true);
            const response = await adminService.getTestimonials();
            setTestimonials(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des témoignages:', error);
            Alert.alert('Erreur', 'Impossible de charger les témoignages.');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchTestimonials();
        }, [])
    );

    const handleDelete = (id) => {
        Alert.alert(
            'Confirmer la suppression',
            'Êtes-vous sûr de vouloir supprimer ce témoignage ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await adminService.deleteTestimonial(id);
                            Alert.alert('Succès', 'Témoignage supprimé.');
                            fetchTestimonials(); // Refresh list
                        } catch (error) {
                            console.error('Erreur lors de la suppression:', error);
                            Alert.alert('Erreur', 'Impossible de supprimer le témoignage.');
                        }
                    },
                },
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            {item.image ? (
                <Image source={{ uri: item.image }} style={styles.avatar} />
            ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                    <User size={20} color="#64748b" />
                </View>
            )}
            <View style={styles.itemTextContainer}>
                <Text style={styles.itemTitle}>{item.name}</Text>
                <Text style={styles.itemSubtitle}>{item.role}</Text>
                <Text style={styles.itemContent}>"{item.content}"</Text>
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
                data={testimonials}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
                ListEmptyComponent={<Text style={styles.emptyText}>Aucun témoignage trouvé.</Text>}
            />
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('AddTestimonial')}
            >
                <Plus size={24} color="#ffffff" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f5f9',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        padding: 16,
    },
    itemContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 16,
    },
    avatarPlaceholder: {
        backgroundColor: '#e2e8f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemTextContainer: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    itemSubtitle: {
        fontSize: 14,
        color: '#64748b',
    },
    itemContent: {
        fontSize: 14,
        color: '#475569',
        marginTop: 8,
        fontStyle: 'italic',
    },
    itemActions: {
        flexDirection: 'column',
        alignItems: 'center',
        marginLeft: 8,
    },
    actionButton: {
        padding: 8,
    },
    fab: {
        position: 'absolute',
        right: 24,
        bottom: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#0f172a',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        fontSize: 16,
        color: '#64748b',
    },
});

export default TestimonialsScreen;
