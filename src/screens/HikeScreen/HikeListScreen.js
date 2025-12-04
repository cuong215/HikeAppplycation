import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { getAllHikes, deleteHike } from '../../db/database';
import { Ionicons } from '@expo/vector-icons'; // (Tùy chọn) Thêm icon cho đẹp

export default function HikeListScreen({ navigation }) {
  const [hikes, setHikes] = useState([]);

  const load = async () => {
    try {
      const data = await getAllHikes();
      setHikes(data);
    } catch (e) {
      console.error("Lỗi load danh sách:", e);
    }
  };

  useEffect(() => {
    const unsub = navigation.addListener('focus', load);
    return unsub;
  }, []);

  // Hàm xử lý xóa có hộp thoại xác nhận
  const handleDelete = (id, name) => {
    Alert.alert(
      "Delete Hike",
      `Are you sure you want to delete "${name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            try {
              await deleteHike(id);
              load(); // Load lại danh sách ngay sau khi xóa
            } catch (error) {
              Alert.alert("Error", "Could not delete hike");
              console.error(error);
            }
          } 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.navigate("Search")}>
          <Text style={styles.topBtn}>Search</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("HikeForm")}>
          <Text style={styles.topBtn}>+ Add Hike</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={hikes}
        keyExtractor={(i) => i.id.toString()}
        renderItem={({ item }) => (
          // Thay đổi cấu trúc: Card bọc ngoài View, nút Delete tách biệt
          <View style={styles.cardContainer}>
            
            {/* Phần nội dung: Bấm vào thì xem chi tiết */}
            <TouchableOpacity 
              style={styles.cardContent}
              onPress={() => navigation.navigate("HikeDetail", { hike: item })}
            >
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.subtitle}>{item.location} • {item.date}</Text>
            </TouchableOpacity>

            {/* Phần nút xóa: Tách biệt rõ ràng */}
            <TouchableOpacity 
              style={styles.deleteBtn} 
              onPress={() => handleDelete(item.id, item.name)}
            >
               <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>

          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#f5f5f5' },
  topBar: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  topBtn: { fontSize: 18, color: "#007AFF", fontWeight: "600" },
  
  cardContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2, // Đổ bóng cho Android
    shadowColor: '#000', // Đổ bóng cho iOS
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    flex: 1,
    padding: 15,
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#333" },
  subtitle: { color: "#666", marginTop: 4 },
  
  deleteBtn: {
    backgroundColor: "#FF3B30",
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14
  }
});