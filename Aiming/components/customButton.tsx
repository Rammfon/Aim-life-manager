import React from "react";
import { Text, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { useTheme } from "@/app/ThemeContext";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  style,
}) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={[
        styles.customButton,
        { backgroundColor: colors.buttonBackgroundColor }, // Nastavení barvy pozadí
        ...(Array.isArray(style) ? style : [style]),
      ]}
      onPress={onPress}
    >
      <Text
        style={[styles.customButtonText, { color: colors.buttonTextColor }]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  customButton: {
    margin: 3,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  customButtonText: {
    color: "#FFC300",
  },
});

export default CustomButton;
