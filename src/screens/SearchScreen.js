import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useState } from 'react';
import { searchHikesByName } from '../db/database';

export default function SearchScreen({ navigation }) {
  const [q, setQ] = useState("");
  const [res, setRes] = useState([]);

  const search = async () => {
    const data = await searchHikesByName(q);
    setRes(data);
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        value={q}
        onChangeText={setQ}
        placeholder="Search hike..."
        style={{ borderWidth: 1, padding: 10 }}
      />

      <TouchableOpacity onPress={search} style={{ marginTop: 12 }}>
        <Text style={{ backgroundColor: "black", color: "white", padding: 12, textAlign: "center" }}>
          Search
        </Text>
      </TouchableOpacity>

      <FlatList
        data={res}
        keyExtractor={(i) => i.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("HikeDetail", { hike: item })}
            style={{ padding: 12, borderWidth: 1, marginTop: 12, borderRadius: 8 }}
          >
            <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
            <Text>{item.location}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
