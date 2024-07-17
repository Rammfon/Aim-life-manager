import React, { createContext, useContext, useState, useEffect } from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ThemeContextProps {
  theme: string;
  toggleTheme: () => void;
  colors: {
    backgroundColor: string;
    textColor: string;
    buttonBackgroundColor: string;
    buttonTextColor: string;
    modalBackgroundColor: string;
    iconColor: string;
    listContainerBorderColor: string;
    inputTextColor: string;
    inputBorderColor: string;
    menuBackground: string;
    actionBarColor: string;
  };
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: "Light", // Default value
  toggleTheme: () => {},
  colors: {
    backgroundColor: "#D6FFA2",
    textColor: "black",
    buttonBackgroundColor: "#2E631D",
    buttonTextColor: "#9CD888",
    modalBackgroundColor: "#D6FFA2",
    iconColor: "black",
    listContainerBorderColor: "black",
    inputTextColor: "black",
    inputBorderColor: "black",
    menuBackground: "#D6FFA2",
    actionBarColor: "#7FAD6F",
  },
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<string>("Light");

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem("theme");
        if (storedTheme) {
          setTheme(storedTheme);
          console.log("Theme set", storedTheme);
        } else {
          const colorScheme = Appearance.getColorScheme();
          setTheme(colorScheme === "dark" ? "Dark" : "Light");
        }
      } catch (error) {
        console.error("Failed to load theme from AsyncStorage", error);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === "Light" ? "Dark" : "Light";
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem("theme", newTheme);
    } catch (error) {
      console.error("Failed to save theme to AsyncStorage", error);
    }
  };

  const colors = {
    backgroundColor: theme === "Light" ? "#D6FFA2" : "#4D5149",
    textColor: theme === "Light" ? "black" : "#FFC300",
    iconColor: theme === "Light" ? "black" : "#FFC300",
    buttonBackgroundColor: theme === "Light" ? "#2E631D" : "black",
    buttonTextColor: theme === "Light" ? "#9CD888" : "#FFC300",
    listContainerBorderColor: theme === "Light" ? "black" : "white",
    modalBackgroundColor: theme === "Light" ? "#D6FFA2" : "#5A5A5A",
    inputTextColor: theme === "Light" ? "black" : "white",
    inputBorderColor: theme === "Light" ? "black" : "#FFC300",
    menuBackground: theme === "Light" ? "#2E631D" : "#black",
    actionBarColor: theme === "Light" ? "#CACACA" : "grey",
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
