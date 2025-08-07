import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Define the context type
type ColorContextType = {
  secondaryColor: string;
  setSecondaryColor: (color: string) => void;
};

// Create context with default values
const ColorContext = createContext<ColorContextType>({
  secondaryColor: "#FF6F61", // Default color
  setSecondaryColor: () => {}, // Placeholder function
});

// Provider component
export const ColorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [secondaryColor, setSecondaryColor] = useState<string>("#FF6F61"); // Ensuring non-null default value

  useEffect(() => {
    getTheme();
  }, []);

  async function getTheme() {
    try {
      const value = await AsyncStorage.getItem('color');
      if (value) {
        setSecondaryColor(value); // Update color from AsyncStorage if found
      } else {
        setSecondaryColor("#E50046"); // Fallback default color
      }
    } catch (e) {
      console.log("Cannot get color");
    }
  }

  return (
    <ColorContext.Provider value={{ secondaryColor, setSecondaryColor }}>
      {children}
    </ColorContext.Provider>
  );
};

// Custom hook for easy usage
export const useColor = () => useContext(ColorContext);
