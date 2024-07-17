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
  repeat: string;
  daysOfWeek?: string[];
}

import { RepeatPicker as Reppicker } from "@/components/repeatPicker";
import CustomButton from "@/components/customButton";
import CustomModalWindow from "@/components/customModalWindow";
import ThemedView from "../ThemedView";
import { useTheme } from "../ThemeContext";
import { menuOptionsStyles } from "@/components/menuOptionsStyle";
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
  const [isRepeatPickerVisible, setRepeatPickerVisibility] =
    useState<boolean>(false);
  const [viewMode, setViewMode] = useState<string>("today");
  const [repeat, setRepeat] = useState<string>("none");
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>([]);
  const textInputRef = useRef<TextInput>(null);
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const [selectedRepeatText, setSelectedRepeatText] =
    useState<string>("Unselected");
  const [selectedDueDateText, setSelectedDueDateText] =
    useState<string>("Unselected");
  useState<boolean>(false);
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
        repeat,
        daysOfWeek,
      };
      const newTodos = sortTodos([...todos, newTodo]);
      setTodos(newTodos);
      saveTodos(newTodos);
      setText("");
      setDueDate(new Date());
      setRepeat("none");
      setDaysOfWeek([]);
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

  const startEditTodo = (
    id: string,
    title: string,
    dueDate: string,
    repeat: string,
    daysOfWeek: string[]
  ) => {
    setIsEditing(true);
    setIsAdding(false);
    setCurrentTodoId(id);
    setText(title);
    setDueDate(new Date(dueDate));
    setRepeat(repeat);
    setDaysOfWeek(daysOfWeek);
    setSelectedRepeatText(
      repeat === "none" && daysOfWeek.length > 0
        ? `Specific days: ${daysOfWeek.map((day) => daysMap[day]).join(", ")}`
        : repeat === "none"
        ? "Unselected"
        : repeat
    );
    setSelectedDueDateText(
      dueDate === new Date().toISOString().split("T")[0] ? "Today" : dueDate
    );
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
                repeat,
                daysOfWeek,
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
    setRepeat("none");
    setDaysOfWeek([]);
    setDueDate(new Date());
    setSelectedRepeatText("Unselected");
    setSelectedDueDateText("Unselected");
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

  const showRepeatPicker = () => {
    setRepeatPickerVisibility(true);
  };

  const hideRepeatPicker = () => {
    setRepeatPickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    const newDueDate = date.toISOString().split("T")[0];
    setDueDate(date);
    setSelectedDueDateText(newDueDate);
    if (isAdding) {
      setDueDate(date);
    } else if (currentTodoId) {
      setDueDate(date);
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

  const daysMap: { [key: string]: string } = {
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
    Sat: "Saturday",
    Sun: "Sunday",
  };

  const renderItem = ({ item }: { item: Todo }) => {
    const isEditingCurrentTodo = currentTodoId === item.id;
    const daysOfWeekText =
      item.daysOfWeek && item.daysOfWeek.length > 0
        ? item.daysOfWeek.map((day) => daysMap[day]).join(", ")
        : "";
    return (
      <TouchableOpacity
        onLongPress={() => handleLongPress(item.id)}
        onPress={() => toggleComplete(item.id)}
        style={[
          styles.todoItem,
          { borderColor: colors.listContainerBorderColor },
          isEditingCurrentTodo && styles.editingTodoItem,
        ]}
      >
        <View style={styles.todoTextContainer}>
          <Text
            style={[
              styles.todoText,
              item.completed && styles.todoTextCompleted,
              isDateInPast(item.dueDate) && styles.pastDueDateText,
              { color: colors.textColor },
            ]}
          >
            {item.title}
          </Text>
          {(item.repeat !== "none" ||
            (item.daysOfWeek && item.daysOfWeek.length > 0)) && (
            <Icon
              name="repeat"
              size={20}
              color="#000"
              style={[styles.repeatIcon, { color: colors.iconColor }]}
            />
          )}
        </View>
        <Text
          style={[
            styles.todoText,
            item.completed && styles.todoTextCompleted,
            isDateInPast(item.dueDate) && styles.pastDueDateText,
          ]}
        >
          {formatDueDate(item.dueDate)}
        </Text>
        <Text>
          {item.repeat === "none" &&
          (!item.daysOfWeek || item.daysOfWeek.length === 0)
            ? "No repeat"
            : `Repeats: ${
                item.repeat !== "none"
                  ? `${item.repeat}${
                      daysOfWeekText ? ` on ${daysOfWeekText}` : ""
                    }`
                  : daysOfWeekText
              }`}
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

  const handleDaysOfWeekChange = (day: string) => {
    setDaysOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
    if (repeat !== "none") {
      setRepeat("none");
    }
  };

  const openAddModal = () => {
    setIsAdding(true);
    setText("");
    setDueDate(new Date());
    setRepeat("none");
    setDaysOfWeek([]);
    setSelectedRepeatText("Unselected");
    setSelectedDueDateText("Unselected");
  };

  return (
    <MenuProvider>
      <TouchableWithoutFeedback onPress={() => setSelectedTodoId(null)}>
        <ThemedView style={styles.container}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textColor }]}>
              {viewMode === "today" ? "Today Tasks" : "All Tasks"}
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
                    setViewMode("today");
                  }}
                >
                  <Text
                    style={[
                      styles.menuOptionText,
                      { color: colors.buttonTextColor },
                    ]}
                  >
                    Today's Tasks
                  </Text>
                </MenuOption>
                <MenuOption
                  onSelect={() => {
                    setViewMode("all");
                  }}
                >
                  <Text
                    style={[
                      styles.menuOptionText,
                      { color: colors.buttonTextColor },
                    ]}
                  >
                    All Tasks
                  </Text>
                </MenuOption>
                <MenuOption
                  onSelect={() => {
                    deleteCompletedTodos();
                  }}
                >
                  <Text
                    style={[
                      styles.menuOptionText,
                      { color: colors.buttonTextColor },
                    ]}
                  >
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
                onPress={() => {
                  const todo = todos.find(
                    (todo) => todo.id === selectedTodoId
                  )!;
                  startEditTodo(
                    selectedTodoId!,
                    todo.title,
                    todo.dueDate,
                    todo.repeat,
                    todo.daysOfWeek || []
                  );
                }}
              >
                <Icon name="pencil" size={20} color="#000" />
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
            style={[
              styles.addButton,
              { backgroundColor: colors.buttonBackgroundColor },
            ]}
            onPress={() => {
              openAddModal();
              setIsAdding(true);
              setIsEditing(false);
              setText("");
              setDueDate(new Date());
              setRepeat("none");
              setDaysOfWeek([]);
              setSelectedDueDateText("Unselected");
              setSelectedRepeatText("Unselected");
            }}
          >
            <Text
              style={[styles.addButtonText, { color: colors.buttonTextColor }]}
            >
              +
            </Text>
          </TouchableOpacity>

          {isEditing && (
            <CustomModalWindow
              open={isEditing}
              onPressSave={editTodo}
              onPressCancel={cancelEdit}
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
                placeholder="Edit todo..."
                value={text}
                onChangeText={setText}
                onSubmitEditing={editTodo}
                returnKeyType="done"
              />
              <CustomButton title="Pick a date" onPress={showDatePicker} />
              <Text>{selectedDueDateText}</Text>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
              <CustomButton title="Repeat" onPress={showRepeatPicker} />
              <Text>{selectedRepeatText}</Text>
              <CustomModalWindow
                open={isRepeatPickerVisible}
                onPressSave={hideRepeatPicker}
                onPressCancel={hideRepeatPicker}
              >
                <Reppicker
                  repeat={repeat}
                  setRepeat={setRepeat}
                  daysOfWeek={daysOfWeek}
                  setDaysOfWeek={setDaysOfWeek}
                  setSelectedRepeatText={setSelectedRepeatText}
                />
              </CustomModalWindow>
            </CustomModalWindow>
          )}

          {isAdding && (
            <CustomModalWindow
              open={isAdding}
              onPressSave={addTodo}
              onPressCancel={cancelEdit}
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
                placeholder="Enter todo..."
                value={text}
                onChangeText={setText}
                onSubmitEditing={addTodo}
                returnKeyType="done"
              />
              <CustomButton title="Pick a date" onPress={showDatePicker} />
              <Text>{selectedDueDateText}</Text>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
              <CustomButton title="Repeat" onPress={showRepeatPicker} />
              <Text>{selectedRepeatText}</Text>
              <CustomModalWindow
                open={isRepeatPickerVisible}
                onPressSave={hideRepeatPicker}
                onPressCancel={hideRepeatPicker}
              >
                <Reppicker
                  repeat={repeat}
                  setRepeat={setRepeat}
                  daysOfWeek={daysOfWeek}
                  setDaysOfWeek={setDaysOfWeek}
                  setSelectedRepeatText={setSelectedRepeatText}
                />
              </CustomModalWindow>
            </CustomModalWindow>
          )}
        </ThemedView>
      </TouchableWithoutFeedback>
    </MenuProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

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
    color: "#FFC300",
  },
  menuIcon: {
    padding: 10,
    color: "#FFC300",
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
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 10,
  },
  todoItem: {
    padding: 10,
    borderBottomWidth: 1,
  },
  todoTextContainer: {
    flexDirection: "row",
    alignItems: "center",
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

    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
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
  daysOfWeekContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dayButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 5,
  },
  selectedDayButton: {
    backgroundColor: "#a0a0a0",
  },
  repeatIcon: {
    marginLeft: 10,
    color: "#FFC300",
  },
  optionsContainer: {
    marginTop: -30,
  },
});

export default TodoApp;
