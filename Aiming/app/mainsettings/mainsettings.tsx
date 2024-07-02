import CustomButton from "@/components/customButton";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../ThemeContext";
import ThemedView from "../ThemedView";

const MainSettings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { textColor } = useTheme();
  return (
    <ThemedView style={styles.container}>
      <Text style={[styles.title, { color: textColor }]}>Settings</Text>
      <CustomButton
        title={
          theme === "Light" ? "Switch to Dark Mode" : "Switch to Light Mode"
        }
        onPress={toggleTheme}
      />
    </ThemedView>
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
    color: "#FFC300",
    paddingBottom: 10,
  },
  button: {
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
    marginVertical: 10,
  },
  selectedButton: {
    backgroundColor: "#aaa",
  },
  buttonText: {
    fontSize: 18,
  },
});

export default MainSettings;
