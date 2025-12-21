// mobile/src/screens/AddServiceScreen.tsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { adminService } from '../services/api';
import { useNavigation } from '@react-navigation/native';

const AddServiceScreen = () => {
    const navigation = useNavigation();
    const [icon, setIcon] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!icon || !title || !description) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
            return;
        }

        setLoading(true);
        try {
            await adminService.createService({ icon, title, description });
            Alert.alert('Succès', 'Service ajouté avec succès !');
            navigation.goBack();
        } catch (error) {
            console.error('Erreur lors de la création du service:', error);
            Alert.alert('Erreur', 'Impossible de créer le service.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
            <View style={styles.form}>
                <Text style={styles.label}>Nom de l'icône (Lucide React Native)</Text>
                <TextInput
                    style={styles.input}
                    value={icon}
                    onChangeText={setIcon}
                    placeholder="Ex: Code, Smartphone, Cloud"
                    placeholderTextColor="#94a3b8"
                />

                <Text style={styles.label}>Titre du service</Text>
                <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Ex: Développement Web"
                    placeholderTextColor="#94a3b8"
                />

                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Courte description du service..."
                    placeholderTextColor="#94a3b8"
                    multiline
                />

                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#ffffff" />
                    ) : (
                        <Text style={styles.saveButtonText}>Enregistrer le service</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    form: {
        padding: 24,
    },
    label: {
        color: '#334155',
        fontSize: 14,
        marginBottom: 8,
        fontWeight: '600',
    },
    input: {
        backgroundColor: '#f8fafc',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        color: '#0f172a',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        fontSize: 16,
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    saveButton: {
        backgroundColor: '#0f172a',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    saveButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AddServiceScreen;
