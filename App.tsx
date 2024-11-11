import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView } from "react-native";
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
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const baseURL = "https://6730de8c7aaf2a9aff0f2e89.mockapi.io/menu";

  const fetchData = async () => {
    try {
      const response = await axios.get(baseURL);
      setDatas(response.data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const postData = async () => {
    try {
      const newData = {
        title: "Nasi goreng",
        price: 90000,
        description: "Harga",
        image: "https://i.pinimg.com/474x/8e/3e/f5/8e3ef5742d9d7334acb03872f239db20.jpg",
      };
      const response = await axios.post(baseURL, newData);
      fetchData();
    } catch (error) {
      console.log("Error posting data:", error);
    }
  };

  // Delete item from the API
  const deleteData = async (id: string) => {
    try {
      await axios.delete(`${baseURL}/${id}`);
      fetchData(); // Refresh data after deletion
    } catch (error) {
      console.log("Error deleting data:", error);
    }
  };

  // Edit item in the API
  const editData = async (id: string) => {
    try {
      const updatedData = { title, price, description, image };
      await axios.put(`${baseURL}/${id}`, updatedData);
      fetchData();
      setEditingData(null);
    } catch (error) {
      console.log("Error updating data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {/* Title Section */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Daftar Menu Makanan favorit</Text>
        </View>

        {/* Editing Section */}
        {editingData ? (
          <View>
            <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={styles.input} />
            <TextInput
              placeholder="Price"
              value={String(price)}
              onChangeText={(text) => setPrice(Number(text))}
              style={styles.input}
            />
            <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} />
            <TextInput placeholder="Image URL" value={image} onChangeText={setImage} style={styles.input} />
            <TouchableOpacity onPress={() => editData(editingData.id)} style={styles.button}>
              <Text style={{ color: "white" }}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* List of Menu Items */}
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
                    setPrice(data.price);
                    setDescription(data.description);
                    setImage(data.image);
                  }}
                  style={styles.button}
                >
                  <Ionicons name="create-outline" size={30} color="#7e9bbf" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteData(data.id)} style={styles.button}>
                  <Ionicons name="trash-outline" size={30} color="#9c4441" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity onPress={postData} style={styles.floatingButton}>
        <Ionicons name="add-outline" size={40} color="#3b5670" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#D2B48C",
    padding: 10,
    flex: 1,
  },
  header: {
    backgroundColor: "#8B4513",
    paddingVertical: 20,
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 5,
  },
  headerText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#8B4513", 
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#F5DEB3", 
  },
  button: {
    backgroundColor: "#8B4513",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#D2B48C",
    padding: 15,
    borderRadius: 50,
    opacity: 0.8,
  },
  productList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    padding: 10,
  },
  productContainer: {
    width: "45%",
    borderWidth: 1,
    borderColor: "#8B4513",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#A0522D", 
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 5,
    color: "#FFF8DC", 
  },
  description: {
    fontSize: 15,
    color: "#FFF8DC",
    marginBottom: 5,
  },
  price: {
    fontSize: 20,
    color: "#FFF8DC",
    marginBottom: 5,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});

export default App;
