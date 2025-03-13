
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

  // Check if card payment is in the rows
  const hasCardPayment = rows.some(row => 
    row.components.some(comp => 
      comp.originalComponent.id === 'card-number' || 
      comp.originalComponent.id === 'card-expiry' || 
      comp.originalComponent.id === 'card-cvv' ||
      comp.originalComponent.id === 'card-holder' ||
      comp.originalComponent.id === 'card-submit'
    )
  );

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
              <span className="text-sm font-medium">Checkout Preview</span>
              <span className="text-xs text-gray-500">Using your style variables</span>
            </div>
            
            <div 
              className="p-4 border border-gray-200 rounded-md"
              style={generateCssVariables()}
            >
              <div className="mb-4">
                <h2 className="text-xl font-medium mb-2">Checkout</h2>
                <div className="font-medium text-sm mb-2">Payment Method</div>
                <div className="p-3 border border-gray-200 rounded-md mb-4">
                  <div className="font-medium text-sm mb-2">Card Payment</div>
                  
                  {hasCardPayment ? (
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
                    <div className="px-3 py-1 text-sm rounded-md w-full bg-gray-100 text-gray-800">
                      [Empty Payment Method Slot]
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Preview;
