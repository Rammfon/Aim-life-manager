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
            headerStyle: {
              backgroundColor: "black",
            },
          }}
        />
        <Stack.Screen
          name="myday/[id]"
          options={{
            headerTitle: "Home",
            headerStyle: {
              backgroundColor: "black",
            },
          }}
        />
        <Stack.Screen
          name="mylists/lists"
          options={{
            headerTitle: "Home",
            headerStyle: {
              backgroundColor: "black",
            },
          }}
        />
        <Stack.Screen
          name="mylists/mylistsdetail/[listid]"
          options={{
            headerTitle: "Home",
            headerStyle: {
              backgroundColor: "black",
            },
          }}
        />
        <Stack.Screen
          name="mainsettings/mainsettings"
          options={{
            headerTitle: "Home",
            headerStyle: {
              backgroundColor: "black",
            },
          }}
        />
      </Stack>
    </ThemeProvider>
  );
};

export default RootLayout;
