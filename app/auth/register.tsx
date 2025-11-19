import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, TextInput, View } from "react-native";
import type { User } from "../types/User";
import { getUsers, saveUsers, setCurrentUser } from "../utils/storage";

export default function Register() {
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [className, setClassName] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill all fields!");
      return;
    }

    const allUsers: User[] = await getUsers();
    if (allUsers.some((u) => u.email === email)) {
      Alert.alert("Error", "Email already registered!");
      return;
    }

    const newUser: User = {
      id: allUsers.length > 0 ? allUsers[allUsers.length - 1].id + 1 : 1,
      role,
      name,
      email,
      password,
      date: new Date(),
      status: "present",
      className: role === "student" ? className : undefined, // ✅ Now valid
    };

    allUsers.push(newUser);
    await saveUsers(allUsers);
    await setCurrentUser(newUser);

    Alert.alert("Success", "Registration successful!");
    router.replace(role === "student" ? "/student/StudentDashboard" : "/teacher/TeacherDashboard");
  };

  return (
    <View>
      <TextInput placeholder="Name" value={name} onChangeText={setName} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      {role === "student" && (
        <TextInput placeholder="Class Name" value={className} onChangeText={setClassName} />
      )}
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
}
