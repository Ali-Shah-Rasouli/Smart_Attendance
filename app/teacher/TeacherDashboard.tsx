import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getCurrentUser, logoutUser } from "../utils/storage";

export default function TeacherDashboard() {
  const [user, setUser] = useState<any>(null); // D4 session user
  const [image, setImage] = useState<string | null>(null);
  const router = useRouter();

  // ✅ Load current user and check session
  useEffect(() => {
    const loadUser = async () => {
      const u = await getCurrentUser();
      if (!u) {
        router.replace("/auth/Login"); // redirect if not logged in
        return;
      }
      setUser(u);

      // Optional: load teacher profile image from AsyncStorage
      const savedImage = await localStorageImage();
      setImage(savedImage);
    };
    loadUser();
  }, []);

  const localStorageImage = async (): Promise<string | null> => {
    try {
      const img = await localStorage.getItem("teacher_image");
      return img;
    } catch {
      return null;
    }
  };

  const handleLogout = async () => {
    await logoutUser(); // clear D4 session
    router.replace("/auth/Login");
  };

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2a86ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={image ? { uri: image } : require("../../assets/images/watchlogo.webp")}
        style={styles.profilePic}
      />
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.role}>Teacher Dashboard</Text>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.push("/teacher/CreateSession")}
        >
          <Text style={styles.btnText}>Create Attendance Session</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.push("/teacher/ActiveSessions")}
        >
          <Text style={styles.btnText}>Active Sessions</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.push("/teacher/ClassManagement")}
        >
          <Text style={styles.btnText}>Class Management</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.push("/teacher/Reports")}
        >
          <Text style={styles.btnText}>View Reports</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.push("/teacher/QRGenerator")}
        >
          <Text style={styles.btnText}>Generate Class QR</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.push("/teacher/StudentManagement")}
        >
          <Text style={styles.btnText}>Student Management</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.push("/teacher/AttendanceSummary")}
        >
          <Text style={styles.btnText}>Attendance Summary</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", paddingTop: 50, backgroundColor: "#f5f5f5" },
  profilePic: { width: 130, height: 130, borderRadius: 65, backgroundColor: "#ddd" },
  name: { fontSize: 24, fontWeight: "bold", marginTop: 12, color: "#333" },
  role: { fontSize: 16, color: "#666", marginTop: 4, fontWeight: "500" },
  buttons: { marginTop: 40, width: "85%" },
  btn: {
    backgroundColor: "#1976d2",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  logoutBtn: {
    backgroundColor: "#d32f2f",
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});