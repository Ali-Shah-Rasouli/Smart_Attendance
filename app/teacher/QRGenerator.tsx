import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function QRGenerator() {
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [subject, setSubject] = useState("");
  const [qrValue, setQrValue] = useState("");
  const router = useRouter();

  const generateQR = () => {
    const qrData = {
      class: className,
      section: section,
      subject: subject,
      timestamp: new Date().toISOString(),
    };

    setQrValue(JSON.stringify(qrData));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Teacher QR Generator</Text>

      <TextInput
        placeholder="Class (e.g., 10)"
        style={styles.input}
        value={className}
        onChangeText={setClassName}
      />

      <TextInput
        placeholder="Section (e.g., A)"
        style={styles.input}
        value={section}
        onChangeText={setSection}
      />

      <TextInput
        placeholder="Subject (e.g., Math)"
        style={styles.input}
        value={subject}
        onChangeText={setSubject}
      />
        
      <TouchableOpacity style={styles.generateBtn} onPress={generateQR}>
        <Text style={styles.generateText}>Generate QR</Text>
      </TouchableOpacity>

      <View style={styles.qrBox}>
        {qrValue ? (
          <QRCode value={qrValue} size={250} />
        ) : (
          <Text style={{ color: "#777" }}>QR will appear here</Text>
        )}
      </View>

      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20 },
  input: {
    width: "90%",
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  generateBtn: {
    width: "90%",
    backgroundColor: "#1565c0",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
  },
  generateText: { color: "white", fontSize: 18 },
  qrBox: {
    marginTop: 30,
    padding: 20,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "#aaa",
    backgroundColor: "white",
  },
  backBtn: {
    marginTop: 30,
    backgroundColor: "#444",
    padding: 14,
    width: "90%",
    borderRadius: 10,
    alignItems: "center",
  },
  backText: { fontSize: 16, color: "white" },
});