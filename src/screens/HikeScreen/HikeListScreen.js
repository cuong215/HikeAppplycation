import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { getAllHikes, deleteHike } from '../../db/database';

export default function HikeListScreen({ navigation }) {
  const [hikes, setHikes] = useState([]);

  const load = async () => {
    const data = await getAllHikes();
    setHikes(data);
  };

  useEffect(() => {
    const unsub = navigation.addListener('focus', load);
    return unsub;
  }, []);

  const remove = async (id) => {
    await deleteHike(id);
    load();
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.navigate("Search")}>
          <Text style={styles.topBtn}>Search</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("HikeForm")}>
          <Text style={styles.topBtn}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={hikes}
        keyExtractor={(i) => i.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("HikeDetail", { hike: item })}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.name}</Text>
              <Text>{item.location}</Text>
              <Text>{item.date}</Text>
            </View>

            <TouchableOpacity onPress={() => remove(item.id)}>
              <Text style={styles.delete}>Delete</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  topBar: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  topBtn: { fontSize: 18, color: "blue" },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 12
  },
  title: { fontSize: 20, fontWeight: "bold" },
  delete: { color: "red", fontSize: 16 }
});
