import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";

const Survey = () => {
  const [siteName, setSiteName] = useState("");
  const [clientName, setClientName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = () => {
    if (
      !siteName ||
      !clientName ||
      !description ||
      !priority ||
      !date
    ) {
      Alert.alert("Validation Error", "Please fill all the fields.");
      return;
    }

    Alert.alert("Success", "Survey Created Successfully!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create Survey</Text>

      <TextInput
        style={styles.input}
        placeholder="Site Name"
        value={siteName}
        onChangeText={setSiteName}
      />

      <TextInput
        style={styles.input}
        placeholder="Client Name"
        value={clientName}
        onChangeText={setClientName}
      />

      <TextInput
        style={[styles.input, styles.description]}
        placeholder="Description"
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Priority</Text>

      <View style={styles.row}>
        <Pressable
          style={[
            styles.priorityBtn,
            priority === "High" && styles.selected,
          ]}
          onPress={() => setPriority("High")}
        >
          <Text>High</Text>
        </Pressable>

        <Pressable
          style={[
            styles.priorityBtn,
            priority === "Medium" && styles.selected,
          ]}
          onPress={() => setPriority("Medium")}
        >
          <Text>Medium</Text>
        </Pressable>

        <Pressable
          style={[
            styles.priorityBtn,
            priority === "Low" && styles.selected,
          ]}
          onPress={() => setPriority("Low")}
        >
          <Text>Low</Text>
        </Pressable>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Date (DD/MM/YYYY)"
        value={date}
        onChangeText={setDate}
      />

      <Pressable style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitText}>Create Survey</Text>
      </Pressable>
    </View>
  );
};

export default Survey;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
    padding: 20,
  },

  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },

  description: {
    height: 100,
  },

  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  priorityBtn: {
    width: "30%",
    borderWidth: 1,
    borderColor: "#2563EB",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "white",
  },

  selected: {
    backgroundColor: "#BFDBFE",
  },

  submitBtn: {
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  submitText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});