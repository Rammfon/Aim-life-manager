// components/customModalWindow.tsx
import React from "react";
import { Modal, View, Text, Button, StyleSheet } from "react-native";
import CustomButton from "./customButton";

const CustomModalWindow: React.FC<{
  open: boolean;
  onPressSave: () => void;
  onPressCancel: () => void;
  children: React.ReactNode;
}> = ({ open, onPressSave, onPressCancel, children }) => {
  return (
    <Modal visible={open} transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {children}
          <CustomButton title="Save" onPress={onPressSave} />
          <CustomButton title="Cancel" onPress={onPressCancel} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "black",

    borderRadius: 10,
    alignItems: "center",
  },
});

export default CustomModalWindow;
