import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSurvey } from '../../context/SurveyContext';
import { Colors, Shadows } from '../../constants/Colors';

export default function LocationScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { updateDraft, setClipboardData } = useSurvey();

  const fetchLocation = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setIsLoading(false);
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    } catch {
      setErrorMsg('Failed to fetch location. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  const handleCopyLocation = async () => {
    if (location) {
      const locString = `Lat: ${location.coords.latitude}, Lon: ${location.coords.longitude}`;
      await Clipboard.setStringAsync(locString);
      setClipboardData(locString); // sync with app state
      Alert.alert('Success', 'Location copied to clipboard!');
    }
  };

  const handleSave = () => {
    if (location) {
      updateDraft({
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy,
        }
      });
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Current Location</Text>

      <View style={[styles.card, Shadows.md]}>
        {isLoading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Fetching GPS Coordinates...</Text>
          </View>
        ) : errorMsg ? (
          <View style={styles.centerBox}>
            <Ionicons name="warning-outline" size={48} color={Colors.error} />
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : location ? (
          <View>
            <View style={styles.dataRow}>
              <View style={styles.dataIconBox}>
                <Ionicons name="map" size={24} color={Colors.primary} />
              </View>
              <View style={styles.dataInfo}>
                <Text style={styles.dataLabel}>Latitude</Text>
                <Text style={styles.dataValue}>{location.coords.latitude.toFixed(6)}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.dataRow}>
              <View style={styles.dataIconBox}>
                <Ionicons name="compass" size={24} color={Colors.primary} />
              </View>
              <View style={styles.dataInfo}>
                <Text style={styles.dataLabel}>Longitude</Text>
                <Text style={styles.dataValue}>{location.coords.longitude.toFixed(6)}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.dataRow}>
              <View style={styles.dataIconBox}>
                <Ionicons name="locate" size={24} color={Colors.secondary} />
              </View>
              <View style={styles.dataInfo}>
                <Text style={styles.dataLabel}>Accuracy</Text>
                <Text style={styles.dataValue}>{location.coords.accuracy ? `±${location.coords.accuracy.toFixed(2)} meters` : 'Unknown'}</Text>
              </View>
            </View>
          </View>
        ) : null}
      </View>

      <View style={styles.actionsContainer}>
        <Pressable 
          style={[styles.actionButton, styles.secondaryButton, Shadows.sm, isLoading && styles.disabled]} 
          onPress={fetchLocation}
          disabled={isLoading}
        >
          <Ionicons name="refresh" size={20} color={Colors.primary} />
          <Text style={styles.secondaryButtonText}>Refresh Location</Text>
        </Pressable>

        <Pressable 
          style={[styles.actionButton, styles.secondaryButton, Shadows.sm, (!location || isLoading) && styles.disabled]} 
          onPress={handleCopyLocation}
          disabled={!location || isLoading}
        >
          <Ionicons name="copy-outline" size={20} color={Colors.primary} />
          <Text style={styles.secondaryButtonText}>Copy to Clipboard</Text>
        </Pressable>

        <Pressable 
          style={[styles.actionButton, styles.primaryButton, Shadows.sm, (!location || isLoading) && styles.disabled]} 
          onPress={handleSave}
          disabled={!location || isLoading}
        >
          <Ionicons name="checkmark" size={20} color={Colors.surface} />
          <Text style={styles.primaryButtonText}>Save to Survey</Text>
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
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    minHeight: 250,
    justifyContent: 'center',
    marginBottom: 24,
  },
  centerBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: Colors.textMuted,
    fontSize: 16,
  },
  errorText: {
    marginTop: 16,
    color: Colors.error,
    textAlign: 'center',
    fontSize: 16,
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  dataIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  dataInfo: {
    flex: 1,
  },
  dataLabel: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  dataValue: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 64,
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
  },
  secondaryButton: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  primaryButtonText: {
    color: Colors.surface,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  disabled: {
    opacity: 0.5,
  },
});
