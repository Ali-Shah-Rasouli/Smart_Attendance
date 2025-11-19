import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getCurrentUser } from "../utils/storage";

type AttendanceRecord = {
  id: number;
  studentId: number;
  date: string;
  status: "present" | "absent";
};

export default function AttendanceHistory() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>([]);
  const [filter, setFilter] = useState<"all" | "present" | "absent">("all");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [studentId, setStudentId] = useState<number | null>(null);

  // ✅ Load D4 session user
  useEffect(() => {
    const loadUser = async () => {
      const user = await getCurrentUser();
      if (!user) {
        router.replace("/auth/Login");
        return;
      }
      if (user.role !== "student") {
        alert("Only students can view this page");
        router.replace("/welcome/WelcomePage");
        return;
      }
      setStudentId(user.id);
      await loadAttendance(user.id);
    };
    loadUser();
  }, []);

  const loadAttendance = async (id: number) => {
    try {
      const data = await AsyncStorage.getItem("attendance_records");
      const allRecords: AttendanceRecord[] = data ? JSON.parse(data) : [];
      // Filter records for this student
      const studentRecords = allRecords.filter(r => r.studentId === id);
      setRecords(studentRecords);
      setFilteredRecords(studentRecords);
    } catch (error) {
      console.log("Error loading attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = (type: "all" | "present" | "absent") => {
    setFilter(type);
    if (type === "all") setFilteredRecords(records);
    else setFilteredRecords(records.filter(r => r.status === type));
  };

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2a86ff" />
      </View>
    );

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterBtn, filter === "all" && styles.activeFilter]}
          onPress={() => applyFilter("all")}
        >
          <Text>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterBtn, filter === "present" && styles.activeFilter]}
          onPress={() => applyFilter("present")}
        >
          <Text>Present</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterBtn, filter === "absent" && styles.activeFilter]}
          onPress={() => applyFilter("absent")}
        >
          <Text>Absent</Text>
        </TouchableOpacity>
      </View>

      {filteredRecords.length === 0 ? (
        <Text style={{ marginTop: 20 }}>No attendance records found.</Text>
      ) : (
        <FlatList
          data={filteredRecords}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.recordRow}>
              <Text>{item.date}</Text>
              <Text style={{ color: item.status === "present" ? "green" : "red" }}>{item.status}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop:80 },
  filterRow: { flexDirection: "row", justifyContent: "space-around", marginBottom: 20 },
  filterBtn: { padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 5 },
  activeFilter: { backgroundColor: "#cce5ff", borderColor: "#007bff" },
  recordRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#eee" },
});