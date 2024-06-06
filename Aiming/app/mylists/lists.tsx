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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";
import { Link, router } from "expo-router";

interface List {
  id: string;
  name: string;
  items: string[];
}

const MyTodoList: React.FC = () => {
  const [lists, setLists] = useState<List[]>([]);
  const [listName, setListName] = useState<string>("");
  const [isAddingList, setIsAddingList] = useState<boolean>(false);
  const textInputRef = useRef<TextInput>(null);
  const navigation = useNavigation();

  useEffect(() => {
    loadLists();
  }, []);

  useEffect(() => {
    if (isAddingList) {
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 100);
    }
  }, [isAddingList]);

  const loadLists = async () => {
    try {
      const storedLists = await AsyncStorage.getItem("lists");
      if (storedLists) {
        const parsedLists = JSON.parse(storedLists);
        setLists(parsedLists);
        console.log("Loaded lists from AsyncStorage:", parsedLists);
      } else {
        console.log("No lists found in AsyncStorage");
      }
    } catch (error) {
      console.error("Failed to load lists from AsyncStorage:", error);
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

  const addList = () => {
    if (listName.trim().length > 0) {
      const newList: List = {
        id: Date.now().toString(),
        name: listName,
        items: [],
      };
      const newLists = [...lists, newList];
      setLists(newLists);
      saveLists(newLists);
      setListName("");
      setIsAddingList(false);
    }
  };

  const renderList = ({ item }: { item: List }) => (
    <Pressable
      style={styles.listContainer}
      onPress={() =>
        router.push({
          pathname: "mylists/mylistsdetail/[listid]",
          params: { listid: item.id },
        })
      }
    >
      <Text style={styles.listName}>{item.name}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Todo Lists</Text>
      <FlatList
        data={lists}
        renderItem={renderList}
        keyExtractor={(item) => item.id}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setIsAddingList(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <Modal visible={isAddingList} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              ref={textInputRef}
              style={styles.input}
              onChangeText={setListName}
              value={listName}
              placeholder="List Name"
            />
            <Button title="Save" onPress={addList} />
            <Button title="Cancel" onPress={() => setIsAddingList(false)} />
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
  listContainer: {
    marginBottom: 20,
    padding: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
  },
  listName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
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

export default MyTodoList;
