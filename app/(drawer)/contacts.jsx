import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import * as Contacts from 'expo-contacts';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSurvey } from '../../context/SurveyContext';
import { Colors, Shadows } from '../../constants/Colors';

export default function ContactsScreen() {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  
  const router = useRouter();
  const { updateDraft, setClipboardData } = useSurvey();

  const fetchContacts = async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        setPermissionGranted(true);
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name],
          sort: Contacts.SortTypes.FirstName,
        });
        const validContacts = data.filter(c => {
          const name = c.name || '';
          return name !== 'null null' && name.trim() !== '';
        });
        setContacts(validContacts);
      } else {
        setPermissionGranted(false);
        Alert.alert('Permission Denied', 'Unable to access contacts.');
      }
    } catch {
      Alert.alert('Error', 'Failed to fetch contacts');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const filteredContacts = useMemo(() => {
    if (!searchQuery) return contacts;
    return contacts.filter(c => 
      c.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [contacts, searchQuery]);

  const handleCopyNumber = async (number: string) => {
    await Clipboard.setStringAsync(number);
    setClipboardData(number);
    Alert.alert('Copied', `Phone number ${number} copied to clipboard!`);
  };

  const handleSelectContact = (contact) => {
    const number = contact.phoneNumbers && contact.phoneNumbers.length > 0 ? contact.phoneNumbers[0].number : 'No Number';
    updateDraft({
      contact: {
        name: contact.name || 'Unknown',
        number: number || 'No Number',
      }
    });
    router.back();
  };

  const renderItem = ({ item }) => {
    const initial = item.name ? item.name.charAt(0).toUpperCase() : '?';
    const number = item.phoneNumbers && item.phoneNumbers.length > 0 ? item.phoneNumbers[0].number : 'No Number';

    return (
      <Pressable style={styles.contactCard} onPress={() => handleSelectContact(item)}>
        <View style={[styles.avatar, { backgroundColor: Colors.primary }]}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{item.name}</Text>
          <Text style={styles.contactNumber}>{number}</Text>
        </View>
        {number !== 'No Number' && (
          <Pressable style={styles.copyBtn} onPress={() => handleCopyNumber(number)}>
            <Ionicons name="copy-outline" size={20} color={Colors.primary} />
          </Pressable>
        )}
      </Pressable>
    );
  };

  if (!permissionGranted && !isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="people-outline" size={64} color={Colors.textMuted} />
        <Text style={styles.message}>We need your permission to view contacts</Text>
        <Pressable style={styles.permissionBtn} onPress={() => fetchContacts()}>
          <Text style={styles.permissionBtnText}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={Colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search contacts..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <Text style={styles.counterText}>
          Total Contacts: {filteredContacts.length}
        </Text>
      </View>

      {isLoading && !isRefreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.id || Math.random().toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={() => fetchContacts(true)} tintColor={Colors.primary} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="person-outline" size={48} color={Colors.border} />
              <Text style={styles.emptyText}>No contacts found.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.background,
  },
  message: {
    textAlign: 'center',
    marginVertical: 16,
    fontSize: 16,
    color: Colors.text,
  },
  permissionBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  permissionBtnText: {
    color: Colors.surface,
    fontWeight: 'bold',
    fontSize: 16,
  },
  header: {
    padding: 20,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
  },
  counterText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  listContent: {
    padding: 20,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...Shadows.sm,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: Colors.surface,
    fontSize: 20,
    fontWeight: 'bold',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  contactNumber: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  copyBtn: {
    padding: 8,
    backgroundColor: '#EEF2FF',
    borderRadius: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textMuted,
  },
});
