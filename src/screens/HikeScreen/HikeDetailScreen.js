import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import ObservationListItem from "../ObservationScreen/ObservationListItem";
import { getObservationsByHike, deleteObservation } from '../../db/database';
import { useEffect, useState } from 'react';

export default function HikeDetailScreen({ route, navigation }) {
  const { hike } = route.params;

  const [obs, setObs] = useState([]);

  const load = async () => {
    const data = await getObservationsByHike(hike.id);
    setObs(data);
  };

  useEffect(() => {
    const unsub = navigation.addListener("focus", load);
    return unsub;
  }, []);

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={styles.name}>{hike.name}</Text>

      {Object.entries({
        Location: hike.location,
        Date: hike.date,
        Parking: hike.parking,
        Length: `${hike.length} km`,
        Difficulty: hike.difficulty,
        Description: hike.description,
      }).map(([k, v]) => (
        <Text style={styles.item} key={k}>{k}: {v}</Text>
      ))}

      <TouchableOpacity
        onPress={() => navigation.navigate("HikeForm", { hike })}
        style={styles.btn}
      >
        <Text style={styles.btnText}>Edit Hike</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("ObservationForm", { hikeId: hike.id })}
        style={styles.btn}
      >
        <Text style={styles.btnText}>+ Add Observation</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Observations</Text>

      {obs.map(o => (
  <ObservationListItem
    key={o.id}
    item={o}
    onDetail={() => navigation.navigate("ObservationDetail", { obsId: o.id })}
    onEdit={() =>
      navigation.navigate("ObservationForm", { obsId: o.id, hikeId: hike.id })
    }
    onDelete={async () => {
      await deleteObservation(o.id);
      load();
    }}
  />
))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  name: { fontSize: 24, fontWeight: "bold" },
  item: { marginTop: 6 },
  btn: { backgroundColor: "black", padding: 12, marginTop: 14, borderRadius: 6 },
  btnText: { color: "white", textAlign: "center" },
  title: { fontSize: 20, marginTop: 20, fontWeight: "bold" },
  card: { padding: 12, borderWidth: 1, borderRadius: 8, marginVertical: 6 },
  obsTime: { fontWeight: "bold", marginBottom: 4 }
});
