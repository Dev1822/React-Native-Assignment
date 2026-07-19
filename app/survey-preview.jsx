import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSurvey } from '../context/SurveyContext';
import { Colors, Shadows } from '../constants/Colors';
import { format } from 'date-fns';

export default function SurveyPreview() {
  const router = useRouter();
  const { draft, submitSurvey } = useSurvey();

  const handleEdit = () => {
    router.back();
  };

  const handleSubmit = () => {
    Alert.alert(
      'Submit Survey',
      'Are you sure you want to submit this survey?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Submit', 
          onPress: () => {
            submitSurvey();
            // navigate to History tab via drawer route
            router.replace('/(drawer)/(tabs)/history');
          } 
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={[styles.card, Shadows.sm]}>
          <Text style={styles.sectionTitle}>Basic Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Site Name:</Text>
            <Text style={styles.value}>{draft.siteName || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Client Name:</Text>
            <Text style={styles.value}>{draft.clientName || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Priority:</Text>
            <View style={[styles.priorityBadge, { backgroundColor: draft.priority === 'High' ? Colors.error : draft.priority === 'Medium' ? Colors.warning : Colors.success }]}>
              <Text style={styles.priorityText}>{draft.priority}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>{format(draft.date, 'MMM dd, yyyy')}</Text>
          </View>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.valueBox}>{draft.description || 'N/A'}</Text>
        </View>

        <View style={[styles.card, Shadows.sm]}>
          <Text style={styles.sectionTitle}>Attachments</Text>
          
          <Text style={styles.subTitle}>Photo</Text>
          {draft.photoUri ? (
            <Image source={{ uri: draft.photoUri }} style={styles.photo} />
          ) : (
            <Text style={styles.noneText}>No photo attached.</Text>
          )}

          <View style={styles.divider} />

          <Text style={styles.subTitle}>Location</Text>
          {draft.location ? (
            <View style={styles.locationBox}>
              <Ionicons name="location" size={20} color={Colors.primary} />
              <Text style={styles.locationText}>
                {draft.location.latitude.toFixed(6)}, {draft.location.longitude.toFixed(6)}
              </Text>
            </View>
          ) : (
            <Text style={styles.noneText}>No location captured.</Text>
          )}

          <View style={styles.divider} />

          <Text style={styles.subTitle}>Contact</Text>
          {draft.contact ? (
            <View style={styles.contactBox}>
              <Ionicons name="person" size={20} color={Colors.primary} />
              <Text style={styles.contactText}>
                {draft.contact.name} ({draft.contact.number})
              </Text>
            </View>
          ) : (
            <Text style={styles.noneText}>No contact attached.</Text>
          )}
        </View>

        <View style={[styles.card, Shadows.sm]}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <Text style={styles.valueBox}>{draft.notes || 'No notes added.'}</Text>
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={[styles.actionBtn, styles.editBtn]} onPress={handleEdit}>
          <Ionicons name="create-outline" size={20} color={Colors.primary} />
          <Text style={styles.editBtnText}>Edit</Text>
        </Pressable>
        <Pressable style={[styles.actionBtn, styles.submitBtn]} onPress={handleSubmit}>
          <Ionicons name="cloud-upload-outline" size={20} color={Colors.surface} />
          <Text style={styles.submitBtnText}>Submit Survey</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    width: 100,
    fontSize: 14,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  value: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  valueBox: {
    fontSize: 15,
    color: Colors.text,
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    lineHeight: 22,
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: Colors.surface,
    fontWeight: 'bold',
    fontSize: 12,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  noneText: {
    fontStyle: 'italic',
    color: Colors.textMuted,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 16,
  },
  locationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 8,
  },
  locationText: {
    marginLeft: 8,
    color: Colors.text,
    fontWeight: '500',
  },
  contactBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 8,
  },
  contactText: {
    marginLeft: 8,
    color: Colors.text,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 16,
  },
  editBtn: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.primary,
    marginRight: 12,
  },
  editBtnText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
  },
  submitBtnText: {
    color: Colors.surface,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});
