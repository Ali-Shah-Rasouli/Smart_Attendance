export type User = {
  id: number;
  role: "student" | "teacher";
  name: string;
  email: string;
  password: string;
  date: Date;
  status: "present" | "absent";
  className?: string; // ✅ Add this line
};
