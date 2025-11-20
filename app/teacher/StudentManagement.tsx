import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getCurrentUser } from "../utils/storage";

type User = {
  id: number;
  role: "student" | "teacher";
  name: string;
  email: string;
  password: string;
  className?: string;
};

export default function StudentManagement() {
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadStudents = async () => {
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

      const data = await AsyncStorage.getItem("users");
      const allUsers: User[] = data ? JSON.parse(data) : [];
      const studentsList = allUsers.filter(u => u.role === "student");
      setStudents(studentsList);
      setLoading(false);
    };

    loadStudents();
  }, []);

  const handleDeleteStudent = async (id: number) => {
    Alert.alert("Confirm", "Delete this student?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: async () => {
          const data = await AsyncStorage.getItem("users");
          const allUsers: User[] = data ? JSON.parse(data) : [];
          const updated = allUsers.filter(u => u.id !== id);
          await AsyncStorage.setItem("users", JSON.stringify(updated));
          setStudents(prev => prev.filter(s => s.id !== id));
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
      <Text style={styles.title}>Student Management</Text>

      {students.length === 0 ? (
        <Text>No students found.</Text>
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.studentRow}>
              <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text>{item.email}</Text>
                <Text>Class: {item.className || "-"}</Text>
              </View>
              <TouchableOpacity onPress={() => handleDeleteStudent(item.id)} style={styles.deleteBtn}>
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
  studentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 12,
  },
  name: { fontWeight: "bold", fontSize: 16 },
  deleteBtn: { backgroundColor: "#d32f2f", padding: 8, borderRadius: 5 },
  deleteText: { color: "#fff", fontWeight: "600" },
});