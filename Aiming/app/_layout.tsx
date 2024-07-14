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
            headerTintColor: "white",
            headerStyle: {
              backgroundColor: "black",
            },
            headerTitleStyle: {
              color: "white",
            },
          }}
        />
        <Stack.Screen
          name="myday/[id]"
          options={{
            headerTitle: "Home",
            headerTintColor: "white",
            headerStyle: {
              backgroundColor: "black",
            },
            headerTitleStyle: {
              color: "white",
            },
          }}
        />
        <Stack.Screen
          name="mylists/lists"
          options={{
            headerTitle: "Home",
            headerTintColor: "white",
            headerStyle: {
              backgroundColor: "black",
            },
            headerTitleStyle: {
              color: "white",
            },
          }}
        />
        <Stack.Screen
          name="mylists/mylistsdetail/[listid]"
          options={{
            headerTitle: "Home",
            headerTintColor: "white",
            headerStyle: {
              backgroundColor: "black",
            },
            headerTitleStyle: {
              color: "white",
            },
          }}
        />
        <Stack.Screen
          name="mainsettings/mainsettings"
          options={{
            headerTitle: "Home",
            headerTintColor: "white",
            headerStyle: {
              backgroundColor: "black",
            },
            headerTitleStyle: {
              color: "white",
            },
          }}
        />
      </Stack>
    </ThemeProvider>
  );
};

export default RootLayout;
