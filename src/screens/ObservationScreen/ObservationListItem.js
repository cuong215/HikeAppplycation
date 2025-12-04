import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ObservationListItem({ item, onEdit, onDelete, onDetail }) {
  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={onDetail}>
        {/* FIX FIELD */}
        <Text style={styles.text}>{item.observationText}</Text>

        <Text style={styles.time}>{item.time}</Text>

        {item.comments ? (
          <Text style={styles.comment}>💬 {item.comments}</Text>
        ) : null}
      </TouchableOpacity>

      <View style={styles.row}>
        <TouchableOpacity onPress={onEdit}>
          <Ionicons name="create-outline" size={22} color="#007AFF" />
        </TouchableOpacity>

        <TouchableOpacity onPress={onDelete}>
          <Ionicons
            name="trash-outline"
            size={22}
            color="#FF3B30"
            style={{ marginLeft: 20 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    marginVertical: 8,
    elevation: 2,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: { fontSize: 16, fontWeight: "600" },
  time: { fontSize: 12, color: "gray", marginTop: 4 },
  comment: { marginTop: 6, fontStyle: "italic", color: "#444" },
  row: { flexDirection: "row", alignItems: "center" },
});
