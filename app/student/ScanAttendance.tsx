import AsyncStorage from "@react-native-async-storage/async-storage";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, Platform, StyleSheet, Text, View } from "react-native";
import { getCurrentUser } from "../utils/storage";


type AttendanceRecord = {
  id: number;
  studentId: number;
  date: string;
  status: "present" | "absent";
  className?: string;
};

export default function ScanAttendance() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [studentId, setStudentId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
  const loadUserAndPermissions = async () => {
    const user = await getCurrentUser();
    if (!user) {
      router.replace("/auth/Login");
      return;
    }
    if (user.role !== "student") {
      Alert.alert("Error", "Only students can scan attendance");
      router.replace("/welcome/WelcomePage");
      return;
    }
    setStudentId(user.id);

    if (Platform.OS === "web") {
      setHasPermission(false); // Web can't request camera permission
      setLoading(false);
      return;
    }

    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === "granted");
    setLoading(false);
  };

  loadUserAndPermissions();
}, []);
if (Platform.OS === "web" && hasPermission === false) {
  return <Text>Camera access denied. Please allow it in browser settings.</Text>;
}


  const handleBarCodeScanned = async ({ data }: { type: string; data: string }) => {
    setScanned(true);

    try {
      const parsed = JSON.parse(data);
      if (parsed.type !== "attendance" || !parsed.className) {
        Alert.alert("Invalid QR", "This QR code is not for attendance.");
        return;
      }

      const record: AttendanceRecord = {
        id: Date.now(),
        studentId: studentId!,
        date: new Date().toISOString().split("T")[0],
        status: "present",
        className: parsed.className,
      };

      const existing = await AsyncStorage.getItem("attendance_records");
      const allRecords: AttendanceRecord[] = existing ? JSON.parse(existing) : [];
      allRecords.push(record);
      await AsyncStorage.setItem("attendance_records", JSON.stringify(allRecords));

      Alert.alert("Success", `Attendance marked for class: ${parsed.className}`);
    } catch (error) {
      console.log("Error saving attendance:", error);
      Alert.alert("Error", "Failed to save attendance");
    } finally {
      setScanned(false);
    }
  };

  if (loading) return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  if (hasPermission === false) return <Text>No access to camera</Text>;

  return (
    <View style={{ flex: 1 }}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={{ flex: 1 }}
      />
      {scanned && (
        <View style={styles.buttonContainer}>
          <Button title="Tap to Scan Again" onPress={() => setScanned(false)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  buttonContainer: { padding: 20, backgroundColor: "#fff" },
});
