import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { getCurrentUser } from "../utils/storage";

type AttendanceSession = {
  id: number;
  teacherId: number;
  className: string;
  sessionName: string;
  date: string;
};

export default function CreateSession() {
  const [className, setClassName] = useState("");
  const [sessionName, setSessionName] = useState("");
  const [loading, setLoading] = useState(true);
  const [teacherId, setTeacherId] = useState<number | null>(null);
  const router = useRouter();

  // ✅ Load D4 session user
  useEffect(() => {
    const loadUser = async () => {
      const user = await getCurrentUser();
      if (!user) {
        router.replace("/auth/Login");
        return;
      }
      if (user.role !== "teacher") {
        Alert.alert("Error", "Only teachers can create sessions");
        router.replace("/welcome/WelcomePage");
        return;
      }
      setTeacherId(user.id);
      setLoading(false);
    };
    loadUser();
  }, []);

  const handleCreateSession = async () => {
    if (!className || !sessionName) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      const newSession: AttendanceSession = {
        id: Date.now(),
        teacherId: teacherId!,
        className,
        sessionName,
        date: new Date().toISOString().split("T")[0],
      };

      const existing = await AsyncStorage.getItem("attendance_sessions");
      const allSessions: AttendanceSession[] = existing ? JSON.parse(existing) : [];
      allSessions.push(newSession);
      await AsyncStorage.setItem("attendance_sessions", JSON.stringify(allSessions));

      Alert.alert("Success", "Attendance session created!");
      setClassName("");
      setSessionName("");
    } catch (error) {
      console.log("Error creating session:", error);
      Alert.alert("Error", "Failed to create session");
    }
  };

  if (loading)
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2a86ff" />
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Attendance Session</Text>

      <TextInput
        placeholder="Class Name"
        value={className}
        onChangeText={setClassName}
        style={styles.input}
      />

      <TextInput
        placeholder="Session Name"
        value={sessionName}
        onChangeText={setSessionName}
        style={styles.input}
      />

      <Button title="Create Session" onPress={handleCreateSession} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 , marginTop:80},
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
});