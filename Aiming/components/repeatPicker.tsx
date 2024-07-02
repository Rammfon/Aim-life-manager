import React from "react";
import { View, Text, StyleSheet } from "react-native";
import CustomButton from "./customButton";
import CustomModalWindow from "./customModalWindow";

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
    <View>
      <CustomButton title="Daily" onPress={() => setRepeat("daily")} />

      <CustomButton title="Weekly" onPress={() => setRepeat("weekly")} />

      {/* Render days of the week buttons using CustomButton */}
      <View style={styles.daysOfWeekContainer}>
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  daysOfWeekContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dayButton: {
    padding: 10,
    borderRadius: 5,

    marginHorizontal: 5,
  },
  selectedDayButton: {
    backgroundColor: "#a0a0a0",
  },
});

export { RepeatPicker };
