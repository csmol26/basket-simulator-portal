
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

  // Get style variables for preview styling
  const previewStyles = {
    backgroundColor: styleVariables.primerColorBackground || 'transparent',
    fontFamily: styleVariables.primerTypographyBrand || "'Poppins', sans-serif",
    borderRadius: styleVariables.primerRadiusBase,
    padding: styleVariables.primerSpaceBase,
    color: styleVariables.primerColorTextPrimary || 'inherit',
    border: '1px solid',
    borderColor: styleVariables.primerColorBorder || '#e5e7eb'
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
          
          <div 
            className="border rounded-md p-4 bg-white"
            style={previewStyles}
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium">Checkout Preview</span>
              <span className="text-xs text-gray-500">Using your style variables</span>
            </div>
            
            <div 
              className="p-4 border border-gray-200 rounded-md"
              style={{
                ...generateCssVariables(), 
                borderRadius: styleVariables.primerRadiusBase,
                borderColor: styleVariables.primerColorBorder
              }}
            >
              <h2 
                className="text-xl font-medium mb-2"
                style={{color: styleVariables.primerColorBrand}}
              >
                Checkout
              </h2>
              
              {rows.map((row, rowIndex) => {
                // Skip empty rows
                if (row.components.length === 0) return null;
                
                return (
                  <div key={row.id} className="mb-4">
                    <div 
                      className="font-medium text-sm mb-2"
                      style={{color: styleVariables.primerColorTextPrimary}}
                    >
                      Slot {rowIndex + 1}
                    </div>
                    <div 
                      className="p-3 border border-gray-200 rounded-md mb-2"
                      style={{
                        borderRadius: styleVariables.primerRadiusBase,
                        borderColor: styleVariables.primerColorBorder
                      }}
                    >
                      {row.components.some(comp => 
                        comp.originalComponent.id === 'card-number' || 
                        comp.originalComponent.id === 'card-expiry' || 
                        comp.originalComponent.id === 'card-cvv' ||
                        comp.originalComponent.id === 'card-holder' ||
                        comp.originalComponent.id === 'card-submit'
                      ) ? (
                        <div className="space-y-4">
                          <div 
                            className="font-medium text-sm mb-2" 
                            style={{color: styleVariables.primerColorBrand}}
                          >
                            Card Payment
                          </div>
                          <div className="flex gap-4 flex-wrap">
                            {row.components.map((component, compIndex) => (
                              <div 
                                key={`${row.id}-${component.id}`}
                                className="p-3 border border-gray-200 rounded flex-1 min-w-[200px]"
                                style={{
                                  borderRadius: styleVariables.primerRadiusBase,
                                  borderColor: styleVariables.primerColorBorder
                                }}
                              >
                                <div 
                                  className="text-sm font-medium mb-1"
                                  style={{color: styleVariables.primerColorTextPrimary || 'inherit'}}
                                >
                                  {component.originalComponent.name}
                                </div>
                                <div 
                                  className="text-xs text-gray-500"
                                >
                                  {component.config?.label || 'No label'}
                                </div>
                                {component.originalComponent.id === 'card-submit' && (
                                  <button 
                                    className="mt-2 p-2 text-white text-sm w-full rounded-md"
                                    style={{
                                      backgroundColor: styleVariables.primerColorBrand,
                                      borderRadius: styleVariables.primerRadiusBase
                                    }}
                                  >
                                    {component.config?.buttonText || 'Pay Now'}
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="px-3 py-2 text-sm rounded-md w-full bg-gray-100"
                          style={{
                            borderRadius: styleVariables.primerRadiusBase,
                            color: styleVariables.primerColorTextPrimary
                          }}
                        >
                          [Slot {rowIndex + 1} Component]
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {rows.length === 0 && (
                <div 
                  className="p-3 border border-gray-200 rounded-md mb-4 text-center text-gray-500"
                  style={{
                    borderRadius: styleVariables.primerRadiusBase,
                    borderColor: styleVariables.primerColorBorder
                  }}
                >
                  No slots defined. Add components in the Layout Builder.
                </div>
              )}

              <div className="mt-4 text-center">
                <button 
                  className="px-4 py-2 text-white font-medium rounded-md transition-colors hover:opacity-90"
                  style={{
                    backgroundColor: styleVariables.primerColorBrand,
                    borderRadius: styleVariables.primerRadiusBase
                  }}
                >
                  Sample Button
                </button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Preview;
