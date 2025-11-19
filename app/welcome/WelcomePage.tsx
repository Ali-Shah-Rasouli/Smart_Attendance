import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View, } from "react-native";

export default function WelcomePage() {
  const router = useRouter();

  return (


    <View style={styles.container}>

          <Text style={styles.title}>Smart Attendance App</Text>
           <Image
                    source={require('../../assets/images/logoAtten.png')} 
                    style={styles.logo}
                  />

      <Text style={styles.title}>Select Role</Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => router.push("../student/StudentDashboard")}
      >
        <Text style={styles.btnText}>Student</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.btn}
        onPress={() => router.push("../teacher/TeacherDashboard")}
      >
        <Text style={styles.btnText}>Teacher</Text>
      </TouchableOpacity>
              <TouchableOpacity
               style={styles.logoutBtn}
                onPress={() =>router.push("/")}>
                <Text style={styles.btnText}>Go to Start</Text>
              </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor:'#fefefeff' },
  title: { fontSize: 28, marginBottom: 30 },
  btn: {
    width: "70%",
    backgroundColor: "#1565c0",
    padding: 18,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  btnText: { color: "#fff", fontSize: 18 },
  logoutBtn: { 
    backgroundColor: "#d32f2f", 
    padding: 16, 
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  logoutText: { 
    color: "#fff", 
    fontSize: 16,
    fontWeight: "600"
  },
});