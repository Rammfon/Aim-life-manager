import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuProvider,
  MenuTrigger,
} from "react-native-popup-menu";
import { useTheme } from "../app/ThemeContext";
const MainPageMenu: React.FC = () => {
  const { iconColor, textColor } = useTheme();

  return (
    <Menu style={styles.menuItem}>
      <MenuTrigger>
        <Icon
          name="menu"
          size={30}
          style={[styles.menuIcon, { color: iconColor }]}
        />
      </MenuTrigger>
      <MenuOptions customStyles={{ optionsContainer: styles.optionsContainer }}>
        <MenuOption>
          <Link href="/mainsettings/mainsettings">
            <Text style={[styles.menuOptionText, { color: textColor }]}>
              Settings
            </Text>
          </Link>
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
  optionsContainer: {
    marginTop: -30,
  },
  menuIcon: {
    color: "#FFC300",
  },
  menuOptionText: {
    padding: 10,
    fontSize: 18,
  },
});

export default MainPageMenu;
