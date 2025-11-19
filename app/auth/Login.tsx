import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, Text, TextInput, View } from "react-native";
import { User } from "../types/User";
import { getCurrentUser, getUsers, setCurrentUser } from "../utils/storage";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ✅ D4 session: redirect if already logged in
  useEffect(() => {
    const checkLogged = async () => {
      const user = await getCurrentUser();
      if (user) {
        if (user.role === "student") router.replace("/student/StudentDashboard");
        else if (user.role === "teacher") router.replace("/teacher/TeacherDashboard");
      } else {
        setLoading(false); // allow login form to show
      }
    };
    checkLogged();
  }, []);

  const handleLogin = async () => {
    const allUsers: User[] = await getUsers();
    const user = allUsers.find(
      u => u.email === email && u.password === password
    );

    if (!user) {
      Alert.alert("Error", "Invalid credentials");
      return;
    }

    await setCurrentUser(user); // D4 session written

    // Redirect based on role
    if (user.role === "student") router.replace("/student/StudentDashboard");
    else router.replace("/teacher/TeacherDashboard");
  };

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2a86ff" />
      </View>
    );

  return (
    <View style={{ padding:20, marginTop:30}}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ marginBottom: 15, borderBottomWidth: 1, padding: 5 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        style={{ marginBottom: 15, borderBottomWidth: 1, padding: 5 }}
      />
      <Button title="Login" onPress={handleLogin} />
      <Text style={{marginTop:20, marginBottom:5}}>Not Registered Yet?</Text>
      <Button
        title="Register"
        onPress={() => router.navigate('/auth/register')} // Navigating to Register screen
      />
    </View>
  );
}