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
    </Stack>
  );
};

export default RootLayout;
