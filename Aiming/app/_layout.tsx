import React from "react";
import { Stack, Slot } from "expo-router";
import { ThemeProvider } from "./ThemeContext";

const RootLayout = () => {
  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerTitle: "",
          }}
        />
        <Stack.Screen
          name="myday/[id]"
          options={{
            headerTitle: "Home",
          }}
        />
        <Stack.Screen
          name="mylists/lists"
          options={{
            headerTitle: "Home",
          }}
        />
        <Stack.Screen
          name="mylists/mylistsdetail/[listid]"
          options={{
            headerTitle: "Home",
          }}
        />
        <Stack.Screen
          name="mainsettings/mainsettings"
          options={{
            headerTitle: "Home",
          }}
        />
      </Stack>
    </ThemeProvider>
  );
};

export default RootLayout;
