import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { getCurrentUser } from "../utils/storage";

type AttendanceSession = {
  id: number;
  teacherId: number;
  className: string;
  sessionName: string;
  date: string;
};

type AttendanceRecord = {
  id: number;
  studentId: number;
  date: string;
  status: "present" | "absent";
  className?: string;
};

export default function Reports() {
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      const user = await getCurrentUser();
      if (!user) {
        router.replace("/auth/Login");
        return;
      }
      if (user.role !== "teacher") {
        Alert.alert("Error", "Only teachers can view reports");
        router.replace("/welcome/WelcomePage");
        return;
      }

      // Load sessions for this teacher
      const sessionData = await AsyncStorage.getItem("attendance_sessions");
      const allSessions: AttendanceSession[] = sessionData ? JSON.parse(sessionData) : [];
      const mySessions = allSessions.filter(s => s.teacherId === user.id);
      setSessions(mySessions);

      // Load all attendance records
      const recordData = await AsyncStorage.getItem("attendance_records");
      const allRecords: AttendanceRecord[] = recordData ? JSON.parse(recordData) : [];
      setRecords(allRecords);

      setLoading(false);
    };

    loadData();
  }, []);

  if (loading)
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2a86ff" />
      </View>
    );

  const renderSummary = (session: AttendanceSession) => {
    const sessionRecords = records.filter(r => r.className === session.className && r.date === session.date);

    const presentCount = sessionRecords.filter(r => r.status === "present").length;
    const absentCount = sessionRecords.filter(r => r.status === "absent").length;

    return (
      <View style={styles.sessionRow}>
        <Text style={styles.sessionTitle}>{session.sessionName} ({session.className})</Text>
        <Text>Date: {session.date}</Text>
        <Text>Present: {presentCount} | Absent: {absentCount}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance Reports</Text>
      {sessions.length === 0 ? (
        <Text>No sessions found.</Text>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => renderSummary(item)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 ,marginTop:80},
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  sessionRow: { padding: 15, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, marginBottom: 12 },
  sessionTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
});