import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { authService } from '../services/api';
import { useNavigation } from '@react-navigation/native';
// import { User, Mail, Lock } from 'lucide-react-native'; // Remove lucide-react-native imports
import Icon from '../components/Icon'; // Our custom Lucide Icon wrapper
import { RootStackNavigationProp } from '../types/navigation'; // Import the type

const RegisterScreen = () => {
    const navigation = useNavigation<RootStackNavigationProp<'Register'>>(); // Type the navigation hook
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
            return;
        }

        setLoading(true);
        try {
            const response = await authService.register({ name, email, password });
            Alert.alert('Succès', response.message || 'Compte créé avec succès !');
            navigation.navigate('Login');
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error.response?.data || error.message);
            Alert.alert('Erreur', error.response?.data?.message || 'Une erreur est survenue lors de l\'inscription.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
                <Text style={styles.title}>Créer un compte</Text>
                <Text style={styles.subtitle}>Rejoignez le back-office de SparkNest.</Text>
            </View>

            <View style={styles.form}>
                <View style={styles.inputContainer}>
                    <Icon name="User" color="#94a3b8" size={20} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Nom complet"
                        placeholderTextColor="#94a3b8"
                        autoCapitalize="words"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="Mail" color="#94a3b8" size={20} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Adresse e-mail"
                        placeholderTextColor="#94a3b8"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="Lock" color="#94a3b8" size={20} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Mot de passe"
                        placeholderTextColor="#94a3b8"
                        secureTextEntry
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="Lock" color="#94a3b8" size={20} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Confirmer le mot de passe"
                        placeholderTextColor="#94a3b8"
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity
                    style={styles.registerButton}
                    onPress={handleRegister}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#ffffff" />
                    ) : (
                        <Text style={styles.registerButtonText}>S\'inscrire</Text>
                    )}
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Déjà un compte ? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginLink}>Se connecter</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F2F5', // Light background for a cleaner look
    },
    contentContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center', // Center content horizontally
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 48, // Increased spacing
    },
    title: {
        fontSize: 36, // Slightly larger title
        fontWeight: '700', // Bolder
        color: '#2C3E50', // Darker text for contrast
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: '#7F8C8D', // Muted subtitle color
        textAlign: 'center',
        lineHeight: 24,
    },
    form: {
        width: '100%',
        maxWidth: 360, // Max width for form on larger screens
        backgroundColor: '#FFFFFF',
        borderRadius: 12, // Slightly more rounded corners
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5, // Android shadow
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA', // Lighter input background
        borderRadius: 8,
        marginBottom: 16,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0', // Subtle border
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        height: 52, // Slightly taller input fields
        color: '#2C3E50',
        fontSize: 16,
    },
    registerButton: {
        backgroundColor: '#3498DB', // A professional blue
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 24, // Increased spacing
        shadowColor: '#3498DB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 3,
    },
    registerButtonText: {
        color: '#ffffff',
        fontSize: 18, // Slightly larger button text
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 40, // Increased spacing
    },
    footerText: {
        color: '#7F8C8D',
        fontSize: 14,
    },
    loginLink: {
        color: '#3498DB', // Matching the button blue
        fontSize: 14,
        fontWeight: '600',
    },
});

export default RegisterScreen;
