import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { adminService } from '../services/api';
import { useNavigation } from '@react-navigation/native';

const AddProjectScreen = () => {
    const navigation = useNavigation();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [technologies, setTechnologies] = useState('');
    const [demoUrl, setDemoUrl] = useState('');
    const [githubUrl, setGithubUrl] = useState('');
    const [status, setStatus] = useState('En cours');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!title || !description || !technologies || !imageUrl) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires (Titre, Description, Image URL, Technologies).');
            return;
        }

        setLoading(true);
        try {
            await adminService.createProject({ 
                title, 
                description, 
                status,
                image: imageUrl,
                technologies,
                demoUrl,
                githubUrl,
            });
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
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
            <View style={styles.form}>
                <Text style={styles.label}>Titre du projet</Text>
                <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Nom du projet"
                    placeholderTextColor="#94a3b8"
                />

                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Description détaillée..."
                    placeholderTextColor="#94a3b8"
                    multiline
                />

                <Text style={styles.label}>URL de l'image</Text>
                <TextInput
                    style={styles.input}
                    value={imageUrl}
                    onChangeText={setImageUrl}
                    placeholder="https://example.com/image.png"
                    placeholderTextColor="#94a3b8"
                    keyboardType="url"
                />

                <Text style={styles.label}>Technologies (séparées par des virgules)</Text>
                <TextInput
                    style={styles.input}
                    value={technologies}
                    onChangeText={setTechnologies}
                    placeholder="React, Node.js, TypeScript"
                    placeholderTextColor="#94a3b8"
                />

                <Text style={styles.label}>URL de la Démo (optionnel)</Text>
                <TextInput
                    style={styles.input}
                    value={demoUrl}
                    onChangeText={setDemoUrl}
                    placeholder="https://project-demo.com"
                    placeholderTextColor="#94a3b8"
                    keyboardType="url"
                />

                <Text style={styles.label}>URL GitHub (optionnel)</Text>
                <TextInput
                    style={styles.input}
                    value={githubUrl}
                    onChangeText={setGithubUrl}
                    placeholder="https://github.com/user/repo"
                    placeholderTextColor="#94a3b8"
                    keyboardType="url"
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
                        <ActivityIndicator color="#ffffff" />
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
    statusContainer: {
        flexDirection: 'row',
        marginBottom: 30,
        gap: 8,
    },
    statusOption: {
        flex: 1,
        backgroundColor: '#f1f5f9',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    statusActive: {
        backgroundColor: '#0f172a',
        borderColor: '#0f172a',
    },
    statusText: {
        color: '#475569',
        fontSize: 14,
        fontWeight: '600',
    },
    statusTextActive: {
        color: '#ffffff',
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

export default AddProjectScreen;
