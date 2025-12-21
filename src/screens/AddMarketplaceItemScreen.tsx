// mobile/src/screens/AddMarketplaceItemScreen.tsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Switch } from 'react-native';
import { adminService } from '../services/api';
import { useNavigation } from '@react-navigation/native';

const AddMarketplaceItemScreen = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [icon, setIcon] = useState('');
    const [price, setPrice] = useState('');
    const [period, setPeriod] = useState('/mois');
    const [category, setCategory] = useState('');
    const [features, setFeatures] = useState('');
    const [popular, setPopular] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!name || !description || !icon || !price || !category || !features) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
            return;
        }

        setLoading(true);
        try {
            await adminService.createMarketplaceItem({
                name, description, icon, price, period, category, features, popular
            });
            Alert.alert('Succès', 'Article de marketplace ajouté avec succès !');
            navigation.goBack();
        } catch (error) {
            console.error('Erreur lors de la création:', error);
            Alert.alert('Erreur', 'Impossible de créer l\'article.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
            <View style={styles.form}>
                <Text style={styles.label}>Nom de l\'API</Text>
                <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Ex: Payment Gateway API" placeholderTextColor="#94a3b8" />

                <Text style={styles.label}>Description</Text>
                <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} placeholder="Description courte de l\'API..." placeholderTextColor="#94a3b8" multiline />

                <Text style={styles.label}>Icône (Nom Lucide)</Text>
                <TextInput style={styles.input} value={icon} onChangeText={setIcon} placeholder="Ex: Zap" placeholderTextColor="#94a3b8" />

                <View style={styles.row}>
                    <View style={styles.priceContainer}>
                        <Text style={styles.label}>Prix</Text>
                        <TextInput style={styles.input} value={price} onChangeText={setPrice} placeholder="Ex: €49" placeholderTextColor="#94a3b8" />
                    </View>
                    <View style={styles.periodContainer}>
                        <Text style={styles.label}>Période</Text>
                        <TextInput style={styles.input} value={period} onChangeText={setPeriod} placeholder="/mois" placeholderTextColor="#94a3b8" />
                    </View>
                </View>

                <Text style={styles.label}>Catégorie</Text>
                <TextInput style={styles.input} value={category} onChangeText={setCategory} placeholder="Ex: Finance" placeholderTextColor="#94a3b8" />

                <Text style={styles.label}>Fonctionnalités (séparées par des virgules)</Text>
                <TextInput style={[styles.input, styles.textArea]} value={features} onChangeText={setFeatures} placeholder="Feature 1, Feature 2, Feature 3" placeholderTextColor="#94a3b8" multiline />

                <View style={styles.switchContainer}>
                    <Text style={styles.label}>Populaire ?</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={popular ? "#0ea5e9" : "#f4f3f4"}
                        onValueChange={setPopular}
                        value={popular}
                    />
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
                    {loading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.saveButtonText}>Enregistrer</Text>}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ffffff' },
    form: { padding: 24 },
    label: { color: '#334155', fontSize: 14, marginBottom: 8, fontWeight: '600' },
    input: { backgroundColor: '#f8fafc', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, color: '#0f172a', marginBottom: 20, borderWidth: 1, borderColor: '#e2e8f0', fontSize: 16 },
    textArea: { minHeight: 100, textAlignVertical: 'top' },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    priceContainer: { flex: 1, marginRight: 8 },
    periodContainer: { flex: 1, marginLeft: 8 },
    switchContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    saveButton: { backgroundColor: '#0f172a', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    saveButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
});

export default AddMarketplaceItemScreen;
