
import { useState } from "react";
import { StyleVariables } from "@/components/checkout-builder-v2/types";
import { initialStyleVariables } from "@/components/checkout-builder-v2/StyleVarsEditor";

export const useStylesManager = () => {
  const [styleVariables, setStyleVariables] = useState<StyleVariables>(initialStyleVariables);
  const [activeTheme, setActiveTheme] = useState<string>("light");

  const handleStyleChange = (variableName: string, value: string) => {
    setStyleVariables({
      ...styleVariables,
      [variableName]: value
    });
  };

  const changeTheme = (themeId: string) => {
    setActiveTheme(themeId);
    // In a real implementation, this would also update style variables
    // based on the selected theme
  };

  return {
    styleVariables,
    activeTheme,
    handleStyleChange,
    changeTheme
  };
};
