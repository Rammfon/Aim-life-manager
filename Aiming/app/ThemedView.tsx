import React from "react";
import { View, StyleSheet, ViewProps } from "react-native";
import { useTheme } from "./ThemeContext";

const ThemedView: React.FC<ViewProps> = ({ style, children, ...props }) => {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.container,
        theme === "Light" ? styles.lightContainer : styles.darkContainer,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lightContainer: {
    backgroundColor: "#D6FFA2",
  },
  darkContainer: {
    backgroundColor: "#4D5149",
  },
});

export default ThemedView;
