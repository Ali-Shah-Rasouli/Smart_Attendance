import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getCurrentUser, logoutUser } from "../utils/storage";

export default function StudentDashboard() {
  const [user, setUser] = useState<any>(null); // D4 session user
  const [image, setImage] = useState<string | null>(null);
  const router = useRouter();

  // ✅ Load current user (D4)
  useEffect(() => {
    const loadUser = async () => {
      const u = await getCurrentUser();
      if (!u) {
        router.replace("/auth/Login"); // redirect if not logged in
        return;
      }
      setUser(u);

      // Load profile image from AsyncStorage if exists
      const savedImage = await localStorageImage();
      setImage(savedImage);
    };
    loadUser();
  }, []);

  const localStorageImage = async (): Promise<string | null> => {
    try {
      const img = await localStorage.getItem("student_image"); // optional profile pic storage
      return img;
    } catch {
      return null;
    }
  };

  const handleLogout = async () => {
    await logoutUser(); // clear D4 session
    router.replace("/welcome/WelcomePage");
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
        source={image ? { uri: image } : require("../../assets/images/3.png")}
        style={styles.profilePic}
      />
      <Text style={styles.name}>{user.name}</Text>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.push("/student/ScanAttendance")}
        >
          <Text style={styles.btnText}>Scan Attendance</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.push("/student/AttendanceHistory")}
        >
          <Text style={styles.btnText}>View Attendance History</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", paddingTop: 50 },
  profilePic: { width: 130, height: 130, borderRadius: 65, backgroundColor: "#ddd" },
  name: { fontSize: 22, fontWeight: "bold", marginTop: 12 },
  buttons: { marginTop: 40, width: "80%" },
  btn: {
    backgroundColor: "#1565c0",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontSize: 16 },
  logoutBtn: { backgroundColor: "#d32f2f", padding: 15, borderRadius: 8 },
  logoutText: { color: "#fff", fontSize: 16 },
});