import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { insertObservation, updateObservation, getObservationById } from '../../db/database';

export default function ObservationFormScreen({ route, navigation }) {
  const { hikeId, obsId } = route.params ?? {};

  const [obsText, setObsText] = useState("");
  const [comments, setComments] = useState("");

  useEffect(() => {
    if (obsId) {
      load();
    }
  }, []);

  const load = async () => {
    const data = await getObservationById(obsId);
    setObsText(data.observationText);
    setComments(data.comments || "");
  };

  const getCurrentTime = () => {
    return new Date().toISOString().slice(0, 16).replace("T", " ");
  };

 const save = async () => {
  if (!obsText.trim()) {
    Alert.alert("Error", "Observation is required!");
    return;
  }

  const timeNow = getCurrentTime();

  if (obsId) {
    await updateObservation({
      id: obsId,
      observationText: obsText.trim(), // FIXED
      comments: comments.trim(),
      time: timeNow
    });
  } else {
    await insertObservation({
      hikeId,
      observationText: obsText.trim(), 
      comments: comments.trim(),
      time: timeNow
    });
  }

  navigation.goBack(); 
};

  return (
    <View style={{ padding: 20 }}>
      <Text>Observation</Text>
      <TextInput
        style={{ borderWidth: 1, padding: 10 }}
        value={obsText}
        onChangeText={setObsText}
        placeholder="Enter observation"
      />

      <Text style={{ marginTop: 12 }}>Comments (optional)</Text>
      <TextInput
        style={{ borderWidth: 1, padding: 10 }}
        value={comments}
        onChangeText={setComments}
        placeholder="Comments here..."
      />

      <TouchableOpacity
        onPress={save}
        style={{
          backgroundColor: obsId ? "orange" : "blue",
          padding: 16,
          marginTop: 20,
          borderRadius: 6,
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          {obsId ? "Update Observation" : "Save Observation"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
