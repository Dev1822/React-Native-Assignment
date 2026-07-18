import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSurvey } from '../../../context/SurveyContext';
import { Colors, Shadows } from '../../../constants/Colors';

export default function CreateSurvey() {
  const router = useRouter();
  const { draft, updateDraft } = useSurvey();

  const [errors, setErrors] = useState({});

  const priorities = ['Low', 'Medium', 'High'];

  const validate = () => {
    let valid = true;
    let newErrors = {};

    if (!draft.siteName.trim()) {
      newErrors.siteName = 'Site Name is required';
      valid = false;
    }
    if (!draft.clientName.trim()) {
      newErrors.clientName = 'Client Name is required';
      valid = false;
    }
    if (!draft.description.trim()) {
      newErrors.description = 'Description is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleNext = () => {
    if (validate()) {
      router.push('/survey-preview');
    } else {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Survey Details</Text>
      <Text style={styles.subtitle}>Fill in the basic information to start your survey.</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Site Name *</Text>
        <TextInput
          style={[styles.input, errors.siteName && styles.inputError]}
          placeholder="e.g. Downtown Plaza"
          value={draft.siteName}
          onChangeText={(text) => {
            updateDraft({ siteName: text });
            if (errors.siteName) setErrors({ ...errors, siteName: '' });
          }}
        />
        {errors.siteName && <Text style={styles.errorText}>{errors.siteName}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Client Name *</Text>
        <TextInput
          style={[styles.input, errors.clientName && styles.inputError]}
          placeholder="e.g. Acme Corp"
          value={draft.clientName}
          onChangeText={(text) => {
            updateDraft({ clientName: text });
            if (errors.clientName) setErrors({ ...errors, clientName: '' });
          }}
        />
        {errors.clientName && <Text style={styles.errorText}>{errors.clientName}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea, errors.description && styles.inputError]}
          placeholder="Brief description of the survey..."
          multiline
          numberOfLines={4}
          value={draft.description}
          onChangeText={(text) => {
            updateDraft({ description: text });
            if (errors.description) setErrors({ ...errors, description: '' });
          }}
        />
        {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Priority *</Text>
        <View style={styles.priorityContainer}>
          {priorities.map((p) => (
            <Pressable
              key={p}
              style={[
                styles.priorityButton,
                draft.priority === p && styles.prioritySelected,
                draft.priority === p && { backgroundColor: p === 'High' ? Colors.error : p === 'Medium' ? Colors.warning : Colors.success }
              ]}
              onPress={() => updateDraft({ priority: p })}
            >
              <Text style={[styles.priorityText, draft.priority === p && styles.priorityTextSelected]}>{p}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Attachments Section */}
      <Text style={styles.sectionTitle}>Attachments</Text>
      
      <Pressable style={[styles.attachmentCard, Shadows.sm]} onPress={() => router.push('/(drawer)/camera')}>
        <View style={styles.attachmentIcon}>
          <Ionicons name="camera" size={24} color={draft.photoUri ? Colors.success : Colors.primary} />
        </View>
        <View style={styles.attachmentInfo}>
          <Text style={styles.attachmentTitle}>Photo</Text>
          <Text style={styles.attachmentSub}>{draft.photoUri ? 'Photo captured' : 'Tap to take a photo'}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color={Colors.textMuted} />
      </Pressable>

      <Pressable style={[styles.attachmentCard, Shadows.sm]} onPress={() => router.push('/(drawer)/location')}>
        <View style={styles.attachmentIcon}>
          <Ionicons name="location" size={24} color={draft.location ? Colors.success : Colors.primary} />
        </View>
        <View style={styles.attachmentInfo}>
          <Text style={styles.attachmentTitle}>Location</Text>
          <Text style={styles.attachmentSub}>{draft.location ? 'Location saved' : 'Tap to get location'}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color={Colors.textMuted} />
      </Pressable>

      <Pressable style={[styles.attachmentCard, Shadows.sm]} onPress={() => router.push('/(drawer)/contacts')}>
        <View style={styles.attachmentIcon}>
          <Ionicons name="people" size={24} color={draft.contact ? Colors.success : Colors.primary} />
        </View>
        <View style={styles.attachmentInfo}>
          <Text style={styles.attachmentTitle}>Contact</Text>
          <Text style={styles.attachmentSub}>{draft.contact ? draft.contact.name : 'Tap to select contact'}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color={Colors.textMuted} />
      </Pressable>

      <Pressable style={[styles.submitButton, Shadows.md]} onPress={handleNext}>
        <Text style={styles.submitButtonText}>Review & Submit</Text>
        <Ionicons name="arrow-forward" size={20} color={Colors.surface} />
      </Pressable>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: Colors.text,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  prioritySelected: {
    borderColor: 'transparent',
  },
  priorityText: {
    fontWeight: '600',
    color: Colors.textMuted,
  },
  priorityTextSelected: {
    color: Colors.surface,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 12,
  },
  attachmentCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  attachmentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  attachmentInfo: {
    flex: 1,
  },
  attachmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  attachmentSub: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 24,
  },
  submitButtonText: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});
