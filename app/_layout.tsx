import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { getCurrentUser } from "./utils/storage"; // D4 session helper

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [logged, setLogged] = useState<any>(null);

  // ✅ Check current logged-in user (D4 session)
  const checkLogin = async () => {
    const user = await getCurrentUser();
    setLogged(user);
    setReady(true);
  };

  useEffect(() => {
    checkLogin();
  }, []);

  if (!ready)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2a86ff" />
      </View>
    );

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!logged ? (
        // If not logged in → show auth screens
        <>
          <Stack.Screen name="(auth)/login" />
          <Stack.Screen name="(auth)/register" />
        </>
      ) : logged.role === "student" ? (
        // Logged-in student → student dashboard
        <>
          <Stack.Screen name="(student)/dashboard" />
        </>
      ) : (
        // Logged-in teacher → teacher dashboard
        <>
          <Stack.Screen name="(teacher)/dashboard" />
        </>
      )}
    </Stack>
  );
}