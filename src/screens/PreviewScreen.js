import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { insertHike, updateHike } from '../db/database';

export default function PreviewScreen({ route, navigation }) {
  const { data, editing } = route.params || {};

  const [isSaving, setIsSaving] = useState(false);

  const confirm = async () => {

    if (isSaving) return;
    setIsSaving(true);

    try {
      const hikeData = {
        name: data.name || "Untitled Hike",
        location: data.location || "Unknown Location",
        date: data.date, 
        length: parseFloat(data.length) || 0,          
        duration: parseFloat(data.duration) || 0,      
        difficulty: data.difficulty || "Easy",
        parking: data.parking || "Yes",
        trailType: data.trailType || "",
        description: data.description || "",
      };

      if (editing) {
        if (!editing.id) {
          Alert.alert("Error", "Cannot update: Missing Hike ID");
          setIsSaving(false);
          return;
        }
        await updateHike({ ...hikeData, id: editing.id });
      } else {
        await insertHike(hikeData);
      }

      navigation.navigate("HikeList");

    } catch (error) {
      console.error("Lỗi khi lưu vào DB:", error);
      Alert.alert("Error", "Failed to save hike data. Please try again.");
      setIsSaving(false);
    }
  };

  if (!data) {
    return (
        <View style={styles.centerContainer}>
            <Text style={styles.errorText}>Error: No data provided</Text>
            <TouchableOpacity style={styles.btnBack} onPress={() => navigation.goBack()}>
                <Text style={styles.btnBackText}>Go Back</Text>
            </TouchableOpacity>
        </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Preview Hike Information</Text>

      {Object.entries({
        "Name": data.name,
        "Location": data.location,
        "Date": data.date,
        "Length (km)": data.length,
        "Duration (hours)": data.duration,
        "Difficulty": data.difficulty,
        "Parking": data.parking,
        "Trail Type": data.trailType,
        "Description": data.description,
      }).map(([k, v]) => (
        <View key={k} style={styles.block}>
          <Text style={styles.label}>{k}</Text>
          <Text style={styles.value}>{v ? String(v) : "--"}</Text>
        </View>
      ))}

      <TouchableOpacity 
        style={[styles.btnSave, isSaving && styles.btnDisabled]} 
        onPress={confirm}
        disabled={isSaving}
      >
        <Text style={styles.btnSaveText}>
            {isSaving ? "Processing..." : (editing ? "Confirm Update" : "Confirm & Save")}
        </Text>
      </TouchableOpacity>

      {!isSaving && (
        <TouchableOpacity style={styles.btnBack} onPress={() => navigation.goBack()}>
          <Text style={styles.btnBackText}>Back to Form</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 50 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 20, color: "#333" },
  
  block: { 
    marginBottom: 14, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee', 
    paddingBottom: 5 
  },
  label: { fontSize: 14, color: "#666" },
  value: { fontSize: 18, fontWeight: "600", color: "#333", marginTop: 2 },
  
  btnSave: {
    backgroundColor: "green",
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center'
  },
  btnDisabled: {
    backgroundColor: "#a5d6a7", 
    opacity: 0.7
  },
  btnSaveText: { color: "white", fontSize: 18, fontWeight: 'bold' },
  
  btnBack: {
    backgroundColor: "#ccc",
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center'
  },
  btnBackText: { color: "#333", fontSize: 16 },
  errorText: { color: 'red', fontSize: 16, marginBottom: 10 }
});