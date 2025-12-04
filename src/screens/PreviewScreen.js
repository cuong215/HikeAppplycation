import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { insertHike, updateHike } from '../db/database';

export default function PreviewScreen({ route, navigation }) {
  const { data, editing } = route.params || {};

  const confirm = async () => {
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
        weatherForecast: data.weatherForecast || "",
        maxGroupSize: parseInt(data.maxGroupSize) || 0, 
      };

      if (editing) {
        if (!editing.id) {
          Alert.alert("Error", "Cannot update: Missing Hike ID");
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
    }
  };

  if (!data) {
    return (
        <View style={styles.container}>
            <Text>Error: No data provided</Text>
        </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
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
        "Weather Forecast": data.weatherForecast,
        "Max Group Size": data.maxGroupSize,
      }).map(([k, v]) => (
        <View key={k} style={styles.block}>
          <Text style={styles.label}>{k}</Text>
          <Text style={styles.value}>{v ? String(v) : "--"}</Text>
        </View>
      ))}

      <TouchableOpacity style={styles.btnSave} onPress={confirm}>
        <Text style={styles.btnSaveText}>
            {editing ? "Confirm Update" : "Confirm & Save"}
        </Text>
      </TouchableOpacity>
 
      <TouchableOpacity style={styles.btnBack} onPress={() => navigation.goBack()}>
        <Text style={styles.btnBackText}>Back to Form</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  block: { marginBottom: 14, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 5 },
  label: { fontSize: 14, color: "#666" },
  value: { fontSize: 18, fontWeight: "600", color: "#333" },
  btnSave: {
    backgroundColor: "green",
    padding: 16,
    borderRadius: 10,
    marginTop: 20
  },
  btnSaveText: { color: "white", textAlign: "center", fontSize: 18, fontWeight: 'bold' },
  btnBack: {
    backgroundColor: "#ccc",
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 40
  },
  btnBackText: { textAlign: "center", fontSize: 16 }
});