import React from "react";
import { registerRootComponent } from "expo";
import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";

const HomePage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Homepage</Text>
      <Link style={styles.title} href="/myday/bacon">
        My Day
      </Link>
    </View>
  );
};
export default HomePage;

// Register the main component
registerRootComponent(HomePage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 5,
  },
});
