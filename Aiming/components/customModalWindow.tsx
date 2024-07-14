import React from "react";
import { Modal, View, StyleSheet } from "react-native";
import CustomButton from "./customButton";
import { useTheme } from "@/app/ThemeContext";

const CustomModalWindow: React.FC<{
  open: boolean;
  onPressSave: () => void;
  onPressCancel: () => void;
  children: React.ReactNode;
  saveButtonTitle?: string;
  cancelButtonTitle?: string;
}> = ({
  open,
  onPressSave,
  onPressCancel,
  children,
  saveButtonTitle = "Save",
  cancelButtonTitle = "Cancel",
}) => {
  const { colors } = useTheme();
  return (
    <Modal visible={open} transparent>
      <View style={styles.modalContainer}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: colors.modalBackgroundColor },
          ]}
        >
          {children}
          <View>
            <CustomButton title={saveButtonTitle} onPress={onPressSave} />
            <CustomButton title={cancelButtonTitle} onPress={onPressCancel} />
          </View>
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
    borderRadius: 10,
    alignItems: "center",
  },
});

export default CustomModalWindow;
