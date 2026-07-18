import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function CameraScreen() {
  const cameraRef = useRef(null);

  const [permission, requestPermission] = useCameraPermissions();

  const [facing, setFacing] = useState("back");
  const [flash, setFlash] = useState("off");

  const [photo, setPhoto] = useState(null);
  const [captureTime, setCaptureTime] = useState("");

  const [cameraReady, setCameraReady] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Pressable style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Camera Permission</Text>
        </Pressable>
      </View>
    );
  }

  const toggleFlash = () => {
    if (flash === "off") setFlash("on");
    else if (flash === "on") setFlash("auto");
    else setFlash("off");
  };

  const flipCamera = () => {
    setFacing((current) =>
      current === "back" ? "front" : "back"
    );
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      setLoading(true);

      const result = await cameraRef.current.takePictureAsync({
        quality: 1,
      });

      if (result) {
        setPhoto(result.uri);
        setCaptureTime(new Date().toLocaleString());
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to capture image.");
    } finally {
      setLoading(false);
    }
  };

  const retakePhoto = () => {
    setPhoto(null);
    setCaptureTime("");
  };

  const deletePhoto = () => {
    Alert.alert(
      "Delete Photo",
      "Are you sure you want to delete this photo?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setPhoto(null);
            setCaptureTime("");
          },
        },
      ]
    );
  };

  if (photo) {
    return (
      <View style={styles.previewContainer}>
        <Image source={{ uri: photo }} style={styles.image} />

        <Text style={styles.captureText}>
          Captured At
        </Text>

        <Text style={styles.time}>
          {captureTime}
        </Text>

        <Pressable
          style={styles.button}
          onPress={retakePhoto}
        >
          <Text style={styles.buttonText}>
            Retake Photo
          </Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.deleteButton]}
          onPress={deletePhoto}
        >
          <Text style={styles.buttonText}>
            Delete Photo
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!cameraReady && (
        <View style={styles.loading}>
          <ActivityIndicator
            size="large"
            color="white"
          />
          <Text style={styles.loadingText}>
            Opening Camera...
          </Text>
        </View>
      )}

      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        flash={flash}
        onCameraReady={() => setCameraReady(true)}
      />

      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator
            size="large"
            color="white"
          />
          <Text style={styles.loadingText}>
            Capturing...
          </Text>
        </View>
      )}

      <View style={styles.controls}>
        <Pressable
          style={styles.button}
          onPress={toggleFlash}
        >
          <Text style={styles.buttonText}>
            Flash : {flash.toUpperCase()}
          </Text>
        </Pressable>

        <Pressable
          style={styles.button}
          onPress={flipCamera}
        >
          <Text style={styles.buttonText}>
            Flip Camera
          </Text>
        </Pressable>

        <Pressable
          style={styles.captureButton}
          onPress={takePicture}
        >
          <Text style={styles.buttonText}>
            Capture Photo
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  camera: {
    flex: 1,
  },

  controls: {
    backgroundColor: "#fff",
    padding: 15,
    gap: 10,
  },

  button: {
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  captureButton: {
    backgroundColor: "green",
    padding: 18,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  deleteButton: {
    backgroundColor: "red",
    marginTop: 10,
  },

  previewContainer: {
    flex: 1,
    backgroundColor: "#F4F6F8",
    padding: 20,
    justifyContent: "center",
  },

  image: {
    width: "100%",
    height: 450,
    borderRadius: 12,
    marginBottom: 20,
  },

  captureText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },

  time: {
    textAlign: "center",
    marginBottom: 20,
  },

  loading: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1,
  },

  loadingText: {
    color: "white",
    marginTop: 10,
    fontSize: 16,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});