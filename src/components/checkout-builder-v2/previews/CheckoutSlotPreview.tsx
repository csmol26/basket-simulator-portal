
import React from "react";
import { Row, StyleVariables, CheckoutConfig } from "../types";
import CardFormPreview from "./CardFormPreview";

interface CheckoutSlotPreviewProps {
  rows: Row[];
  cardFormRows: Row[];
  styleVariables: StyleVariables;
}

const CheckoutSlotPreview: React.FC<CheckoutSlotPreviewProps> = ({ 
  rows, 
  cardFormRows, 
  styleVariables 
}) => {
  if (rows.length === 0) {
    return (
      <div className="bg-gray-100 border border-gray-200 rounded-md p-4 text-center">
        No payment methods added
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {rows.map((row, rowIndex) => {
        // Skip empty rows
        if (row.components.length === 0) return null;

        return (
          <div key={`slot-${rowIndex}`} className="mb-4">
            <div className="font-medium text-sm mb-2" style={{ color: styleVariables.primerColorTextPrimary }}>
              Slot {rowIndex + 1}
            </div>
            <div 
              className="p-3 rounded-md mb-4"
              style={{ 
                borderRadius: styleVariables.primerRadiusBase,
                borderColor: styleVariables.primerColorBorder,
                border: '1px solid'
              }}
            >
              {row.components.map((component, compIndex) => {
                // For APM payment methods
                if (component.originalComponent.isAPM) {
                  return (
                    <div key={`apm-${compIndex}`} className="mb-3">
                      <div 
                        className="font-medium text-sm mb-2"
                        style={{ color: styleVariables.primerColorTextPrimary }}
                      >
                        {component.originalComponent.name}
                      </div>
                      <button
                        className="w-full p-3 border rounded-md flex items-center justify-center bg-white hover:bg-gray-50"
                        style={{ 
                          borderRadius: styleVariables.primerRadiusBase,
                          borderColor: styleVariables.primerColorBorder
                        }}
                      >
                        <span style={{ color: styleVariables.primerColorTextPrimary }}>
                          {component.originalComponent.name}
                        </span>
                      </button>
                    </div>
                  );
                }
                
                // For card form, display the card form components
                if (component.originalComponent.isCardForm) {
                  return (
                    <div key={`card-form-${compIndex}`} className="mb-3">
                      <div 
                        className="font-medium text-sm mb-2"
                        style={{ color: styleVariables.primerColorTextPrimary }}
                      >
                        Card Payment
                      </div>
                      {cardFormRows.length > 0 ? (
                        <CardFormPreview cardFormRows={cardFormRows} styleVariables={styleVariables} />
                      ) : (
                        <div 
                          className="px-3 py-2 text-sm rounded-md w-full bg-gray-100"
                          style={{ 
                            borderRadius: styleVariables.primerRadiusBase,
                            color: styleVariables.primerColorTextPrimary
                          }}
                        >
                          Credit Card
                        </div>
                      )}
                    </div>
                  );
                }
                
                return null;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CheckoutSlotPreview;
