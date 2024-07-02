import React, { createContext, useContext, useState, ReactNode } from "react";

type ThemeContextType = {
  theme: "Light" | "Dark";
  toggleTheme: () => void;
  textColor: string;
  iconColor: string;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<"Light" | "Dark">("Light");

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "Light" ? "Dark" : "Light"));
  };

  const textColor = theme === "Light" ? "black" : "#FFC300";
  const iconColor = theme === "Light" ? "black" : "#FFC300";

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, textColor, iconColor }}>
      {children}
    </ThemeContext.Provider>
  );
};
