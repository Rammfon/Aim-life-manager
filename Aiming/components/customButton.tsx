import React from "react";
import { Text, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  style,
}) => (
  <TouchableOpacity
    style={[styles.customButton, ...(Array.isArray(style) ? style : [style])]}
    onPress={onPress}
  >
    <Text style={styles.customButtonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  customButton: {
    margin: 3,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#83218B",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  customButtonText: {
    color: "#FFC300",
  },
});

export default CustomButton;
