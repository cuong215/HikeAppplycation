import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { insertObservation, updateObservation, getObservationById } from '../../db/database';

export default function ObservationFormScreen({ route, navigation }) {
  // Lấy param an toàn
  const { hikeId, obsId } = route.params || {};

  const [obsText, setObsText] = useState("");
  const [comments, setComments] = useState("");

  useEffect(() => {
    if (obsId) {
      load();
    }
  }, [obsId]);

  const load = async () => {
    try {
      const data = await getObservationById(obsId);
      if (data) {
        setObsText(data.observationText);
        setComments(data.comments || "");
      }
    } catch (e) {
      console.error("Error loading observation", e);
    }
  };

  const getCurrentTime = () => {
    // Format YYYY-MM-DD HH:mm
    return new Date().toISOString().slice(0, 16).replace("T", " ");
  };

  const save = async () => {
    if (!obsText.trim()) {
      Alert.alert("Error", "Observation text is required!");
      return;
    }

    const timeNow = getCurrentTime();

    try {
      if (obsId) {
        // UPDATE
        await updateObservation({
          id: obsId,
          observationText: obsText.trim(),
          comments: comments.trim(),
          time: timeNow
        });
      } else {
        // INSERT
        if (!hikeId) {
            Alert.alert("Error", "Missing Hike ID");
            return;
        }
        await insertObservation({
          hikeId: hikeId,
          observationText: obsText.trim(),
          comments: comments.trim(),
          time: timeNow
        });
      }
      navigation.goBack();
    } catch (error) {
      console.error("Save Error:", error);
      Alert.alert("Error", "Could not save observation.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Observation *</Text>
      <TextInput
        style={styles.input}
        value={obsText}
        onChangeText={setObsText}
        placeholder="What did you see?"
      />

      <Text style={styles.label}>Comments (optional)</Text>
      <TextInput
        style={styles.input}
        value={comments}
        onChangeText={setComments}
        placeholder="Additional notes..."
      />

      <TouchableOpacity onPress={save} style={styles.btn}>
        <Text style={styles.btnText}>
          {obsId ? "Update Observation" : "Save Observation"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    label: { fontWeight: 'bold', marginTop: 10, marginBottom: 5 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, backgroundColor: 'white' },
    btn: { backgroundColor: 'blue', padding: 15, marginTop: 20, borderRadius: 8 },
    btnText: { color: 'white', textAlign: 'center', fontWeight: 'bold' }
});