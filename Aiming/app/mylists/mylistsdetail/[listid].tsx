import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";
import ThemedView from "@/app/ThemedView";
import { useTheme } from "@/app/ThemeContext";
import CustomModalWindow from "@/components/customModalWindow";
import {
  addItem,
  sortItems,
  List,
  Todo,
  editTodoItem,
} from "@/components/itemUtils";

const ListDetail: React.FC = () => {
  const [list, setList] = useState<List | null>(null);
  const [itemName, setItemName] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [isAddingItem, setIsAddingItem] = useState<boolean>(false);
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);
  const [isEditingItem, setIsEditingItem] = useState<boolean>(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const textInputRef = useRef<TextInput>(null);
  const { listid } = useLocalSearchParams<{ listid: string }>();
  const { colors } = useTheme();

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

  const renderListItem = ({ item }: { item: Todo }) => {
    const isEditingCurrentItem = currentItemId === item.id;

    return (
      <TouchableOpacity
        onLongPress={() => handleLongPress(item.id)}
        onPress={() => toggleComplete(item.id)}
        style={[
          styles.listItem,
          { borderColor: colors.listContainerBorderColor },
        ]}
      >
        <Text
          style={[
            styles.listItemText,
            item.completed && styles.completedItemText,
            { color: colors.textColor },
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
            <Text style={[styles.title, { color: colors.textColor }]}>
              {list.name}
            </Text>
            <FlatList
              data={list.items}
              renderItem={renderListItem}
              keyExtractor={(item) => item.id}
            />
            <TouchableOpacity
              style={[
                styles.addButton,
                { backgroundColor: colors.buttonBackgroundColor },
              ]}
              onPress={() => {
                setIsAddingItem(true);
                setItemName("");
              }}
            >
              <Text
                style={[
                  styles.addButtonText,
                  { color: colors.buttonTextColor },
                ]}
              >
                +
              </Text>
            </TouchableOpacity>
          </>
        )}
        {selectedItemId && (
          <View
            style={[
              styles.actionBar,
              { backgroundColor: colors.actionBarColor },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: colors.buttonBackgroundColor },
              ]}
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
              <Icon name="pencil" size={20} color={colors.buttonTextColor} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: colors.buttonBackgroundColor },
              ]}
              onPress={() => deleteItem(selectedItemId)}
            >
              <Icon name="trash" size={20} color={colors.buttonTextColor} />
            </TouchableOpacity>
          </View>
        )}
        <CustomModalWindow
          open={isAddingItem}
          onPressSave={() =>
            addItem(
              list,
              itemName,
              sortItems,
              setList,
              saveList,
              setItemName,
              setIsAddingItem
            )
          }
          onPressCancel={() => setIsAddingItem(false)}
        >
          <TextInput
            ref={textInputRef}
            style={[
              styles.input,
              {
                color: colors.inputTextColor,
                borderColor: colors.inputBorderColor,
              },
            ]}
            onChangeText={setItemName}
            value={itemName}
            placeholder="Item Name"
          />
        </CustomModalWindow>
        <CustomModalWindow
          open={isEditingItem}
          onPressSave={() =>
            editTodoItem(
              list,
              currentItemId,
              itemName,
              sortItems,
              setList,
              saveList,
              setItemName,
              setIsEditingItem
            )
          }
          onPressCancel={() => setIsEditingItem(false)}
        >
          <TextInput
            ref={textInputRef}
            style={[
              styles.input,
              {
                color: colors.inputTextColor,
                borderColor: colors.inputBorderColor,
              },
            ]}
            onChangeText={setItemName}
            value={itemName}
            placeholder="Edit Item"
          />
        </CustomModalWindow>
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

  addButton: {
    position: "absolute",
    bottom: 30,
    left: "50%",

    width: 50,
    height: 50,

    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 30,
  },
});

export default ListDetail;
