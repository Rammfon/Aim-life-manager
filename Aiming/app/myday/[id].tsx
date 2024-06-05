import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import { useLocalSearchParams } from "expo-router";
import {
  MenuProvider,
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
}

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [currentTodoId, setCurrentTodoId] = useState<string | null>(null);
  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] =
    useState<boolean>(false);
  const [viewMode, setViewMode] = useState<string>("today");
  const textInputRef = useRef<TextInput>(null);
  const { id } = useLocalSearchParams<{ id: string }>();

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    if (isAdding || isEditing) {
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 100);
    }
  }, [isAdding, isEditing]);

  const loadTodos = async () => {
    try {
      const storedTodos = await AsyncStorage.getItem("todos");
      if (storedTodos) {
        const parsedTodos = JSON.parse(storedTodos);
        setTodos(sortTodos(parsedTodos));
        console.log("Loaded todos from AsyncStorage:", parsedTodos);
      } else {
        console.log("No todos found in AsyncStorage");
      }
    } catch (error) {
      console.error("Failed to load todos from AsyncStorage:", error);
    }
  };

  const saveTodos = async (newTodos: Todo[]) => {
    try {
      await AsyncStorage.setItem("todos", JSON.stringify(newTodos));
      console.log("Saved todos to AsyncStorage:", newTodos);
    } catch (error) {
      console.error("Failed to save todos to AsyncStorage:", error);
    }
  };

  const sortTodos = (todos: Todo[]): Todo[] => {
    return todos.sort((a, b) => Number(a.completed) - Number(b.completed));
  };

  const addTodo = () => {
    if (text.trim().length > 0) {
      const newTodo: Todo = {
        id: Date.now().toString(),
        title: text,
        completed: false,
        dueDate: dueDate.toISOString().split("T")[0],
      };
      const newTodos = sortTodos([...todos, newTodo]);
      setTodos(newTodos);
      saveTodos(newTodos);
      setText("");
      setDueDate(new Date());
      setIsAdding(false);
    }
  };

  const deleteTodo = (id: string) => {
    const newTodos = sortTodos(todos.filter((todo) => todo.id !== id));
    setTodos(newTodos);
    saveTodos(newTodos);
    setSelectedTodoId(null);
    cancelEdit();
  };

  const deleteCompletedTodos = () => {
    const newTodos = sortTodos(todos.filter((todo) => !todo.completed));
    setTodos(newTodos);
    saveTodos(newTodos);
  };

  const toggleComplete = (id: string) => {
    const newTodos = sortTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
    setTodos(newTodos);
    saveTodos(newTodos);
    setSelectedTodoId(null);
    cancelEdit();
  };

  const startEditTodo = (id: string, title: string) => {
    setIsEditing(true);
    setIsAdding(false);
    setCurrentTodoId(id);
    setText(title);
    setSelectedTodoId(null);
  };

  const pickDateForTodo = (id: string) => {
    setCurrentTodoId(id);
    showDatePicker();
  };

  const editTodo = () => {
    if (currentTodoId && text.trim().length > 0) {
      const newTodos = sortTodos(
        todos.map((todo) =>
          todo.id === currentTodoId
            ? {
                ...todo,
                title: text,
                completed: false,
                dueDate: dueDate.toISOString().split("T")[0],
              }
            : todo
        )
      );
      setTodos(newTodos);
      saveTodos(newTodos);
      setText("");
      setIsEditing(false);
      setCurrentTodoId(null);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setIsAdding(false);
    setText("");
    setCurrentTodoId(null);
  };

  const handleLongPress = (id: string) => {
    cancelEdit();
    setSelectedTodoId(id);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    const newDueDate = date.toISOString().split("T")[0];
    setDueDate(date);
    if (isAdding) {
      setDueDate(date);
    } else if (currentTodoId) {
      const newTodos = sortTodos(
        todos.map((todo) =>
          todo.id === currentTodoId
            ? { ...todo, dueDate: newDueDate, completed: false }
            : todo
        )
      );
      setTodos(newTodos);
      saveTodos(newTodos);
      setCurrentTodoId(null);
    }
    hideDatePicker();
  };

  const formatDueDate = (dueDate: string): string => {
    const today = new Date().toISOString().split("T")[0];
    if (dueDate === today) {
      return "Today";
    } else {
      const [year, month, day] = dueDate.split("-");
      return `${parseInt(day, 10)}.${parseInt(month, 10)}.`;
    }
  };

  const isDateInPast = (dueDate: string): boolean => {
    const today = new Date();
    const due = new Date(dueDate);
    today.setHours(0, 0, 0, 0); // Nastavíme hodiny na 0, aby se porovnalo pouze datum
    due.setHours(0, 0, 0, 0);
    return due < today;
  };

  const renderItem = ({ item }: { item: Todo }) => {
    const isEditingCurrentTodo = currentTodoId === item.id;

    return (
      <TouchableOpacity
        onLongPress={() => handleLongPress(item.id)}
        onPress={() => toggleComplete(item.id)}
        style={[
          styles.todoItem,
          isEditingCurrentTodo && styles.editingTodoItem,
        ]}
      >
        <Text
          style={[
            styles.todoText,
            item.completed && styles.todoTextCompleted,
            isDateInPast(item.dueDate) && styles.pastDueDateText,
          ]}
        >
          {item.title} - {formatDueDate(item.dueDate)}
        </Text>
      </TouchableOpacity>
    );
  };

  const filterTodos = () => {
    const today = new Date().toISOString().split("T")[0];
    if (viewMode === "today") {
      return todos.filter((todo) => todo.dueDate === today);
    } else {
      return todos;
    }
  };

  return (
    <MenuProvider>
      <TouchableWithoutFeedback onPress={() => setSelectedTodoId(null)}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {viewMode === "today" ? "Today Tasks" : "All Tasks"}
            </Text>
            <Menu>
              <MenuTrigger>
                <Icon
                  name="menu"
                  size={30}
                  color="#000"
                  style={styles.menuIcon}
                />
              </MenuTrigger>
              <MenuOptions>
                <MenuOption
                  onSelect={() => {
                    setViewMode("today");
                  }}
                >
                  <Text style={styles.menuOptionText}>Today's Tasks</Text>
                </MenuOption>
                <MenuOption
                  onSelect={() => {
                    setViewMode("all");
                  }}
                >
                  <Text style={styles.menuOptionText}>All Tasks</Text>
                </MenuOption>
                <MenuOption
                  onSelect={() => {
                    deleteCompletedTodos();
                  }}
                >
                  <Text style={styles.menuOptionText}>
                    Delete Completed Todos
                  </Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </View>

          {selectedTodoId && (
            <View style={styles.actionBar}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() =>
                  startEditTodo(
                    selectedTodoId!,
                    todos.find((todo) => todo.id === selectedTodoId)!.title
                  )
                }
              >
                <Icon name="pencil" size={20} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => pickDateForTodo(selectedTodoId!)}
              >
                <Icon name="calendar" size={20} color="#000" />

                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => deleteTodo(selectedTodoId!)}
              >
                <Icon name="trash" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          )}

          <FlatList
            data={filterTodos()}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setIsAdding(true);
              setIsEditing(false);
              setText("");
              setDueDate(new Date());
            }}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>

          <Modal visible={isEditing} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <TextInput
                  ref={textInputRef}
                  style={styles.input}
                  onChangeText={setText}
                  value={text}
                  placeholder={"Edit Todo"}
                />

                <Button title="Save" onPress={editTodo} />

                <Button title="Cancel" onPress={cancelEdit} />
              </View>
            </View>
          </Modal>

          <Modal visible={isAdding} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <TextInput
                  ref={textInputRef}
                  style={styles.input}
                  onChangeText={setText}
                  value={text}
                  placeholder="Add Todo"
                />
                <Button title="Pick a date" onPress={showDatePicker} />
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                />
                <Button title="Save" onPress={addTodo} />
                <Button title="Cancel" onPress={cancelEdit} />
              </View>
            </View>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </MenuProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  menuIcon: {
    padding: 10,
  },
  menuOptionText: {
    padding: 10,
    fontSize: 18,
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
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderColor: "#ddd",
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 10,
  },
  todoItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  todoText: {
    fontSize: 18,
  },
  todoTextCompleted: {
    textDecorationLine: "line-through",
    color: "#aaa",
  },
  pastDueDateText: {
    color: "red",
  },
  editingTodoItem: {
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
});

export default TodoApp;
