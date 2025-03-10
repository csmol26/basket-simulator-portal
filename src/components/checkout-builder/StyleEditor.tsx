
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Style variables with default values
export const initialStyleVariables = {
  primerColorBrand: "#18A94B",
  primerTypographyBrand: "'Poppins', sans-serif",
  primerColorBackground: "transparent",
  primerRadiusBase: "16px",
  primerSpaceBase: "4px",
  primerSizeBase: "4px",
  primerColorLoader: "",
  primerColorFocus: "#DE00D1",
};

export const variableDescriptions = {
  primerColorBrand: "Controls the brand color across the checkout",
  primerTypographyBrand: "Controls the brand font family across the checkout",
  primerColorBackground: "Controls the background color across the checkout",
  primerRadiusBase: "Controls the base radius unit across the checkout",
  primerSpaceBase: "Controls the base spacing unit across the checkout",
  primerSizeBase: "Controls the base size unit across the checkout",
  primerColorLoader: "Controls the loader color across the checkout (leave empty to use brand color)",
  primerColorFocus: "Controls the interactive focus color across the checkout",
};

export const jsonToCssVariable = {
  primerColorBrand: "--primer-color-brand",
  primerTypographyBrand: "--primer-typography-brand",
  primerColorBackground: "--primer-color-background",
  primerRadiusBase: "--primer-radius-base",
  primerSpaceBase: "--primer-space-base",
  primerSizeBase: "--primer-size-base",
  primerColorLoader: "--primer-color-loader",
  primerColorFocus: "--primer-color-focus",
};

interface StyleEditorProps {
  styleVariables: typeof initialStyleVariables;
  onStyleChange: (variableName: string, value: string) => void;
}

const StyleEditor: React.FC<StyleEditorProps> = ({ styleVariables, onStyleChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Style Variables</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(styleVariables).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key} className="text-sm flex justify-between">
                <span>{jsonToCssVariable[key as keyof typeof jsonToCssVariable]}</span>
                {key === "primerColorBrand" || key === "primerColorBackground" || key === "primerColorLoader" || key === "primerColorFocus" ? (
                  <input 
                    type="color" 
                    value={value || '#000000'} 
                    onChange={(e) => onStyleChange(key, e.target.value)}
                    className="w-8 h-8 p-0 border-0"
                  />
                ) : null}
              </Label>
              <Input 
                id={key}
                value={value}
                onChange={(e) => onStyleChange(key, e.target.value)}
                placeholder={`Enter ${key}`}
              />
              <p className="text-xs text-gray-500">{variableDescriptions[key as keyof typeof variableDescriptions]}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StyleEditor;
