import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { adminService } from '../services/api';

const AddProjectScreen = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('En cours');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!title || !description) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
            return;
        }

        setLoading(true);
        try {
            await adminService.createProject({ title, description, status });
            Alert.alert('Succès', 'Projet créé avec succès !');
            navigation.goBack();
        } catch (error) {
            console.error('Erreur lors de la création du projet:', error);
            Alert.alert('Erreur', 'Impossible de créer le projet.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.label}>Titre du projet</Text>
                <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Nom du projet"
                    placeholderTextColor="#64748b"
                />

                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Description détaillée..."
                    placeholderTextColor="#64748b"
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                />

                <Text style={styles.label}>Statut</Text>
                <View style={styles.statusContainer}>
                    {['En cours', 'Terminé', 'En pause'].map((s) => (
                        <TouchableOpacity
                            key={s}
                            style={[styles.statusOption, status === s && styles.statusActive]}
                            onPress={() => setStatus(s)}
                        >
                            <Text style={[styles.statusText, status === s && styles.statusTextActive]}>{s}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#020617" />
                    ) : (
                        <Text style={styles.saveButtonText}>Créer le projet</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020617',
    },
    form: {
        padding: 20,
    },
    label: {
        color: '#94a3b8',
        fontSize: 14,
        marginBottom: 8,
        fontWeight: '600',
    },
    input: {
        backgroundColor: '#0f172a',
        borderRadius: 10,
        padding: 15,
        color: '#fff',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#1e293b',
    },
    textArea: {
        height: 120,
    },
    statusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    statusOption: {
        flex: 1,
        backgroundColor: '#0f172a',
        padding: 12,
        borderRadius: 8,
        marginHorizontal: 4,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#1e293b',
    },
    statusActive: {
        backgroundColor: 'rgba(34, 211, 238, 0.1)',
        borderColor: '#22d3ee',
    },
    statusText: {
        color: '#94a3b8',
        fontSize: 12,
        fontWeight: '600',
    },
    statusTextActive: {
        color: '#22d3ee',
    },
    saveButton: {
        backgroundColor: '#22d3ee',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    saveButtonText: {
        color: '#020617',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AddProjectScreen;
