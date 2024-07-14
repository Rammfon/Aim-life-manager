import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import CustomButton from "./customButton";

interface RepeatPickerProps {
  repeat: string;
  setRepeat: React.Dispatch<React.SetStateAction<string>>;
  daysOfWeek: string[];
  setDaysOfWeek: React.Dispatch<React.SetStateAction<string[]>>;
}

const RepeatPicker: React.FC<RepeatPickerProps> = ({
  repeat,
  setRepeat,
  daysOfWeek,
  setDaysOfWeek,
}) => {
  const handleDaysOfWeekChange = (day: string) => {
    setDaysOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <CustomButton title="Daily" onPress={() => setRepeat("daily")} />
        <CustomButton title="Weekly" onPress={() => setRepeat("weekly")} />
      </View>
      {/* ScrollView should be placed in a separate container */}
      <View style={styles.scrollViewContainer}>
        <ScrollView
          horizontal
          contentContainerStyle={styles.daysOfWeek}
          showsHorizontalScrollIndicator={false}
        >
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <CustomButton
              key={day}
              title={day}
              onPress={() => handleDaysOfWeekChange(day)}
              style={[
                styles.dayButton,
                daysOfWeek.includes(day) ? styles.selectedDayButton : {},
              ]}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: 10,
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "center",
    marginBottom: 10,
  },
  scrollViewContainer: {
    flexDirection: "row", // Ensure ScrollView is in a row
    justifyContent: "center",
    width: "100%", // Make sure it takes the full width
  },
  daysOfWeek: {
    flexDirection: "row",
  },
  dayButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 4,

    justifyContent: "center",
    alignItems: "center",
  },
  selectedDayButton: {
    backgroundColor: "#a0a0a0",
  },
});

export { RepeatPicker };
