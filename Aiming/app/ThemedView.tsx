import React from "react";
import { View, StyleSheet, ViewProps } from "react-native";
import { useTheme } from "./ThemeContext";

const ThemedView: React.FC<ViewProps> = ({ style, children, ...props }) => {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.backgroundColor },
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
});

export default ThemedView;
