import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSurvey } from '../../../context/SurveyContext';
import { Colors, Shadows } from '../../../constants/Colors';
import { isToday } from 'date-fns';

export default function Dashboard() {
  const router = useRouter();
  const { history } = useSurvey();

  const todayCount = history.filter(s => isToday(new Date(s.submittedAt))).length;
  const recentSurvey = history.length > 0 ? history[0] : null;

  const navigateTo = (route: string) => {
    router.push(route as any);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Welcome Header */}
      <View style={styles.welcomeSection}>
        <Text style={styles.greeting}>Welcome back,</Text>
        <Text style={styles.studentName}>Dev Patel (Student ID: 12345)</Text>
      </View>

      {/* Stats Card */}
      <View style={[styles.card, styles.statsCard, Shadows.md]}>
        <View style={styles.statsHeader}>
          <Ionicons name="stats-chart" size={24} color={Colors.surface} />
          <Text style={styles.statsTitle}>Today&apos;s Surveys</Text>
        </View>
        <Text style={styles.statsNumber}>{todayCount}</Text>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        <Pressable style={({pressed}) => [styles.actionCard, pressed && styles.actionPressed, Shadows.sm]} onPress={() => navigateTo('/(drawer)/(tabs)/survey')}>
          <View style={[styles.iconContainer, { backgroundColor: '#E0E7FF' }]}>
            <Ionicons name="add-circle" size={32} color={Colors.primary} />
          </View>
          <Text style={styles.actionText}>New Survey</Text>
        </Pressable>
        
        <Pressable style={({pressed}) => [styles.actionCard, pressed && styles.actionPressed, Shadows.sm]} onPress={() => navigateTo('/(drawer)/camera')}>
          <View style={[styles.iconContainer, { backgroundColor: '#D1FAE5' }]}>
            <Ionicons name="camera" size={32} color={Colors.secondary} />
          </View>
          <Text style={styles.actionText}>Camera</Text>
        </Pressable>

        <Pressable style={({pressed}) => [styles.actionCard, pressed && styles.actionPressed, Shadows.sm]} onPress={() => navigateTo('/(drawer)/location')}>
          <View style={[styles.iconContainer, { backgroundColor: '#FEF3C7' }]}>
            <Ionicons name="location" size={32} color={Colors.warning} />
          </View>
          <Text style={styles.actionText}>Location</Text>
        </Pressable>

        <Pressable style={({pressed}) => [styles.actionCard, pressed && styles.actionPressed, Shadows.sm]} onPress={() => navigateTo('/(drawer)/contacts')}>
          <View style={[styles.iconContainer, { backgroundColor: '#FEE2E2' }]}>
            <Ionicons name="people" size={32} color={Colors.error} />
          </View>
          <Text style={styles.actionText}>Contacts</Text>
        </Pressable>
      </View>

      {/* Recent Survey Summary */}
      <Text style={styles.sectionTitle}>Recent Survey</Text>
      {recentSurvey ? (
        <Pressable style={[styles.card, Shadows.sm]} onPress={() => navigateTo('/(drawer)/(tabs)/history')}>
          <View style={styles.recentHeader}>
            <Text style={styles.recentTitle}>{recentSurvey.siteName}</Text>
            <View style={[styles.priorityBadge, { backgroundColor: recentSurvey.priority === 'High' ? Colors.error : recentSurvey.priority === 'Medium' ? Colors.warning : Colors.success }]}>
              <Text style={styles.priorityText}>{recentSurvey.priority}</Text>
            </View>
          </View>
          <Text style={styles.recentClient}>{recentSurvey.clientName}</Text>
          <Text style={styles.recentDate}>{new Date(recentSurvey.submittedAt).toLocaleDateString()}</Text>
        </Pressable>
      ) : (
        <View style={[styles.card, styles.emptyCard, Shadows.sm]}>
          <Text style={styles.emptyText}>No recent surveys. Start one today!</Text>
        </View>
      )}
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
  welcomeSection: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  studentName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  statsCard: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsTitle: {
    color: Colors.surface,
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  statsNumber: {
    color: Colors.surface,
    fontSize: 32,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  actionCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    width: '47%',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
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
  recentClient: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  recentDate: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyText: {
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
});
