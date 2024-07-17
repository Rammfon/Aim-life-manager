import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";
import { Link, router } from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";
import {
  MenuProvider,
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import MainPageMenu from "@/components/mainPageMenu";
import ThemedView from "../ThemedView";
import { useTheme } from "../ThemeContext";
import CustomModalWindow from "@/components/customModalWindow";
import { menuOptionsStyles } from "@/components/menuOptionsStyle";
interface List {
  id: string;
  name: string;
  items: string[];
}

const MyTodoList: React.FC = () => {
  const [lists, setLists] = useState<List[]>([]);
  const [listName, setListName] = useState<string>("");
  const [isAddingList, setIsAddingList] = useState<boolean>(false);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [isSelectingForDeletion, setIsSelectingForDeletion] =
    useState<boolean>(false);
  const [listsToDelete, setListsToDelete] = useState<Set<string>>(new Set());
  const [isConfirmDeleteVisible, setIsConfirmDeleteVisible] =
    useState<boolean>(false);
  const textInputRef = useRef<TextInput>(null);
  const { colors } = useTheme();

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

  const toggleSelectForDeletion = (listId: string) => {
    setListsToDelete((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(listId)) {
        newSet.delete(listId);
      } else {
        newSet.add(listId);
      }
      return newSet;
    });
  };

  const confirmDeleteSelectedLists = () => {
    setIsConfirmDeleteVisible(true);
  };

  const deleteSelectedLists = () => {
    const newLists = lists.filter((list) => !listsToDelete.has(list.id));
    setLists(newLists);
    saveLists(newLists);
    setIsSelectingForDeletion(false);
    setListsToDelete(new Set());
    setIsConfirmDeleteVisible(false);
  };

  const cancelDelete = () => {
    setIsSelectingForDeletion(false);
    setListsToDelete(new Set());
    setIsConfirmDeleteVisible(false);
  };

  const renderList = ({ item }: { item: List }) => (
    <View>
      <Pressable
        style={[
          styles.listContainer,
          { borderColor: colors.listContainerBorderColor },
        ]}
        onLongPress={() => setSelectedListId(item.id)}
        onPress={() =>
          isSelectingForDeletion
            ? toggleSelectForDeletion(item.id)
            : router.push({
                pathname: "mylists/mylistsdetail/[listid]",
                params: { listid: item.id },
              })
        }
      >
        <Text style={[styles.listName, { color: colors.textColor }]}>
          {item.name}
        </Text>
        {isSelectingForDeletion && listsToDelete.has(item.id) && (
          <Icon name="checkmark" size={20} color="green" />
        )}
      </Pressable>
    </View>
  );

  return (
    <MenuProvider>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textColor }]}>
            My Lists
          </Text>
          <Menu>
            <MenuTrigger>
              <Icon
                name="menu"
                size={30}
                color="#000"
                style={[styles.menuIcon, { color: colors.iconColor }]}
              />
            </MenuTrigger>
            <MenuOptions customStyles={menuOptionsStyles(colors)}>
              <MenuOption
                onSelect={() => {
                  setIsSelectingForDeletion(!isSelectingForDeletion);
                }}
              >
                <Text
                  style={[
                    styles.menuOptionText,
                    { color: colors.buttonTextColor },
                  ]}
                >
                  Delete lists
                </Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
        </View>
        <FlatList
          data={lists}
          renderItem={renderList}
          keyExtractor={(item) => item.id}
        />
        <TouchableOpacity
          style={[
            styles.addButton,
            { backgroundColor: colors.buttonBackgroundColor },
          ]}
          onPress={() => setIsAddingList(true)}
        >
          <Text
            style={[styles.addButtonText, { color: colors.buttonTextColor }]}
          >
            +
          </Text>
        </TouchableOpacity>

        {isSelectingForDeletion && (
          <View style={styles.actionBar}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={confirmDeleteSelectedLists}
            >
              <Text>Delete selected</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={cancelDelete}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        <CustomModalWindow
          open={isConfirmDeleteVisible}
          onPressSave={deleteSelectedLists}
          onPressCancel={cancelDelete}
          saveButtonTitle="Confirm"
        >
          <Text style={styles.confirmDeleteText}>
            Are you sure you want to delete the following lists?
          </Text>
          {Array.from(listsToDelete).map((listId) => {
            const list = lists.find((list) => list.id === listId);
            return (
              <Text key={listId} style={styles.listToDelete}>
                {list?.name}
              </Text>
            );
          })}
        </CustomModalWindow>

        <CustomModalWindow
          open={isAddingList}
          onPressSave={addList}
          onPressCancel={() => setIsAddingList(false)}
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
            onChangeText={setListName}
            value={listName}
            placeholder="List Name"
          />
        </CustomModalWindow>
      </ThemedView>
    </MenuProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    paddingTop: 50,
    paddingHorizontal: 20,
  },
  optionsContainer: {
    marginTop: -30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  menuIcon: {
    padding: 10,
  },
  menuOptionText: {
    padding: 10,
    fontSize: 18,
  },
  listContainer: {
    marginBottom: 20,
    padding: 10,

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
  confirmDeleteButton: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  confirmDeleteButtonText: {
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
  confirmDeleteText: {
    marginBottom: 10,
    fontSize: 16,
  },
  listToDelete: {
    fontSize: 16,
    marginBottom: 5,
  },
  confirmDeleteButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
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
