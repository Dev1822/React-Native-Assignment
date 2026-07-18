import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import * as Clipboard from "expo-clipboard";

export default function LocationScreen() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  const getLocation = async () => {
    try {
      setLoading(true);

      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required."
        );
        setLoading(false);
        return;
      }

      const currentLocation =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

      setLocation(currentLocation.coords);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Unable to fetch location.");
      console.log(error);
    }
  };

  const refreshLocation = () => {
    getLocation();
  };

  const copyLocation = async () => {
    if (!location) {
      Alert.alert("No Location", "Fetch location first.");
      return;
    }

    const text = `Latitude: ${location.latitude}
Longitude: ${location.longitude}`;

    await Clipboard.setStringAsync(text);

    Alert.alert(
      "Success",
      "Location copied to clipboard."
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Location Module</Text>

      <Pressable
        style={styles.button}
        onPress={getLocation}
      >
        <Text style={styles.buttonText}>
          Get Current Location
        </Text>
      </Pressable>

      {loading && (
        <ActivityIndicator
          size="large"
          color="#2563EB"
          style={{ marginTop: 20 }}
        />
      )}

      {location && (
        <View style={styles.card}>
          <Text style={styles.label}>
            Latitude
          </Text>
          <Text>{location.latitude}</Text>

          <Text style={styles.label}>
            Longitude
          </Text>
          <Text>{location.longitude}</Text>

          <Text style={styles.label}>
            Accuracy
          </Text>
          <Text>{location.accuracy} meters</Text>
        </View>
      )}

      <Pressable
        style={styles.button}
        onPress={refreshLocation}
      >
        <Text style={styles.buttonText}>
          Refresh Location
        </Text>
      </Pressable>

      <Pressable
        style={[styles.button, styles.copyButton]}
        onPress={copyLocation}
      >
        <Text style={styles.buttonText}>
          Copy Location
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
    padding: 20,
  },

  heading: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginVertical: 20,
    elevation: 3,
  },

  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },

  button: {
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
  },

  copyButton: {
    backgroundColor: "green",
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});