import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import {
  getAttendanceByUserId,
  getUsers
} from "../utils/storage";

type StudentSummary = {
  id: number;
  name: string;
  lastStatus: string;
  lastDate: string;
};

export default function AttendanceSummary() {
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);

  useEffect(() => {
    loadSummary();
  }, []);


      type User = {
        id: number;
        role: "student" | "teacher";
        name: string;
        email: string;
        password: string;
        status: "present" | "absent";
        date: string;
      };

  const loadSummary = async () => {
    try {
      const allUsers: User[] = await getUsers();
      const studentUsers = allUsers.filter(u => u.role === "student");

      let pCount = 0;
      let aCount = 0;

      const summary: StudentSummary[] = [];

      for (let student of studentUsers) {
        const records = await getAttendanceByUserId(student.id);

        if (records.length > 0) {
          const last = records[records.length - 1];

          if (last.status === "present") pCount++;
          else aCount++;

          summary.push({
            id: student.id,
            name: student.name,
            lastStatus: last.status,
            lastDate: last.date
          });
        } else {
          // No record = absent
          aCount++;

          summary.push({
            id: student.id,
            name: student.name,
            lastStatus: "absent",
            lastDate: "—"
          });
        }
      }

      setPresentCount(pCount);
      setAbsentCount(aCount);
      setStudents(summary);
    } catch (e) {
      console.log("Error loading summary:", e);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading attendance summary...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance Summary</Text>

      <View style={styles.statsBox}>
        <Text style={styles.statText}>Present: {presentCount}</Text>
        <Text style={styles.statText}>Absent: {absentCount}</Text>
      </View>

      <FlatList
        data={students}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingVertical: 10 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={[styles.status, 
              item.lastStatus === "present" ? styles.present : styles.absent
            ]}>
              {item.lastStatus.toUpperCase()}
            </Text>
            <Text style={styles.date}>Last: {item.lastDate}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 15 },
  statsBox: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
    backgroundColor: "#eee",
    borderRadius: 10,
    marginBottom: 20,
  },
  statText: { fontSize: 18, fontWeight: "600" },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  name: { fontSize: 18, fontWeight: "600" },
  date: { fontSize: 14, color: "#555", marginTop: 4 },
  status: { marginTop: 6, fontWeight: "bold" },
  present: { color: "green" },
  absent: { color: "red" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});