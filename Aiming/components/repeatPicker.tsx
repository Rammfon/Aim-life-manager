import React, { useEffect } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import CustomButton from "./customButton";

interface RepeatPickerProps {
  repeat: string;
  setRepeat: React.Dispatch<React.SetStateAction<string>>;
  daysOfWeek: string[];
  setDaysOfWeek: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedRepeatText: React.Dispatch<React.SetStateAction<string>>;
}

const RepeatPicker: React.FC<RepeatPickerProps> = ({
  repeat,
  setRepeat,
  daysOfWeek,
  setDaysOfWeek,
  setSelectedRepeatText,
}) => {
  const handleDaysOfWeekChange = (day: string) => {
    setDaysOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
    if (repeat !== "none") {
      setRepeat("none");
      setSelectedRepeatText("none");
    }
  };

  const handleRepeatChange = (selectedRepeat: string) => {
    setRepeat(selectedRepeat);
    setSelectedRepeatText(selectedRepeat);
    if (daysOfWeek.length > 0) {
      setDaysOfWeek([]);
    }
  };
  const daysMap: { [key: string]: string } = {
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
    Sat: "Saturday",
    Sun: "Sunday",
  };
  useEffect(() => {
    if (daysOfWeek.length > 0) {
      setSelectedRepeatText(
        `Specific days: ${daysOfWeek.map((day) => daysMap[day]).join(", ")}`
      );
    } else if (repeat === "none") {
      setSelectedRepeatText("Unselected");
    }
  }, [daysOfWeek, repeat]);

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Daily"
          onPress={() => handleRepeatChange("daily")}
          style={repeat === "daily" ? styles.selectedButton : {}}
        />
        <CustomButton
          title="Weekly"
          onPress={() => handleRepeatChange("weekly")}
          style={repeat === "weekly" ? styles.selectedButton : {}}
        />
      </View>
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
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
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
  selectedButton: {
    backgroundColor: "#a0a0a0",
  },
});

export { RepeatPicker };
