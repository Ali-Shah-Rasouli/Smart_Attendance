import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { getCurrentUser } from "../utils/storage";

type ClassItem = {
  id: number;
  teacherId: number;
  className: string;
};

export default function ClassManagement() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [newClass, setNewClass] = useState("");
  const [teacherId, setTeacherId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ✅ Load teacher session
  useEffect(() => {
    const loadClasses = async () => {
      const user = await getCurrentUser();
      if (!user) {
        router.replace("/auth/Login");
        
        return;
      }
      if (user.role !== "teacher") {
        Alert.alert("Error", "Only teachers can access this page");
        router.replace("/welcome/WelcomePage");
        return;
      }
      setTeacherId(user.id);

      const data = await AsyncStorage.getItem("classes");
      const allClasses: ClassItem[] = data ? JSON.parse(data) : [];
      const myClasses = allClasses.filter(c => c.teacherId === user.id);
      setClasses(myClasses);
      setLoading(false);
    };

    loadClasses();
  }, []);

  const handleAddClass = async () => {
    if (!newClass.trim()) {
      Alert.alert("Error", "Please enter class name");
      return;
    }

    const classItem: ClassItem = {
      id: Date.now(),
      teacherId: teacherId!,
      className: newClass,
    };

    const data = await AsyncStorage.getItem("classes");
    const allClasses: ClassItem[] = data ? JSON.parse(data) : [];
    allClasses.push(classItem);
    await AsyncStorage.setItem("classes", JSON.stringify(allClasses));

    setClasses(prev => [...prev, classItem]);
    setNewClass("");
  };

  const handleDeleteClass = async (id: number) => {
    Alert.alert("Confirm", "Delete this class?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: async () => {
          const data = await AsyncStorage.getItem("classes");
          const allClasses: ClassItem[] = data ? JSON.parse(data) : [];
          const updated = allClasses.filter(c => c.id !== id);
          await AsyncStorage.setItem("classes", JSON.stringify(updated));
          setClasses(prev => prev.filter(c => c.id !== id));
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
      <Text style={styles.title}>Class Management</Text>

      <View style={styles.addContainer}>
        <TextInput
          placeholder="New Class Name"
          value={newClass}
          onChangeText={setNewClass}
          style={styles.input}
        />
        <Button title="Add Class" onPress={handleAddClass} />
      </View>

      {classes.length === 0 ? (
        <Text style={{ marginTop: 20 }}>No classes found.</Text>
      ) : (
        <FlatList
          data={classes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.classRow}>
              <Text>{item.className}</Text>
              <TouchableOpacity onPress={() => handleDeleteClass(item.id)} style={styles.deleteBtn}>
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
  addContainer: { flexDirection: "row", marginBottom: 20, alignItems: "center" },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginRight: 10 },
  classRow: { flexDirection: "row", justifyContent: "space-between", padding: 15, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, marginBottom: 12 },
  deleteBtn: { backgroundColor: "#d32f2f", padding: 8, borderRadius: 5 },
  deleteText: { color: "#fff", fontWeight: "600" },
});