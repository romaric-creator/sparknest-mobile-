import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { adminService } from '../services/api';

const AddArticleScreen = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!title || !category || !content) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
            return;
        }

        setLoading(true);
        try {
            await adminService.createArticle({ title, category, content });
            Alert.alert('Succès', 'Article ajouté avec succès !');
            navigation.goBack();
        } catch (error) {
            console.error('Erreur lors de la création de l\'article:', error);
            Alert.alert('Erreur', 'Impossible de créer l\'article.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.label}>Titre</Text>
                <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Titre de l'article"
                    placeholderTextColor="#64748b"
                />

                <Text style={styles.label}>Catégorie</Text>
                <TextInput
                    style={styles.input}
                    value={category}
                    onChangeText={setCategory}
                    placeholder="Ex: Technologie, Design..."
                    placeholderTextColor="#64748b"
                />

                <Text style={styles.label}>Contenu</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={content}
                    onChangeText={setContent}
                    placeholder="Contenu de l'article..."
                    placeholderTextColor="#64748b"
                    multiline
                    numberOfLines={10}
                    textAlignVertical="top"
                />

                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#020617" />
                    ) : (
                        <Text style={styles.saveButtonText}>Enregistrer</Text>
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
        height: 200,
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

export default AddArticleScreen;
