import React, { useState, useMemo } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import * as LucideIcons from 'lucide-react-native'; // Import all Lucide icons
import { LucideIcon } from 'lucide-react-native'; // Import LucideIcon type
import { getIconNames } from './iconUtils';

interface IconPickerModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectIcon: (iconName: string) => void;
  selectedIcon?: string;
}

const IconPickerModal: React.FC<IconPickerModalProps> = ({ isVisible, onClose, onSelectIcon, selectedIcon }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const allIconNames = useMemo(() => getIconNames(), []);

  const filteredIconNames = useMemo(() => {
    if (!searchTerm) {
      return allIconNames;
    }
    return allIconNames.filter(name =>
      name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allIconNames]);

  const renderIconItem = ({ item: iconName }: { item: string }) => {
    const isSelected = selectedIcon === iconName;
    const LucideIconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as LucideIcon; // Cast to LucideIcon

    if (!LucideIconComponent) return null; // Should not happen if getIconNames is correct

    return (
      <TouchableOpacity
        style={[styles.iconItem, isSelected && styles.selectedIconItem]}
        onPress={() => onSelectIcon(iconName)}
      >
        <LucideIconComponent
          size={30}
          color={isSelected ? '#0f172a' : '#64748b'}
        />
        <Text style={[styles.iconName, isSelected && styles.selectedIconName]}>{iconName}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sélectionner une Icône</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <LucideIcons.X size={24} color="#0f172a" />
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher une icône..."
          placeholderTextColor="#94a3b8"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        {filteredIconNames.length > 0 ? (
          <FlatList
            data={filteredIconNames}
            renderItem={renderIconItem}
            keyExtractor={(item) => item}
            numColumns={4}
            contentContainerStyle={styles.iconGrid}
          />
        ) : (
          <Text style={styles.noResultsText}>Aucune icône trouvée pour "{searchTerm}"</Text>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  closeButton: {
    padding: 8,
  },
  searchInput: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    margin: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontSize: 16,
    color: '#0f172a',
  },
  iconGrid: {
    padding: 16,
  },
  iconItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedIconItem: {
    backgroundColor: '#e0f2fe', // Light blue background
    borderColor: '#3b82f6', // Blue border
  },
  iconName: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 4,
    textAlign: 'center',
  },
  selectedIconName: {
    fontWeight: 'bold',
    color: '#0f172a',
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#64748b',
  },
});

export default IconPickerModal;
