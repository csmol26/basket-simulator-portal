
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Row, StyleVariables } from "./types";

interface PreviewProps {
  rows: Row[];
  styleVariables: StyleVariables;
}

const Preview: React.FC<PreviewProps> = ({ rows, styleVariables }) => {
  // Helper function to generate CSS variable style object
  const generateCssVariables = () => {
    const cssVars: Record<string, string> = {};
    
    // Convert StyleVariables to CSS variable format
    Object.entries(styleVariables).forEach(([key, value]) => {
      // Convert camelCase to kebab-case with primer prefix
      const cssKey = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      cssVars[cssKey] = value;
    });
    
    return cssVars;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Theme Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-gray-100 rounded-md">
          <p className="text-sm text-gray-600 mb-4">
            Visualize how your theme and components will appear in the checkout.
          </p>
          
          <div className="border rounded-md p-4 bg-white">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium">Card Form Preview</span>
              <span className="text-xs text-gray-500">Using your style variables</span>
            </div>
            
            <div 
              className="p-4 border border-gray-200 rounded-md"
              style={generateCssVariables()}
            >
              {rows.length > 0 ? (
                <div className="space-y-4">
                  {rows.map((row, rowIndex) => (
                    <div key={row.id} className="flex gap-4 flex-wrap">
                      {row.components.map((component, compIndex) => (
                        <div 
                          key={`${row.id}-${component.id}`}
                          className="p-3 border border-gray-200 rounded flex-1 min-w-[200px]"
                        >
                          <div className="text-sm font-medium mb-1">
                            {component.originalComponent.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {component.config?.label || 'No label'}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-24 bg-gray-50 border border-dashed border-gray-300 rounded flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Add components to see preview</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Preview;
