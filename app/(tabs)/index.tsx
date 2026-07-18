import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ScrollView,
  Pressable,
} from "react-native";
import React from "react";
import { useRouter } from 'expo-router';

const Index = () => {
  const router = useRouter();

  const students = [
    { Name: "ABC", Roll: 1, Course: "BE in CE" },
    { Name: "DEF", Roll: 2, Course: "BE in CE" },
    { Name: "GHI", Roll: 3, Course: "BE in CE" },
  ];

  return (
    <ScrollView style={styles.screen}>
      {/* Header */}
      <View style={styles.container}>
        <Text style={styles.title}>Smart Survey</Text>
        <Text style={styles.subtitle}>
          Field Survey & Inspection App
        </Text>
      </View>

      {/* Welcome */}
      <View style={styles.welcome}>
        <Text style={styles.welcomeTitle}>Welcome</Text>
        <Text style={styles.welcomeSubtitle}>
          Have a productive survey today.
        </Text>
      </View>

      {/* Student Details */}
      <Text style={styles.heading}>Student Details</Text>

      <FlatList
        data={students}
        scrollEnabled={false}
        keyExtractor={(item) => item.Roll.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.text}>
              <Text style={styles.label}>Name:</Text> {item.Name}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.label}>Roll No:</Text> {item.Roll}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.label}>Course:</Text> {item.Course}
            </Text>
          </View>
        )}
      />

      {/* Survey Count */}
      <View style={styles.countCard}>
        <Text style={styles.countTitle}>Today's Survey Count</Text>
        <Text style={styles.count}>5</Text>
      </View>

      {/* Quick Actions */}
      <Text style={styles.heading}>Quick Actions</Text>

      <View style={styles.row}>
        <Pressable style={styles.button} onPress={()=>router.push("/survey")}>
          <Text style={styles.buttonText}>New Survey</Text>
        </Pressable>

        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Camera</Text>
        </Pressable>
      </View>

      <View style={styles.row}>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Location</Text>
        </Pressable>

        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Contacts</Text>
        </Pressable>
      </View>

      {/* Recent Survey */}
      <View style={styles.card}>
        <Text style={styles.heading}>Recent Survey Summary</Text>
        <Text>Site: ABC Construction</Text>
        <Text>Client: XYZ Pvt Ltd</Text>
        <Text>Priority: High</Text>
        <Text>Status: Completed</Text>
      </View>
    </ScrollView>
  );
};

export default Index;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  container: {
    backgroundColor: "#2563EB",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },

  title: {
    color: "white",
    fontSize: 26,
    fontWeight: "bold",
  },

  subtitle: {
    color: "white",
    marginTop: 5,
  },

  welcome: {
    margin: 15,
  },

  welcomeTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },

  welcomeSubtitle: {
    color: "gray",
    marginTop: 5,
  },

  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 15,
    marginBottom: 10,
  },

  card: {
    backgroundColor: "white",
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 18,
    borderRadius: 12,
    elevation: 3,
  },

  text: {
    marginBottom: 5,
    fontSize: 15,
  },

  label: {
    fontWeight: "bold",
  },

  countCard: {
    backgroundColor: "#DCFCE7",
    margin: 15,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },

  countTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  count: {
    fontSize: 40,
    fontWeight: "bold",
    color: "green",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 15,
  },

  button: {
    backgroundColor: "#2563EB",
    width: "42%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});