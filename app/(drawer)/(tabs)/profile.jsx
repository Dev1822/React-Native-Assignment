import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Shadows } from '../../../constants/Colors';
import { useSurvey } from '../../../context/SurveyContext';

export default function Profile() {
  const router = useRouter();
  const { userProfile } = useSurvey();

  const initials = userProfile.name 
    ? userProfile.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : '?';
  return (
    <View style={styles.container}>
      <View style={[styles.card, Shadows.md]}>
        <View style={styles.avatarContainer}>
          {userProfile.photoUri ? (
            <Image source={{ uri: userProfile.photoUri }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>{initials}</Text>
          )}
        </View>
        <Text style={styles.name}>{userProfile.name || 'Anonymous'}</Text>
        <Text style={styles.studentId}>Student ID: 12345</Text>
        <Text style={styles.course}>React Native App Development</Text>

        <View style={styles.divider} />

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Total Surveys</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>4</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
        </View>

        <Pressable style={styles.editButton} onPress={() => router.push('/(drawer)/settings')}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
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
    alignItems: 'center',
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 30,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarText: {
    fontSize: 40,
    color: Colors.surface,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  studentId: {
    fontSize: 16,
    color: Colors.textMuted,
    marginBottom: 8,
  },
  course: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: 24,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    width: '100%',
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginBottom: 32,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
    height: '100%',
  },
  editButton: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 20,
  },
  editButtonText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
