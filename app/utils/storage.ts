import AsyncStorage from "@react-native-async-storage/async-storage";
import type { User } from "../types/User";



// Keys
const USERS_KEY = "users";
const CURRENT_USER_KEY = "current_user";
const ATTENDANCE_KEY = "attendance";

// User type
// export type User = {
//   id: number;
//   role: "student" | "teacher";
//   name: string;
//   email: string;
//   password: string;
//   status: "present" | "absent";  // <-- ADD THIS
//   date: string;
// };

// Attendance type
export type AttendanceRecord = {
  id: number;
  userId: number;
  sessionId: string;
  timestamp: string;
  status: "present" | "absent";  // <-- ADD THIS
  date: string;                 // <-- AND THIS
};

// -------------------- USERS --------------------

// Save all users
export async function saveUsers(users: User[]) {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Get all users
export async function getUsers(): Promise<User[]> {
  const data = await AsyncStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

// Save the logged-in user
export async function setCurrentUser(user: User) {
  await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

// Get the logged-in user
export async function getCurrentUser(): Promise<User | null> {
  const data = await AsyncStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
}

// Logout
export async function logoutUser() {
  await AsyncStorage.removeItem(CURRENT_USER_KEY);
}

// -------------------- ATTENDANCE --------------------

// Save all attendance records
async function saveAttendance(records: AttendanceRecord[]) {
  await AsyncStorage.setItem(ATTENDANCE_KEY, JSON.stringify(records));
}

// Get all attendance
export async function getAttendance(): Promise<AttendanceRecord[]> {
  const data = await AsyncStorage.getItem(ATTENDANCE_KEY);
  return data ? JSON.parse(data) : [];
}

// Add a new attendance record
export async function addAttendance(record: AttendanceRecord) {
  const all = await getAttendance();
  all.push(record);
  await saveAttendance(all);
}

// Get attendance by user ID
export async function getAttendanceByUserId(
  userId: number
): Promise<AttendanceRecord[]> {
  const all = await getAttendance();
  return all.filter(a => a.userId === userId);
}

// Get attendance for a specific session
export async function getAttendanceBySession(sessionId: string) {
  const all = await getAttendance();
  return all.filter(a => a.sessionId === sessionId);
}