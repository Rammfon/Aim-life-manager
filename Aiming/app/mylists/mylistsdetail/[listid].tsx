import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";

interface List {
  id: string;
  name: string;
  items: string[];
}

const ListDetail: React.FC = () => {
  const [list, setList] = useState<List | null>(null);
  const [itemName, setItemName] = useState<string>("");
  const [isAddingItem, setIsAddingItem] = useState<boolean>(false);
  const textInputRef = useRef<TextInput>(null);
  const { listid } = useLocalSearchParams<{ listid: string }>();

  useEffect(() => {
    loadList();
  }, [listid]);

  useEffect(() => {
    if (isAddingItem) {
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 100);
    }
  }, [isAddingItem]);

  const loadList = async () => {
    try {
      const storedLists = await AsyncStorage.getItem("lists");
      if (storedLists) {
        const parsedLists: List[] = JSON.parse(storedLists);
        const currentList = parsedLists.find((list) => list.id === listid);
        setList(currentList || null);
        console.log("Loaded list from AsyncStorage:", currentList);
      } else {
        console.log("No lists found in AsyncStorage");
      }
    } catch (error) {
      console.error("Failed to load list from AsyncStorage:", error);
    }
  };

  const saveLists = async (newLists: List[]) => {
    try {
      await AsyncStorage.setItem("lists", JSON.stringify(newLists));
      console.log("Saved lists to AsyncStorage:", newLists);
    } catch (error) {
      console.error("Failed to save lists to AsyncStorage:", error);
    }
  };

  const addItem = () => {
    if (list && itemName.trim().length > 0) {
      const newItems = [...list.items, itemName];
      const updatedList = { ...list, items: newItems };
      setList(updatedList);
      updateLists(updatedList);
      setItemName("");
      setIsAddingItem(false);
    }
  };

  const updateLists = async (updatedList: List) => {
    try {
      const storedLists = await AsyncStorage.getItem("lists");
      if (storedLists) {
        const parsedLists: List[] = JSON.parse(storedLists);
        const newLists = parsedLists.map((list) =>
          list.id === updatedList.id ? updatedList : list
        );
        await saveLists(newLists);
      }
    } catch (error) {
      console.error("Failed to update lists in AsyncStorage:", error);
    }
  };

  const renderListItem = ({ item }: { item: string }) => (
    <Text style={styles.listItemText}>{item}</Text>
  );

  const cancelAdding = () => {
    setIsAddingItem(false);
    setItemName("");
  };

  return (
    <View style={styles.container}>
      {list && (
        <>
          <Text style={styles.title}>{list.name}</Text>
          <FlatList
            data={list.items}
            renderItem={renderListItem}
            keyExtractor={(item, index) => index.toString()}
          />
          <TouchableOpacity
            style={styles.addItemButton}
            onPress={() => setIsAddingItem(true)}
          >
            <Text style={styles.addItemButtonText}>Add Item</Text>
          </TouchableOpacity>
        </>
      )}

      <Modal visible={isAddingItem} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              ref={textInputRef}
              style={styles.input}
              onChangeText={setItemName}
              value={itemName}
              placeholder="Item Name"
            />
            <Button title="Save" onPress={addItem} />
            <Button title="Cancel" onPress={cancelAdding} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  listItemText: {
    fontSize: 18,
    paddingVertical: 5,
  },
  addItemButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "blue",
    borderRadius: 5,
    alignItems: "center",
  },
  addItemButtonText: {
    color: "white",
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  input: {
    borderColor: "#ddd",
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 10,
    width: "100%",
  },
});

export default ListDetail;
