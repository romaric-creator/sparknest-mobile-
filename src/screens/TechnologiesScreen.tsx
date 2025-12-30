import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { adminService } from '../services/api';
import { Plus, Trash2, Edit } from 'lucide-react-native'; // Keep Lucide for action buttons
import Icon from '../components/Icon'; // Our custom Lucide Icon wrapper
import { RootStackNavigationProp } from '../types/navigation'; // Import the type

// Mapping from technology names (or backend icon strings) to valid Lucide icon names
const iconNameMapping: { [key: string]: string } = {
    "Node JS": "Server",
    "Typescript": "Brackets",
    "React": "Atom",
    "HTML": "Html5", // Assuming 'Html5' is a valid Lucide icon name
    "CSS": "Css3",   // Assuming 'Css3' is a valid Lucide icon name
    // Add more mappings as needed
};

const TechnologiesScreen = () => {
    const navigation = useNavigation<RootStackNavigationProp<'Technologies'>>(); // Type the navigation hook
    const [technologies, setTechnologies] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTechnologies = async () => {
        try {
            setLoading(true);
            const response = await adminService.getTechnologies();
            setTechnologies(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des technologies:', error);
            Alert.alert('Erreur', 'Impossible de charger les technologies.');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchTechnologies();
        }, [])
    );

    const handleDelete = (id) => {
        Alert.alert(
            'Confirmer la suppression',
            'Êtes-vous sûr de vouloir supprimer cette technologie ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await adminService.deleteTechnology(id);
                            Alert.alert('Succès', 'Technologie supprimée.');
                            fetchTechnologies(); // Refresh list
                        } catch (error) {
                            console.error('Erreur lors de la suppression:', error);
                            Alert.alert('Erreur', 'Impossible de supprimer la technologie.');
                        }
                    },
                },
            ]
        );
    };

    const renderItem = ({ item }) => {
        const lucideIconName = iconNameMapping[item.name] || 'HelpCircle'; // Fallback icon
        return (
            <View style={styles.itemContainer}>
                <Icon name={lucideIconName as any} size={32} color="#0f172a" style={styles.icon} />
                <View style={styles.itemTextContainer}>
                    <Text style={styles.itemTitle}>{item.name}</Text>
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
    };

    if (loading) {
        return <ActivityIndicator style={styles.loader} size="large" color="#0f172a" />;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={technologies}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
                ListEmptyComponent={<Text style={styles.emptyText}>Aucune technologie trouvée.</Text>}
            />
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('AddTechnology')}
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
        alignItems: 'center',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    icon: {
        // No specific styling needed for Icon component, it handles size/color
        marginRight: 16,
    },
    itemTextContainer: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    itemActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        padding: 8,
        marginLeft: 8,
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

export default TechnologiesScreen;
