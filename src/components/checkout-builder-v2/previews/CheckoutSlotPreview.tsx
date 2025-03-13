
import React from "react";
import { Row, StyleVariables } from "../types";
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
  return (
    <div className="space-y-4">
      {/* Card Form Preview */}
      <div 
        className="bg-white rounded-md p-4 mb-4 border"
        style={{ 
          borderRadius: styleVariables.primerRadiusBase,
          borderColor: styleVariables.primerColorBorder
        }}
      >
        <CardFormPreview 
          cardFormRows={cardFormRows} 
          styleVariables={styleVariables} 
        />
      </div>
      
      {/* Alternative Payment Methods */}
      <div 
        className="mt-8 pt-4 border-t"
        style={{ borderColor: styleVariables.primerColorBorder }}
      >
        <h3 
          className="text-base font-medium mb-3"
          style={{ color: styleVariables.primerColorTextPrimary }}
        >
          Alternative Payment Methods
        </h3>
        
        {/* PayPal Button */}
        <div 
          className="bg-[#0070ba] text-white p-3 rounded-md mb-3 text-center font-medium cursor-pointer"
          style={{ borderRadius: styleVariables.primerRadiusBase }}
        >
          PayPal
        </div>
        
        {/* Google Pay Button */}
        <div 
          className="bg-black text-white p-3 rounded-md mb-3 text-center font-medium cursor-pointer"
          style={{ borderRadius: styleVariables.primerRadiusBase }}
        >
          Google Pay
        </div>
        
        {/* Apple Pay Button */}
        <div 
          className="bg-black text-white p-3 rounded-md text-center font-medium cursor-pointer"
          style={{ borderRadius: styleVariables.primerRadiusBase }}
        >
          Apple Pay
        </div>
      </div>
    </div>
  );
};

export default CheckoutSlotPreview;
