import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function TeacherProfile() {
  const [name, setName] = useState("");
  const router = useRouter();

  const saveProfile = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter your name");
      return;
    }

    await AsyncStorage.setItem("teacher_name", name);
    // You can add image handling here later
    router.push("/teacher/TeacherDashboard");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Teacher Profile</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity style={styles.btn} onPress={saveProfile}>
        <Text style={styles.btnText}>Save & Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 30 },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  btn: {
    width: "100%",
    backgroundColor: "#1976d2",
    padding: 18,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontSize: 18 },
});