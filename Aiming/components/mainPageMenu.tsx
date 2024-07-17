import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuProvider,
  MenuTrigger,
  MenuContext,
} from "react-native-popup-menu";
import { useTheme } from "../app/ThemeContext";
import { menuOptionsStyles } from "./menuOptionsStyle";

const MainPageMenu: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Menu style={styles.menuItem}>
      <MenuTrigger>
        <Icon
          name="menu"
          size={30}
          style={[styles.menuIcon, { color: colors.iconColor }]}
        />
      </MenuTrigger>
      <MenuOptions customStyles={menuOptionsStyles(colors)}>
        <MenuOption>
          <Link href="/mainsettings/mainsettings">
            <Text
              style={[styles.menuOptionText, { color: colors.buttonTextColor }]}
            >
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

  menuIcon: {
    color: "#FFC300",
  },
  menuOptionText: {
    padding: 10,
    fontSize: 18,
  },
});

export default MainPageMenu;
