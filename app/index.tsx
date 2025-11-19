import { router } from "expo-router";
import React, { useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getCurrentUser } from "./utils/storage";

export default function WelcomeScreen() {
  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        // redirect based on role
        if (user.role === "student") router.replace("/student/StudentDashboard");
        else if (user.role === "teacher") router.replace("/teacher/TeacherDashboard");
      }
      // If no user, stay on welcome page
    };
    checkUser();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.pageTitle}>Welcome Page</Text>
        <Image source={require("../assets/images/logoAtten.png")} style={styles.logo} />
        <Text style={styles.title}>Smart Attendance App</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push("./auth/Login")}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#87CEEB", justifyContent: "center", alignItems: "center" },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 70,
    paddingBottom: 100,
    borderRadius: 20,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  pageTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 30 },
  logo: { width: 120, height: 120, resizeMode: "contain", marginBottom: 30 },
  title: { fontSize: 20, fontWeight: "bold", textAlign: "center", color: "#333", marginBottom: 40 },
  button: { backgroundColor: "#007BFF", paddingVertical: 12, paddingHorizontal: 35, borderRadius: 25 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});