import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSurvey } from '../../../context/SurveyContext';
import { Colors, Shadows } from '../../../constants/Colors';
import { format } from 'date-fns';

export default function History() {
  const { history, deleteSurvey } = useSurvey();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');

  const filteredHistory = useMemo(() => {
    return history.filter(survey => {
      const matchesSearch = survey.siteName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            survey.clientName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = filterPriority === 'All' || survey.priority === filterPriority;
      return matchesSearch && matchesPriority;
    });
  }, [history, searchQuery, filterPriority]);

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Survey',
      'Are you sure you want to delete this survey?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteSurvey(id) },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={[styles.card, Shadows.sm]}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.siteName}>{item.siteName}</Text>
          <Text style={styles.clientName}>{item.clientName}</Text>
        </View>
        <View style={[styles.priorityBadge, { backgroundColor: item.priority === 'High' ? Colors.error : item.priority === 'Medium' ? Colors.warning : Colors.success }]}>
          <Text style={styles.priorityText}>{item.priority}</Text>
        </View>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.dateText}>{format(new Date(item.submittedAt), 'MMM dd, yyyy')}</Text>
        <View style={styles.actions}>
          <Pressable style={styles.actionButton} onPress={() => {}}>
            <Ionicons name="eye-outline" size={20} color={Colors.primary} />
          </Pressable>
          <Pressable style={styles.actionButton} onPress={() => handleDelete(item.id)}>
            <Ionicons name="trash-outline" size={20} color={Colors.error} />
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search & Filter */}
      <View style={styles.headerControls}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={Colors.textMuted} style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search surveys..." 
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <View style={styles.filterContainer}>
          {['All', 'High', 'Medium', 'Low'].map((p) => (
            <Pressable 
              key={p} 
              style={[styles.filterChip, filterPriority === p && styles.filterChipActive]}
              onPress={() => setFilterPriority(p)}
            >
              <Text style={[styles.filterChipText, filterPriority === p && styles.filterChipTextActive]}>{p}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredHistory}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color={Colors.border} />
            <Text style={styles.emptyText}>No surveys found.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerControls: {
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
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.background,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  filterChipTextActive: {
    color: Colors.surface,
  },
  listContent: {
    padding: 20,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  siteName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  clientName: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: Colors.surface,
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardBody: {
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
  },
  dateText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 16,
    padding: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textMuted,
  },
});
