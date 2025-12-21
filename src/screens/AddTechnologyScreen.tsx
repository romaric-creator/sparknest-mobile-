// mobile/src/screens/AddTechnologyScreen.tsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { adminService } from '../services/api';
import { useNavigation } from '@react-navigation/native';

const AddTechnologyScreen = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [icon, setIcon] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!name || !icon) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
            return;
        }

        setLoading(true);
        try {
            await adminService.createTechnology({ name, icon });
            Alert.alert('Succès', 'Technologie ajoutée avec succès !');
            navigation.goBack();
        } catch (error) {
            console.error('Erreur lors de la création de la technologie:', error);
            Alert.alert('Erreur', 'Impossible de créer la technologie.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
            <View style={styles.form}>
                <Text style={styles.label}>Nom de la technologie</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Ex: React"
                    placeholderTextColor="#94a3b8"
                />

                <Text style={styles.label}>Icône (URL ou nom)</Text>
                <TextInput
                    style={styles.input}
                    value={icon}
                    onChangeText={setIcon}
                    placeholder="URL de l'icône SVG ou nom de l'icône"
                    placeholderTextColor="#94a3b8"
                />

                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#ffffff" />
                    ) : (
                        <Text style={styles.saveButtonText}>Enregistrer la technologie</Text>
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

export default AddTechnologyScreen;
