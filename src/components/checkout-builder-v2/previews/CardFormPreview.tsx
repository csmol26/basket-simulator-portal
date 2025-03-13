
import React from "react";
import { Row, StyleVariables } from "../types";

interface CardFormPreviewProps {
  cardFormRows: Row[];
  styleVariables: StyleVariables;
}

const CardFormPreview: React.FC<CardFormPreviewProps> = ({ cardFormRows, styleVariables }) => {
  if (cardFormRows.length === 0 || cardFormRows.every(row => row.components.length === 0)) {
    return (
      <div className="bg-gray-100 border border-gray-200 rounded-md p-4 text-center">
        No card form components added
      </div>
    );
  }

  return (
    <div className="space-y-4" style={{ fontFamily: styleVariables.primerTypographyBrand }}>
      {cardFormRows.map((row, rowIndex) => {
        if (row.components.length === 0) return null;

        if (row.components.length === 1) {
          const component = row.components[0];
          return (
            <div key={`card-row-${rowIndex}`} className="mb-4">
              {component.originalComponent.id === 'card-number' && (
                <div className="mb-2">
                  <label className="block text-sm mb-1" style={{ color: styleVariables.primerColorTextPrimary }}>
                    {component.config?.label || "Card Number"}
                  </label>
                  <div
                    className="bg-white p-2 h-10 flex items-center px-3"
                    style={{ 
                      borderRadius: styleVariables.primerRadiusBase,
                      borderColor: styleVariables.primerColorBorder,
                      border: '1px solid',
                      color: styleVariables.primerColorTextPrimary
                    }}
                  >
                    <span className="text-gray-400">{component.config?.placeholder || "•••• •••• •••• ••••"}</span>
                  </div>
                </div>
              )}
              
              {component.originalComponent.id === 'card-expiry' && (
                <div className="mb-2">
                  <label className="block text-sm mb-1" style={{ color: styleVariables.primerColorTextPrimary }}>
                    {component.config?.label || "Expiry Date"}
                  </label>
                  <div 
                    className="bg-white p-2 h-10 flex items-center px-3"
                    style={{ 
                      borderRadius: styleVariables.primerRadiusBase,
                      borderColor: styleVariables.primerColorBorder,
                      border: '1px solid',
                      color: styleVariables.primerColorTextPrimary
                    }}
                  >
                    <span className="text-gray-400">{component.config?.placeholder || "MM/YY"}</span>
                  </div>
                </div>
              )}
              
              {component.originalComponent.id === 'card-cvv' && (
                <div className="mb-2">
                  <label className="block text-sm mb-1" style={{ color: styleVariables.primerColorTextPrimary }}>
                    {component.config?.label || "CVV"}
                  </label>
                  <div 
                    className="bg-white p-2 h-10 flex items-center px-3"
                    style={{ 
                      borderRadius: styleVariables.primerRadiusBase,
                      borderColor: styleVariables.primerColorBorder,
                      border: '1px solid',
                      color: styleVariables.primerColorTextPrimary
                    }}
                  >
                    <span className="text-gray-400">{component.config?.placeholder || "123"}</span>
                  </div>
                </div>
              )}
              
              {component.originalComponent.id === 'card-holder' && (
                <div className="mb-2">
                  <label className="block text-sm mb-1" style={{ color: styleVariables.primerColorTextPrimary }}>
                    {component.config?.label || "Cardholder Name"}
                  </label>
                  <div 
                    className="bg-white p-2 h-10 flex items-center px-3"
                    style={{ 
                      borderRadius: styleVariables.primerRadiusBase,
                      borderColor: styleVariables.primerColorBorder,
                      border: '1px solid',
                      color: styleVariables.primerColorTextPrimary
                    }}
                  >
                    <span className="text-gray-400">{component.config?.placeholder || "Name on card"}</span>
                  </div>
                </div>
              )}
              
              {component.originalComponent.id === 'card-submit' && (
                <button 
                  className="hover:opacity-90 text-white rounded-md p-2 h-10 w-full font-medium transition-colors"
                  style={{ 
                    backgroundColor: styleVariables.primerColorBrand,
                    borderRadius: styleVariables.primerRadiusBase
                  }}
                >
                  {component.config?.buttonText || "Pay Now"}
                </button>
              )}
            </div>
          );
        } else {
          // Multiple components in a row - display side by side
          return (
            <div key={`card-row-${rowIndex}`} className="flex gap-4 mb-4">
              {row.components.map((component, compIndex) => (
                <div key={`card-comp-${compIndex}`} className="flex-1">
                  {component.originalComponent.id === 'card-number' && (
                    <div className="mb-2">
                      <label className="block text-sm mb-1" style={{ color: styleVariables.primerColorTextPrimary }}>
                        {component.config?.label || "Card Number"}
                      </label>
                      <div
                        className="bg-white p-2 h-10 flex items-center px-3"
                        style={{ 
                          borderRadius: styleVariables.primerRadiusBase,
                          borderColor: styleVariables.primerColorBorder,
                          border: '1px solid',
                          color: styleVariables.primerColorTextPrimary
                        }}
                      >
                        <span className="text-gray-400">{component.config?.placeholder || "•••• •••• •••• ••••"}</span>
                      </div>
                    </div>
                  )}
                  
                  {component.originalComponent.id === 'card-expiry' && (
                    <div className="mb-2">
                      <label className="block text-sm mb-1" style={{ color: styleVariables.primerColorTextPrimary }}>
                        {component.config?.label || "Expiry Date"}
                      </label>
                      <div 
                        className="bg-white p-2 h-10 flex items-center px-3"
                        style={{ 
                          borderRadius: styleVariables.primerRadiusBase,
                          borderColor: styleVariables.primerColorBorder,
                          border: '1px solid',
                          color: styleVariables.primerColorTextPrimary
                        }}
                      >
                        <span className="text-gray-400">{component.config?.placeholder || "MM/YY"}</span>
                      </div>
                    </div>
                  )}
                  
                  {component.originalComponent.id === 'card-cvv' && (
                    <div className="mb-2">
                      <label className="block text-sm mb-1" style={{ color: styleVariables.primerColorTextPrimary }}>
                        {component.config?.label || "CVV"}
                      </label>
                      <div 
                        className="bg-white p-2 h-10 flex items-center px-3"
                        style={{ 
                          borderRadius: styleVariables.primerRadiusBase,
                          borderColor: styleVariables.primerColorBorder,
                          border: '1px solid',
                          color: styleVariables.primerColorTextPrimary
                        }}
                      >
                        <span className="text-gray-400">{component.config?.placeholder || "123"}</span>
                      </div>
                    </div>
                  )}
                  
                  {component.originalComponent.id === 'card-holder' && (
                    <div className="mb-2">
                      <label className="block text-sm mb-1" style={{ color: styleVariables.primerColorTextPrimary }}>
                        {component.config?.label || "Cardholder Name"}
                      </label>
                      <div 
                        className="bg-white p-2 h-10 flex items-center px-3"
                        style={{ 
                          borderRadius: styleVariables.primerRadiusBase,
                          borderColor: styleVariables.primerColorBorder,
                          border: '1px solid',
                          color: styleVariables.primerColorTextPrimary
                        }}
                      >
                        <span className="text-gray-400">{component.config?.placeholder || "Name on card"}</span>
                      </div>
                    </div>
                  )}
                  
                  {component.originalComponent.id === 'card-submit' && (
                    <button 
                      className="hover:opacity-90 text-white rounded-md p-2 h-10 w-full font-medium transition-colors"
                      style={{ 
                        backgroundColor: styleVariables.primerColorBrand,
                        borderRadius: styleVariables.primerRadiusBase
                      }}
                    >
                      {component.config?.buttonText || "Pay Now"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          );
        }
      })}
    </div>
  );
};

export default CardFormPreview;
