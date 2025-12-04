import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function HikeFormScreen({ route, navigation }) {
  const editing = route.params?.hike;

  const [name, setName] = useState(editing?.name || "");
  const [location, setLocation] = useState(editing?.location || "");
  const [date, setDate] = useState(editing?.date || "");
  const [length, setLength] = useState(editing?.length?.toString() || "");
  const [duration, setDuration] = useState(editing?.duration?.toString() || "");
  const [difficulty, setDifficulty] = useState(editing?.difficulty || "Easy");
  const [parking, setParking] = useState(editing?.parking || "Yes");
  const [trailType, setTrailType] = useState(editing?.trailType || "");
  const [description, setDescription] = useState(editing?.description || "");

  const [showPicker, setShowPicker] = useState(false);

  const onDateChange = (_, selected) => {
    setShowPicker(false);
    if (selected) {
      setDate(selected.toISOString().split("T")[0]);
    }
  };

  const resetForm = () => {
    setName("");
    setLocation("");
    setDate("");
    setLength("");
    setDuration("");
    setDifficulty("Easy");
    setParking("Yes");
    setTrailType("");
    setDescription("");
  };

  const preview = () => {
    const data = {
      name,
      location,
      date,
      length: Number(length),
      duration: Number(duration),
      difficulty,
      parking,
      trailType,
      description,
    };

    navigation.navigate("Preview", { data, editing });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Add / Edit Hike</Text>
        <Text style={styles.subtitle}>Fill in the details of your hiking trip</Text>

        {/* NAME */}
        <Text style={styles.label}>Name of hike *</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Eg. Snowdon Sunrise" />

        {/* LOCATION */}
        <Text style={styles.label}>Location *</Text>
        <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="Eg. Lake District, UK" />

        {/* DATE + DURATION */}
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Date *</Text>
            <TouchableOpacity style={styles.dateBtn} onPress={() => setShowPicker(true)}>
              <Text style={{ color: "white", fontWeight: "600" }}>
                {date ? date : "Select date"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.label}>Duration (hours)</Text>
            <TextInput
              style={styles.input}
              value={duration}
              keyboardType="numeric"
              onChangeText={setDuration}
              placeholder="Eg. 5"
            />
          </View>
        </View>

        {showPicker && (
          <DateTimePicker
            mode="date"
            value={new Date()}
            onChange={onDateChange}
          />
        )}

        {/* LENGTH */}
        <Text style={styles.label}>Length (km) *</Text>
        <TextInput
          style={styles.input}
          value={length}
          keyboardType="numeric"
          onChangeText={setLength}
          placeholder="Eg. 10.5"
        />

        {/* DIFFICULTY */}
        <Text style={styles.label}>Difficulty *</Text>
        <View style={styles.dropdown}>
          {["Easy", "Medium", "Hard"].map((d) => (
            <TouchableOpacity key={d} onPress={() => setDifficulty(d)}>
              <Text style={[styles.dropItem, difficulty === d && styles.dropItemSelected]}>
                {d}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* PARKING */}
        <Text style={styles.label}>Parking available?</Text>
        <View style={styles.row}>
          {["Yes", "No"].map((p) => (
            <View key={p} style={styles.radioRow}>
              <TouchableOpacity
                style={[styles.radioOuter, parking === p && styles.radioSelected]}
                onPress={() => setParking(p)}
              />
              <Text>{p}</Text>
            </View>
          ))}
        </View>

        {/* TRAIL TYPE */}
        <Text style={styles.label}>Trail Type</Text>
        <TextInput
          style={styles.input}
          value={trailType}
          onChangeText={setTrailType}
          placeholder="Eg. Loop, Out and back"
        />

        {/* DESCRIPTION */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.textarea}
          value={description}
          onChangeText={setDescription}
          placeholder="Notes, special views, tips..."
          multiline
        />

        {/* BUTTONS */}
        <View style={styles.row}>
          <TouchableOpacity style={styles.previewBtn} onPress={preview}>
            <Text style={styles.previewText}>Preview</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resetBtn} onPress={resetForm}>
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 6 },
  subtitle: { color: "#444", marginBottom: 20 },
  label: { marginTop: 12, marginBottom: 5, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12
  },
  textarea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    height: 120,
    padding: 12
  },
  row: { flexDirection: "row", marginTop: 10 },
  dateBtn: {
    backgroundColor: "green",
    padding: 14,
    borderRadius: 10,
    alignItems: "center"
  },
  dropdown: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#ccc",
    overflow: "hidden"
  },
  dropItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    color: "#555"
  },
  dropItemSelected: {
    backgroundColor: "#def",
    color: "black",
    fontWeight: "bold"
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 18
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#444",
    marginRight: 8
  },
  radioSelected: {
    backgroundColor: "#4CAF50"
  },
  previewBtn: {
    flex: 1,
    backgroundColor: "green",
    padding: 15,
    borderRadius: 10,
    marginTop: 20
  },
  previewText: { textAlign: "center", color: "white", fontSize: 16 },
  resetBtn: {
    flex: 1,
    backgroundColor: "#ddd",
    padding: 15,
    borderRadius: 10,
    marginLeft: 10,
    marginTop: 20
  },
  resetText: { textAlign: "center", color: "#333", fontSize: 16 }
});
