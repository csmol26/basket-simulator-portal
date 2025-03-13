
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

        <div className="mt-4 p-3 rounded-md border" style={{ 
          borderColor: styleVariables.primerColorBorder,
          borderRadius: styleVariables.primerRadiusBase
        }}>
          <div className="flex items-center justify-between mb-2">
            <div style={{ color: styleVariables.primerColorTextPrimary }}>Card Information</div>
            <div className="flex space-x-2">
              {['visa', 'mastercard', 'amex'].map(card => (
                <div key={card} className="w-8 h-5 bg-gray-200 rounded" style={{ 
                  borderRadius: `calc(${styleVariables.primerRadiusBase || '4px'} / 2)`
                }}></div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2" style={{ 
            gap: styleVariables.primerSpaceBase || '8px'
          }}>
            <div className="col-span-2 p-2 bg-gray-50 rounded" style={{ 
              borderRadius: styleVariables.primerRadiusBase,
              borderColor: styleVariables.primerColorBorder,
              borderWidth: '1px',
              borderStyle: 'solid'
            }}>
              <div className="text-xs opacity-60" style={{ color: styleVariables.primerColorTextPrimary }}>Card Number</div>
              <div style={{ color: styleVariables.primerColorTextPrimary }}>•••• •••• •••• 4242</div>
            </div>
            
            <div className="p-2 bg-gray-50 rounded" style={{ 
              borderRadius: styleVariables.primerRadiusBase,
              borderColor: styleVariables.primerColorBorder,
              borderWidth: '1px',
              borderStyle: 'solid'
            }}>
              <div className="text-xs opacity-60" style={{ color: styleVariables.primerColorTextPrimary }}>Expiry</div>
              <div style={{ color: styleVariables.primerColorTextPrimary }}>12/25</div>
            </div>
            
            <div className="p-2 bg-gray-50 rounded" style={{ 
              borderRadius: styleVariables.primerRadiusBase,
              borderColor: styleVariables.primerColorBorder,
              borderWidth: '1px',
              borderStyle: 'solid'
            }}>
              <div className="text-xs opacity-60" style={{ color: styleVariables.primerColorTextPrimary }}>CVC</div>
              <div style={{ color: styleVariables.primerColorTextPrimary }}>123</div>
            </div>
          </div>
          
          <button 
            className="w-full mt-3 py-2 text-white font-medium rounded-md"
            style={{ 
              backgroundColor: styleVariables.primerColorBrand,
              borderRadius: styleVariables.primerRadiusBase
            }}
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThemePreview;
