import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";

interface Data {
  id: string;
  title: string;
  price: number;
  description: string;
  image: string;
}

const App = () => {
  const [datas, setDatas] = useState<Data[]>([]);
  const [editingData, setEditingData] = useState<Data | null>(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<string>("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const baseURL = "https://6730de8c7aaf2a9aff0f2e89.mockapi.io/menu";

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(baseURL);
      setDatas(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const postData = async () => {
    if (!title || !price || !description || !image) {
      Alert.alert("Validation", "All fields are required");
      return;
    }

    try {
      const newData = { title, price: Number(price), description, image };
      await axios.post(baseURL, newData);
      fetchData();
      resetForm();
    } catch (error) {
      Alert.alert("Error", "Failed to add data");
    }
  };

  const deleteData = async (id: string) => {
    try {
      await axios.delete(`${baseURL}/${id}`);
      fetchData();
    } catch (error) {
      Alert.alert("Error", "Failed to delete data");
    }
  };

  const editData = async (id: string) => {
    if (!title || !price || !description || !image) {
      Alert.alert("Validation", "All fields are required");
      return;
    }

    try {
      const updatedData = { title, price: Number(price), description, image };
      await axios.put(`${baseURL}/${id}`, updatedData);
      fetchData();
      setEditingData(null);
      resetForm();
    } catch (error) {
      Alert.alert("Error", "Failed to update data");
    }
  };

  const resetForm = () => {
    setTitle("");
    setPrice("");
    setDescription("");
    setImage("");
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#E8F5FF" }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Menu Makanan Favorit</Text>
        </View>

        {editingData && (
          <View style={styles.formContainer}>
            <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={styles.input} />
            <TextInput
              placeholder="Price"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} />
            <TextInput placeholder="Image URL" value={image} onChangeText={setImage} style={styles.input} />
            <TouchableOpacity onPress={() => editData(editingData.id)} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
        ) : (
          <View style={styles.productList}>
            {datas.map((data) => (
              <View key={data.id} style={styles.productContainer}>
                <Image source={{ uri: data.image }} style={styles.image} />
                <Text style={styles.title}>{data.title}</Text>
                <Text style={styles.description}>{data.description}</Text>
                <Text style={styles.price}>Rp {data.price}</Text>
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    onPress={() => {
                      setEditingData(data);
                      setTitle(data.title);
                      setPrice(String(data.price));
                      setDescription(data.description);
                      setImage(data.image);
                    }}
                    style={styles.editButton}
                  >
                    <Ionicons name="create-outline" size={24} color="#007AFF" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteData(data.id)} style={styles.deleteButton}>
                    <Ionicons name="trash-outline" size={24} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity onPress={postData} style={styles.floatingButton}>
        <Ionicons name="add-outline" size={30} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // Sama seperti sebelumnya
  // (biarkan tidak berubah untuk tampilan yang telah rapi)
  container: {
    padding: 10,
  },
  header: {
    backgroundColor: "#007AFF",
    paddingVertical: 20,
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 10,
  },
  headerText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D1D1",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#F9F9F9",
  },
  saveButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  productList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productContainer: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
    marginHorizontal: 10,
  },
  description: {
    fontSize: 14,
    color: "#6B7280",
    marginHorizontal: 10,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
    marginTop: 5,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  editButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
  },
});

export default App;
