import React from "react";
import { registerRootComponent } from "expo";
import { Slot } from "expo-router";
import { ThemeProvider } from "./ThemeContext";
import { MenuProvider } from "react-native-popup-menu";
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Slot />
    </ThemeProvider>
  );
};

registerRootComponent(App);

export default App;
