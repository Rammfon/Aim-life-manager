import React from "react";
import { registerRootComponent } from "expo";
import { ThemeProvider } from "./ThemeContext";
import { MenuProvider } from "react-native-popup-menu";
import HomePage from ".";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <MenuProvider>
        <HomePage />
      </MenuProvider>
    </ThemeProvider>
  );
};

registerRootComponent(App);
export default App;
