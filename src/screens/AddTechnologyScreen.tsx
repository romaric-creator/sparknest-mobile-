import React, { useState } from 'react';
import { 
    StyleSheet, 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    ScrollView, 
    ActivityIndicator, 
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { adminService } from '../services/api';
import { useNavigation } from '@react-navigation/native';
import IconPickerModal from '../components/IconPickerModal';
import Icon from '../components/Icon';
import { RootStackNavigationProp } from '../types/navigation'; // Import the type

const AddTechnologyScreen = () => {
    const navigation = useNavigation<RootStackNavigationProp<'AddTechnology'>>(); // Type the navigation hook
    const [name, setName] = useState('');
    const [icon, setIcon] = useState('');
    const [loading, setLoading] = useState(false);
    const [isIconModalVisible, setIsIconModalVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const handleSave = async () => {
        if (!name || !icon) {
            Alert.alert('Champs requis', 'Veuillez donner un nom et choisir une icône pour cette technologie.');
            return;
        }

        setLoading(true);
        try {
            await adminService.createTechnology({ name, icon });
            Alert.alert('Succès', 'La technologie a été ajoutée au catalogue.');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de créer la technologie.');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectIcon = (selectedIconName: string) => {
        setIcon(selectedIconName);
        setIsIconModalVisible(false);
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Stack Technique</Text>
                    <Text style={styles.headerSubtitle}>Ajoutez un nouvel outil à vos compétences.</Text>
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>Nom de la technologie</Text>
                    <TextInput
                        style={[styles.input, isFocused && styles.inputFocused]}
                        value={name}
                        onChangeText={setName}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Ex: React Native, GraphQL..."
                        placeholderTextColor="#94a3b8"
                    />

                    <Text style={styles.label}>Représentation visuelle</Text>
                    {/* New helper text */}
                    <Text style={styles.helperText}>
                        Choisissez une icône Lucide. Recherchez des termes comme "Code", "Server", "Atom" sur lucide.dev/icons.
                    </Text>
                    <TouchableOpacity
                        style={[styles.iconCard, icon ? styles.iconCardActive : null]}
                        onPress={() => setIsIconModalVisible(true)}
                        activeOpacity={0.7}
                    >
                        {icon ? (
                            <View style={styles.selectedContainer}>
                                <View style={styles.iconCircle}>
                                    <Icon name={icon as any} size={42} color="#6366F1" />
                                </View>
                                <View style={styles.iconInfo}>
                                    <Text style={styles.iconNameText}>{icon}</Text>
                                    <Text style={styles.changeText}>Appuyer pour changer</Text>
                                </View>
                            </View>
                        ) : (
                            <View style={styles.placeholderContainer}>
                                <View style={styles.placeholderCircle}>
                                    <Icon name="Plus" size={24} color="#94a3b8" />
                                </View>
                                <Text style={styles.placeholderText}>Choisir une icône Lucide</Text> {/* Updated placeholder */}
                            </View>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.saveButton, loading && styles.buttonDisabled]}
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

            <IconPickerModal
                isVisible={isIconModalVisible}
                onClose={() => setIsIconModalVisible(false)}
                onSelectIcon={handleSelectIcon}
                selectedIcon={icon}
            />
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    scrollContent: {
        flexGrow: 1,
    },
    header: {
        padding: 24,
        paddingTop: 60,
        backgroundColor: '#FFFFFF',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: '#0F172A',
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 15,
        color: '#64748B',
        marginTop: 4,
    },
    form: {
        padding: 24,
    },
    label: {
        color: '#475569',
        fontSize: 13,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 12,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 16,
        color: '#0F172A',
        marginBottom: 28,
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        fontSize: 16,
    },
    inputFocused: {
        borderColor: '#6366F1',
    },
    iconCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 40,
        borderWidth: 2,
        borderColor: '#E2E8F0',
        borderStyle: 'dashed', // Donne un aspect "zone de sélection"
    },
    iconCardActive: {
        borderColor: '#6366F1',
        borderStyle: 'solid',
        backgroundColor: '#F5F7FF',
    },
    placeholderContainer: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    placeholderCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    placeholderText: {
        color: '#94a3b8',
        fontSize: 15,
        fontWeight: '600',
    },
    selectedContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconCircle: {
        width: 70,
        height: 70,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    iconInfo: {
        marginLeft: 20,
    },
    iconNameText: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0F172A',
    },
    changeText: {
        fontSize: 13,
        color: '#6366F1',
        marginTop: 4,
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: '#0F172A',
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 4,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
    },
    helperText: {
        color: '#64748B',
        fontSize: 12,
        marginBottom: 12,
        textAlign: 'center',
    },
});

export default AddTechnologyScreen;