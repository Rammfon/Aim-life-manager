import React, { useState } from "react";
import { Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
import { useTheme } from "../app/ThemeContext";
import { menuOptionsStyles } from "./menuOptionsStyle";

const MainPageMenu: React.FC = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  const closeMenu = () => {
    setVisible(false);
  };

  const handleSelect = (path: string) => {
    closeMenu();
    router.push(path);
  };

  return (
    <Menu
      style={styles.menuItem}
      opened={visible}
      onBackdropPress={closeMenu}
      onClose={closeMenu}
    >
      <MenuTrigger onPress={() => setVisible(true)}>
        <Icon
          name="menu"
          size={30}
          style={[styles.menuIcon, { color: colors.iconColor }]}
        />
      </MenuTrigger>
      <MenuOptions customStyles={menuOptionsStyles(colors)}>
        <MenuOption onSelect={() => handleSelect("/mainsettings/mainsettings")}>
          <Text
            style={[styles.menuOptionText, { color: colors.buttonTextColor }]}
          >
            Settings
          </Text>
        </MenuOption>
      </MenuOptions>
    </Menu>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  menuIcon: {
    color: "#FFC300",
  },
  menuOptionText: {
    padding: 1,
    fontSize: 18,
  },
});

export default MainPageMenu;
