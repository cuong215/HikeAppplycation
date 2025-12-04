import { View, Text, Button, StyleSheet } from "react-native";
import { getObservationById } from "../../db/database";
import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";

export default function ObservationDetailScreen({ route, navigation }) {
  const { obsId, hikeId } = route.params;
  const [obs, setObs] = useState(null);
  const isFocused = useIsFocused();

  const load = async () => {
    const data = await getObservationById(obsId);
    setObs(data);
  };

  useEffect(() => {
    if (isFocused) load();
  }, [isFocused]);

  if (!obs) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.time}>{obs.time}</Text>
      <Text style={styles.text}>{obs.observationText}</Text>
      {obs.comments ? <Text style={styles.comment}>{obs.comments}</Text> : null}

      <View style={{ marginTop: 20 }}>
        <Button
          title="Edit Observation"
          onPress={() =>
            navigation.navigate("ObservationForm", { obsId, hikeId })
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  text: { fontSize: 18, fontWeight: "600", marginTop: 10 },
  time: { color: "gray", fontSize: 14 },
  comment: { marginTop: 10, fontStyle: "italic", color: "#555" },
});
