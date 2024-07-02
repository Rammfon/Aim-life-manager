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
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";
import ThemedView from "@/app/ThemedView";
import { useTheme } from "@/app/ThemeContext";
interface List {
  id: string;
  name: string;
  items: Item[];
}

interface Item {
  id: string;
  title: string;
  completed: boolean;
}

const ListDetail: React.FC = () => {
  const [list, setList] = useState<List | null>(null);
  const [itemName, setItemName] = useState<string>("");
  const [isAddingItem, setIsAddingItem] = useState<boolean>(false);
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);
  const [isEditingItem, setIsEditingItem] = useState<boolean>(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const textInputRef = useRef<TextInput>(null);
  const { listid } = useLocalSearchParams<{ listid: string }>();
  const { textColor, iconColor } = useTheme();
  useEffect(() => {
    loadList();
  }, [listid]);

  useEffect(() => {
    if (isAddingItem || isEditingItem) {
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 100);
    }
  }, [isAddingItem, isEditingItem]);

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

  const saveList = async (updatedList: List) => {
    try {
      const storedLists = await AsyncStorage.getItem("lists");
      if (storedLists) {
        const parsedLists: List[] = JSON.parse(storedLists);
        const newLists = parsedLists.map((list) =>
          list.id === updatedList.id ? updatedList : list
        );
        await AsyncStorage.setItem("lists", JSON.stringify(newLists));
        console.log("Saved updated list to AsyncStorage:", newLists);
      }
    } catch (error) {
      console.error("Failed to save updated list to AsyncStorage:", error);
    }
  };

  const sortItems = (items: Item[]): Item[] => {
    return items.sort((a, b) => Number(a.completed) - Number(b.completed));
  };

  const addItem = () => {
    if (list && itemName.trim().length > 0) {
      const newItem = {
        id: Date.now().toString(),
        title: itemName,
        completed: false,
      };
      const newItems = sortItems([...list.items, newItem]);
      const updatedList = { ...list, items: newItems };
      setList(updatedList);
      saveList(updatedList);
      setItemName("");
      setIsAddingItem(false);
    }
  };

  const editItem = () => {
    if (list && currentItemId && itemName.trim().length > 0) {
      const newItems = sortItems(
        list.items.map((item) =>
          item.id === currentItemId ? { ...item, title: itemName } : item
        )
      );
      const updatedList = { ...list, items: newItems };
      setList(updatedList);
      saveList(updatedList);
      setItemName("");
      setCurrentItemId(null);
      setIsEditingItem(false);
    }
  };

  const deleteItem = (itemId: string) => {
    if (list) {
      const newItems = sortItems(
        list.items.filter((item) => item.id !== itemId)
      );
      const updatedList = { ...list, items: newItems };
      setList(updatedList);
      saveList(updatedList);
      setSelectedItemId(null);
    }
  };

  const toggleComplete = (itemId: string) => {
    if (list) {
      const newItems = sortItems(
        list.items.map((item) =>
          item.id === itemId ? { ...item, completed: !item.completed } : item
        )
      );
      const updatedList = { ...list, items: newItems };
      setList(updatedList);
      saveList(updatedList);
    }
  };

  const handleLongPress = (itemId: string) => {
    setSelectedItemId(itemId);
  };

  const renderListItem = ({ item }: { item: Item }) => {
    const isEditingCurrentItem = currentItemId === item.id;

    return (
      <TouchableOpacity
        onLongPress={() => handleLongPress(item.id)}
        onPress={() => toggleComplete(item.id)}
        style={[
          styles.listItem,
          isEditingCurrentItem && styles.editingListItem,
        ]}
      >
        <Text
          style={[
            styles.listItemText,
            item.completed && styles.completedItemText,
            { color: textColor },
          ]}
        >
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={() => setSelectedItemId(null)}>
      <ThemedView style={styles.container}>
        {list && (
          <>
            <Text style={[styles.title, { color: textColor }]}>
              {list.name}
            </Text>
            <FlatList
              data={list.items}
              renderItem={renderListItem}
              keyExtractor={(item) => item.id}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setIsAddingItem(true)}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </>
        )}
        {selectedItemId && (
          <View style={styles.actionBar}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                const item = list?.items.find(
                  (item) => item.id === selectedItemId
                );
                setCurrentItemId(selectedItemId);
                setItemName(item ? item.title : "");
                setIsEditingItem(true);
                setSelectedItemId(null);
              }}
            >
              <Icon name="pencil" size={20} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => deleteItem(selectedItemId)}
            >
              <Icon name="trash" size={20} color="#000" />
            </TouchableOpacity>
          </View>
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
              <Button title="Cancel" onPress={() => setIsAddingItem(false)} />
            </View>
          </View>
        </Modal>
        <Modal visible={isEditingItem} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TextInput
                ref={textInputRef}
                style={styles.input}
                onChangeText={setItemName}
                value={itemName}
                placeholder="Edit Item"
              />
              <Button title="Save" onPress={editItem} />
              <Button title="Cancel" onPress={() => setIsEditingItem(false)} />
            </View>
          </View>
        </Modal>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  listItemText: {
    fontSize: 18,
  },
  completedItemText: {
    textDecorationLine: "line-through",
    color: "#aaa",
  },

  actionBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f9f9f9",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    marginHorizontal: 5,
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
  editingListItem: {
    backgroundColor: "#e0f7fa",
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    left: "50%",

    width: 50,
    height: 50,
    backgroundColor: "blue",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 30,
  },
});

export default ListDetail;
