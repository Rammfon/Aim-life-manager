import React from "react";
import { registerRootComponent } from "expo";
import { Slot } from "expo-router";
import { ThemeProvider } from "./ThemeContext";
import { MenuProvider } from "react-native-popup-menu";
import ThemedView from "./ThemedView";
import HomePage from ".";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <MenuProvider>
        <ThemedView>
          <HomePage />
        </ThemedView>
      </MenuProvider>
    </ThemeProvider>
  );
};

registerRootComponent(App);
export default App;
