import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { useSurvey } from '../../context/SurveyContext';
import { Colors, Shadows } from '../../constants/Colors';

export default function ClipboardScreen() {
  const { draft, updateDraft } = useSurvey();
  const [pasteContent, setPasteContent] = useState('');

  const handleCopySurveyID = async () => {
    const id = `SURVEY-${Date.now().toString().slice(-6)}`;
    await Clipboard.setStringAsync(id);
    Alert.alert('Copied', `Survey ID ${id} copied to clipboard!`);
  };

  const handleCopyContactNumber = async () => {
    if (draft.contact && draft.contact.number !== 'No Number') {
      await Clipboard.setStringAsync(draft.contact.number);
      Alert.alert('Copied', `Contact number ${draft.contact.number} copied to clipboard!`);
    } else {
      Alert.alert('No Contact', 'Please select a contact with a valid number in the Survey tab first.');
    }
  };

  const handleCopyLocation = async () => {
    if (draft.location) {
      const locString = `Lat: ${draft.location.latitude}, Lon: ${draft.location.longitude}`;
      await Clipboard.setStringAsync(locString);
      Alert.alert('Copied', `Location copied to clipboard!`);
    } else {
      Alert.alert('No Location', 'Please capture location in the Location tab first.');
    }
  };

  const handlePasteNotes = async () => {
    const content = await Clipboard.getStringAsync();
    setPasteContent(content);
    updateDraft({ notes: content });
    Alert.alert('Pasted', 'Notes pasted successfully.');
  };

  const handleClearClipboard = async () => {
    await Clipboard.setStringAsync('');
    setPasteContent('');
    updateDraft({ notes: '' });
    Alert.alert('Cleared', 'Clipboard data cleared.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clipboard Actions</Text>

      <View style={styles.actionsGrid}>
        <Pressable style={[styles.actionCard, Shadows.sm]} onPress={handleCopySurveyID}>
          <View style={[styles.iconBox, { backgroundColor: '#E0E7FF' }]}>
            <Ionicons name="id-card" size={24} color={Colors.primary} />
          </View>
          <Text style={styles.actionText}>Copy Survey ID</Text>
        </Pressable>

        <Pressable style={[styles.actionCard, Shadows.sm]} onPress={handleCopyContactNumber}>
          <View style={[styles.iconBox, { backgroundColor: '#FEE2E2' }]}>
            <Ionicons name="call" size={24} color={Colors.error} />
          </View>
          <Text style={styles.actionText}>Copy Contact #</Text>
        </Pressable>

        <Pressable style={[styles.actionCard, Shadows.sm]} onPress={handleCopyLocation}>
          <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
            <Ionicons name="location" size={24} color={Colors.warning} />
          </View>
          <Text style={styles.actionText}>Copy Location</Text>
        </Pressable>

        <Pressable style={[styles.actionCard, Shadows.sm]} onPress={handleClearClipboard}>
          <View style={[styles.iconBox, { backgroundColor: '#F3F4F6' }]}>
            <Ionicons name="trash-bin" size={24} color={Colors.textMuted} />
          </View>
          <Text style={styles.actionText}>Clear Clipboard</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Paste Notes</Text>
      <View style={styles.pasteContainer}>
        <TextInput
          style={[styles.textArea, Shadows.sm]}
          placeholder="Pasted notes will appear here..."
          multiline
          numberOfLines={6}
          value={pasteContent || draft.notes}
          editable={false} // read-only, updated via paste button
        />
        <Pressable style={[styles.pasteButton, Shadows.sm]} onPress={handlePasteNotes}>
          <Ionicons name="clipboard" size={20} color={Colors.surface} />
          <Text style={styles.pasteButtonText}>Paste from Clipboard</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 20,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    width: '47%',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  pasteContainer: {
    flex: 1,
  },
  textArea: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    minHeight: 150,
    textAlignVertical: 'top',
    fontSize: 16,
    color: Colors.text,
    marginBottom: 16,
  },
  pasteButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  pasteButtonText: {
    color: Colors.surface,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});
