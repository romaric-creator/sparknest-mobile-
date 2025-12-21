// mobile/src/screens/AddTestimonialScreen.tsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { adminService } from '../services/api';
import { useNavigation } from '@react-navigation/native';

const AddTestimonialScreen = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!name || !role || !content) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires (Nom, Rôle, Contenu).');
            return;
        }

        setLoading(true);
        try {
            await adminService.createTestimonial({ name, role, content, image });
            Alert.alert('Succès', 'Témoignage ajouté avec succès !');
            navigation.goBack();
        } catch (error) {
            console.error('Erreur lors de la création du témoignage:', error);
            Alert.alert('Erreur', 'Impossible de créer le témoignage.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
            <View style={styles.form}>
                <Text style={styles.label}>Nom de la personne</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Ex: Jean Dupont"
                    placeholderTextColor="#94a3b8"
                />

                <Text style={styles.label}>Rôle / Entreprise</Text>
                <TextInput
                    style={styles.input}
                    value={role}
                    onChangeText={setRole}
                    placeholder="Ex: CEO, Tech Corp"
                    placeholderTextColor="#94a3b8"
                />

                <Text style={styles.label}>URL de l'image (optionnel)</Text>
                <TextInput
                    style={styles.input}
                    value={image}
                    onChangeText={setImage}
                    placeholder="https://example.com/photo.png"
                    placeholderTextColor="#94a3b8"
                    keyboardType="url"
                />

                <Text style={styles.label}>Contenu du témoignage</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={content}
                    onChangeText={setContent}
                    placeholder="Leur service était exceptionnel..."
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
                        <Text style={styles.saveButtonText}>Enregistrer le témoignage</Text>
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
        minHeight: 120,
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

export default AddTestimonialScreen;
