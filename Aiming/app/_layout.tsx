import { Stack } from "expo-router";

const RootLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Home",
          headerStyle: {
            backgroundColor: "green",
          },
        }}
      />
      <Stack.Screen
        name="myday/[id]"
        options={{
          headerTitle: "My Day",
        }}
      />
      <Stack.Screen
        name="mylists/lists"
        options={{
          headerTitle: "My Lists",
        }}
      />
      <Stack.Screen
        name="mylists/mylistsdetail/[listid]"
        options={{
          headerTitle: "List Detail",
        }}
      />
    </Stack>
  );
};

export default RootLayout;
