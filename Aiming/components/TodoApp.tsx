import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [currentTodoId, setCurrentTodoId] = useState<string | null>(null);
  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null);

  useEffect(() => {
    loadTodos();
  }, []);

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
      const newTodos = sortTodos([
        ...todos,
        { id: Date.now().toString(), title: text, completed: false },
      ]);
      setTodos(newTodos);
      saveTodos(newTodos);
      setText("");
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
    setText("");
    setSelectedTodoId(null);
  };

  const editTodo = () => {
    if (currentTodoId && text.trim().length > 0) {
      const newTodos = sortTodos(
        todos.map((todo) =>
          todo.id === currentTodoId
            ? { ...todo, title: text, completed: false }
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

  const renderItem = ({ item }: { item: Todo }) => (
    <TouchableOpacity
      onLongPress={() => handleLongPress(item.id)}
      onPress={() => toggleComplete(item.id)}
      style={styles.todoItem}
    >
      <Text
        style={[styles.todoText, item.completed && styles.todoTextCompleted]}
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback onPress={() => setSelectedTodoId(null)}>
      <View style={styles.container}>
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
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => deleteTodo(selectedTodoId!)}
            >
              <Text style={styles.actionText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        <Text style={styles.title}>Todo App</Text>
        {(isAdding || isEditing) && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setText}
              value={text}
              placeholder={isEditing ? "Edit Todo" : "Add Todo"}
            />
            {isEditing ? (
              <Button title="Save" onPress={editTodo} />
            ) : (
              <Button title="Save" onPress={addTodo} />
            )}
            <Button title="Cancel" onPress={cancelEdit} />
          </View>
        )}
        <FlatList
          data={todos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setIsAdding(true);
            setIsEditing(false);
            setText("");
          }}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 20,
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
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 50,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderColor: "#ddd",
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 10,
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
  actionText: {
    color: "blue",
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

export default TodoApp;
