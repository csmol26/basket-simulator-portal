
import React from "react";
import { StyleVariables } from "../types";

interface ThemePreviewProps {
  styleVariables: StyleVariables;
}

const ThemePreview: React.FC<ThemePreviewProps> = ({ styleVariables }) => {
  return (
    <div className="p-4 bg-gray-50 rounded-md mt-4">
      <h3 className="font-medium mb-2">Theme Preview</h3>
      <div 
        className="p-4 rounded-md border" 
        style={{ 
          backgroundColor: styleVariables.primerColorBackground || 'white',
          fontFamily: styleVariables.primerTypographyBrand,
          borderRadius: styleVariables.primerRadiusBase,
          borderColor: styleVariables.primerColorBorder,
          color: styleVariables.primerColorTextPrimary
        }}
      >
        <div className="mb-4" style={{ color: styleVariables.primerColorBrand }}>
          Sample Text in Brand Color
        </div>
        <button 
          className="px-4 py-2 text-white rounded-md"
          style={{ 
            backgroundColor: styleVariables.primerColorBrand,
            borderRadius: styleVariables.primerRadiusBase
          }}
        >
          Sample Button
        </button>
        <div className="mt-4">
          <input 
            type="text" 
            className="w-full p-2 border rounded-md"
            placeholder="Sample input field"
            style={{ 
              borderRadius: styleVariables.primerRadiusBase,
              borderColor: styleVariables.primerColorBorder,
              color: styleVariables.primerColorTextPrimary
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ThemePreview;
