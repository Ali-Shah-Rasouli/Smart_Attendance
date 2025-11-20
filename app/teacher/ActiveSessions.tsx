import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentUser } from "../utils/storage";

type AttendanceSession = {
  id: number;
  teacherId: number;
  className: string;
  sessionName: string;
  date: string;
};

export default function ActiveSessions() {
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [teacherId, setTeacherId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadTeacherSessions = async () => {
      const user = await getCurrentUser();
      if (!user) {
        router.replace("/auth/Login");
        return;
      }
      if (user.role !== "teacher") {
        Alert.alert("Error", "Only teachers can view this page");
        router.replace("/welcome/WelcomePage");
        return;
      }
      setTeacherId(user.id);

      const data = await AsyncStorage.getItem("attendance_sessions");
      const allSessions: AttendanceSession[] = data ? JSON.parse(data) : [];
      const mySessions = allSessions.filter(s => s.teacherId === user.id);
      setSessions(mySessions);
      setLoading(false);
    };

    loadTeacherSessions();
  }, []);

  const handleDelete = async (id: number) => {
    Alert.alert("Confirm", "Delete this session?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: async () => {
          const data = await AsyncStorage.getItem("attendance_sessions");
          const allSessions: AttendanceSession[] = data ? JSON.parse(data) : [];
          const updated = allSessions.filter(s => s.id !== id);
          await AsyncStorage.setItem("attendance_sessions", JSON.stringify(updated));
          setSessions(prev => prev.filter(s => s.id !== id));
        },
        style: "destructive",
      },
    ]);
  };

  if (loading)
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2a86ff" />
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Active Attendance Sessions</Text>
      {sessions.length === 0 ? (
        <Text>No active sessions found.</Text>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.sessionRow}>
              <View>
                <Text style={styles.sessionName}>{item.sessionName}</Text>
                <Text>{item.className} - {item.date}</Text>
              </View>
              <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20,marginTop:80 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  sessionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 12,
  },
  sessionName: { fontWeight: "bold", fontSize: 16 },
  deleteBtn: { backgroundColor: "#d32f2f", padding: 8, borderRadius: 5 },
  deleteText: { color: "#fff", fontWeight: "600" },
});