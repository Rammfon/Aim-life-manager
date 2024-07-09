import React from "react";
import { registerRootComponent } from "expo";
import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";
import MainPageMenu from "@/components/mainPageMenu";
import { MenuProvider } from "react-native-popup-menu";
import { ThemeProvider, useTheme } from "./ThemeContext";
import MainSettings from "./mainsettings/mainsettings";
import ThemedView from "./ThemedView";

const HomePage = () => {
  const { colors } = useTheme();
  return (
    <MenuProvider>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textColor }]}>
            Homepage
          </Text>
          <MainPageMenu />
        </View>
        <Link
          style={[styles.link, { color: colors.textColor }]}
          href="/myday/1"
        >
          My Day
        </Link>
        <Link
          style={[styles.link, { color: colors.textColor }]}
          href="/mylists/lists"
        >
          My Lists
        </Link>
      </ThemedView>
    </MenuProvider>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  link: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 5,
  },
});
