import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Alert, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSurvey } from '../../context/SurveyContext';
import { Colors } from '../../constants/Colors';
import { format } from 'date-fns';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState(null);
  const [captureTime, setCaptureTime] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef(null);
  const router = useRouter();
  const { updateDraft } = useSurvey();

  if (!permission) {
    // Camera permissions are still loading.
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="camera-outline" size={64} color={Colors.textMuted} style={styles.icon} />
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Pressable style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      setIsProcessing(true);
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setPhotoUri(photo.uri);
        setCaptureTime(new Date());
      } catch {
        Alert.alert('Error', 'Failed to take picture');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleRetake = () => {
    setPhotoUri(null);
    setCaptureTime(null);
  };

  const handleDelete = () => {
    Alert.alert('Delete Photo', 'Are you sure you want to delete this photo?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: handleRetake },
    ]);
  };

  const handleSave = () => {
    if (photoUri) {
      updateDraft({ photoUri });
      router.back();
    }
  };

  if (photoUri) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photoUri }} style={styles.preview} />
        <View style={styles.overlayTop}>
          <Text style={styles.captureTimeText}>
            Captured: {captureTime ? format(captureTime, 'MMM dd, yyyy h:mm a') : ''}
          </Text>
        </View>
        <View style={styles.previewControls}>
          <Pressable style={styles.controlButton} onPress={handleDelete}>
            <Ionicons name="trash" size={28} color={Colors.surface} />
            <Text style={styles.controlText}>Delete</Text>
          </Pressable>
          <Pressable style={[styles.controlButton, styles.primaryControl]} onPress={handleSave}>
            <Ionicons name="checkmark-circle" size={40} color={Colors.surface} />
            <Text style={styles.controlText}>Save to Survey</Text>
          </Pressable>
          <Pressable style={styles.controlButton} onPress={handleRetake}>
            <Ionicons name="refresh" size={28} color={Colors.surface} />
            <Text style={styles.controlText}>Retake</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="back" ref={cameraRef} />
      <View style={styles.cameraControls}>
        {isProcessing ? (
          <ActivityIndicator size="large" color={Colors.surface} />
        ) : (
          <Pressable style={styles.captureButton} onPress={takePicture}>
            <View style={styles.captureInner} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.background,
  },
  icon: {
    marginBottom: 16,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 24,
    fontSize: 16,
    color: Colors.text,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: {
    color: Colors.surface,
    fontWeight: 'bold',
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cameraControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.surface,
  },
  preview: {
    flex: 1,
    width: '100%',
  },
  overlayTop: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureTimeText: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: 'hidden',
    fontWeight: 'bold',
  },
  previewControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingBottom: 40,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingTop: 20,
  },
  controlButton: {
    alignItems: 'center',
  },
  primaryControl: {
    transform: [{ translateY: -10 }],
  },
  controlText: {
    color: Colors.surface,
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
  },
});
