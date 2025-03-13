
import React from "react";
import { ComponentConfig } from "./ComponentList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DragItem {
  id: string;
  content: string;
  config?: {
    label?: string;
    placeholder?: string;
    ariaLabel?: string;
    spaceSmall?: string;
  };
  originalComponent: ComponentConfig;
}

interface Row {
  id: string;
  components: DragItem[];
}

interface PreviewProps {
  rows: Row[];
  styleVariables: Record<string, string>;
}

const Preview: React.FC<PreviewProps> = ({ rows, styleVariables }) => {
  const renderCardFormComponents = () => {
    if (rows.length === 0 || rows.every(row => row.components.length === 0)) {
      return (
        <div className="text-center p-4 text-gray-400 italic">
          Drag components here to build your card form
        </div>
      );
    }
    
    return rows.map((row) => {
      if (row.components.length === 0) return null;
      
      if (row.components.length === 1) {
        const component = row.components[0];
        const content = component.content;
        const config = component.config || {};
        const label = config.label || component.originalComponent?.defaultLabel;
        const placeholder = config.placeholder || component.originalComponent?.defaultPlaceholder;
        const spaceSmall = config.spaceSmall || styleVariables.primerSpaceSmall;
        
        return (
          <div key={row.id} className="mb-4" style={{ marginBottom: spaceSmall }}>
            {content.includes('card-number') && (
              <div className="mb-2">
                {label && <label className="block text-sm mb-1">{label}</label>}
                <div 
                  className="bg-white border border-gray-300 rounded-md p-2 h-10 flex items-center px-3"
                  style={{ 
                    borderRadius: styleVariables.primerRadiusBase,
                    backgroundColor: styleVariables.primerColorBackground || "white",
                    marginBottom: spaceSmall
                  }}
                >
                  <span className="text-gray-400">{placeholder || "•••• •••• •••• ••••"}</span>
                </div>
              </div>
            )}
            {content.includes('card-expiry') && (
              <div className="mb-2">
                {label && <label className="block text-sm mb-1">{label}</label>}
                <div 
                  className="bg-white border border-gray-300 rounded-md p-2 h-10 flex items-center px-3"
                  style={{ 
                    borderRadius: styleVariables.primerRadiusBase,
                    backgroundColor: styleVariables.primerColorBackground || "white",
                    marginBottom: spaceSmall
                  }}
                >
                  <span className="text-gray-400">{placeholder || "MM/YY"}</span>
                </div>
              </div>
            )}
            {content.includes('cvv') && (
              <div className="mb-2">
                {label && <label className="block text-sm mb-1">{label}</label>}
                <div 
                  className="bg-white border border-gray-300 rounded-md p-2 h-10 flex items-center px-3"
                  style={{ 
                    borderRadius: styleVariables.primerRadiusBase,
                    backgroundColor: styleVariables.primerColorBackground || "white",
                    marginBottom: spaceSmall
                  }}
                >
                  <span className="text-gray-400">{placeholder || "123"}</span>
                </div>
              </div>
            )}
            {content.includes('card-holder-name') && (
              <div className="mb-2">
                {label && <label className="block text-sm mb-1">{label}</label>}
                <div 
                  className="bg-white border border-gray-300 rounded-md p-2 h-10 flex items-center px-3"
                  style={{ 
                    borderRadius: styleVariables.primerRadiusBase,
                    backgroundColor: styleVariables.primerColorBackground || "white",
                    marginBottom: spaceSmall
                  }}
                >
                  <span className="text-gray-400">{placeholder || "Cardholder Name"}</span>
                </div>
              </div>
            )}
            {content.includes('card-form-submit') && (
              <button 
                className="hover:opacity-90 text-white rounded-md p-2 h-10 w-full font-medium transition-colors"
                style={{ 
                  backgroundColor: styleVariables.primerColorBrand || "#18A94B",
                  borderRadius: styleVariables.primerRadiusBase || "16px",
                  marginBottom: spaceSmall
                }}
              >
                Pay Now
              </button>
            )}
          </div>
        );
      } else {
        return (
          <div key={row.id} className="flex gap-4 mb-4" style={{ marginBottom: styleVariables.primerSpaceBase }}>
            {row.components.map((component) => {
              const content = component.content;
              const config = component.config || {};
              const label = config.label || component.originalComponent?.defaultLabel;
              const placeholder = config.placeholder || component.originalComponent?.defaultPlaceholder;
              const spaceSmall = config.spaceSmall || styleVariables.primerSpaceSmall;
              
              return (
                <div key={component.id} className="flex-1">
                  {content.includes('card-number') && (
                    <div className="mb-2">
                      {label && <label className="block text-sm mb-1" style={{ fontFamily: styleVariables.primerTypographyBrand }}>{label}</label>}
                      <div 
                        className="bg-white border border-gray-300 rounded-md p-2 h-10 flex items-center px-3"
                        style={{ 
                          borderRadius: styleVariables.primerRadiusBase,
                          backgroundColor: styleVariables.primerColorBackground || "white",
                          marginBottom: spaceSmall
                        }}
                      >
                        <span className="text-gray-400">{placeholder || "•••• •••• •••• ••••"}</span>
                      </div>
                    </div>
                  )}
                  {content.includes('card-expiry') && (
                    <div className="mb-2">
                      {label && <label className="block text-sm mb-1" style={{ fontFamily: styleVariables.primerTypographyBrand }}>{label}</label>}
                      <div 
                        className="bg-white border border-gray-300 rounded-md p-2 h-10 flex items-center px-3"
                        style={{ 
                          borderRadius: styleVariables.primerRadiusBase,
                          backgroundColor: styleVariables.primerColorBackground || "white",
                          marginBottom: spaceSmall
                        }}
                      >
                        <span className="text-gray-400">{placeholder || "MM/YY"}</span>
                      </div>
                    </div>
                  )}
                  {content.includes('cvv') && (
                    <div className="mb-2">
                      {label && <label className="block text-sm mb-1" style={{ fontFamily: styleVariables.primerTypographyBrand }}>{label}</label>}
                      <div 
                        className="bg-white border border-gray-300 rounded-md p-2 h-10 flex items-center px-3"
                        style={{ 
                          borderRadius: styleVariables.primerRadiusBase,
                          backgroundColor: styleVariables.primerColorBackground || "white",
                          marginBottom: spaceSmall
                        }}
                      >
                        <span className="text-gray-400">{placeholder || "123"}</span>
                      </div>
                    </div>
                  )}
                  {content.includes('card-holder-name') && (
                    <div className="mb-2">
                      {label && <label className="block text-sm mb-1" style={{ fontFamily: styleVariables.primerTypographyBrand }}>{label}</label>}
                      <div 
                        className="bg-white border border-gray-300 rounded-md p-2 h-10 flex items-center px-3"
                        style={{ 
                          borderRadius: styleVariables.primerRadiusBase,
                          backgroundColor: styleVariables.primerColorBackground || "white",
                          marginBottom: spaceSmall
                        }}
                      >
                        <span className="text-gray-400">{placeholder || "Cardholder Name"}</span>
                      </div>
                    </div>
                  )}
                  {content.includes('card-form-submit') && (
                    <button 
                      className="hover:opacity-90 text-white p-2 h-10 w-full font-medium transition-colors"
                      style={{ 
                        backgroundColor: styleVariables.primerColorBrand || "#18A94B",
                        borderRadius: styleVariables.primerRadiusBase || "16px",
                        marginBottom: spaceSmall
                      }}
                    >
                      Pay Now
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        );
      }
    });
  };

  const previewStyle: React.CSSProperties = {
    fontFamily: styleVariables.primerTypographyBrand || "'Poppins', sans-serif",
    padding: `calc(${styleVariables.primerSpaceBase || "4px"} * 4)`,
    borderRadius: styleVariables.primerRadiusBase || "16px",
    backgroundColor: styleVariables.primerColorBackground || "transparent",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">Card Form Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="border border-gray-200 rounded-md p-6"
            style={{ borderRadius: styleVariables.primerRadiusBase || "16px" }}
          >
            <p 
              className="text-base font-medium text-gray-700 mb-4"
              style={{ fontFamily: styleVariables.primerTypographyBrand || "'Poppins', sans-serif" }}
            >
              Card Payment
            </p>
            <div>
              {renderCardFormComponents()}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">Full Checkout Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="cards" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="cards">Card Payment</TabsTrigger>
              <TabsTrigger value="apms">Alternative Payments</TabsTrigger>
            </TabsList>
            
            <TabsContent value="cards">
              <div 
                className="bg-white border border-gray-200 rounded-md p-6 shadow-sm"
                style={previewStyle}
              >
                <div className="space-y-4">
                  <p className="text-base font-medium" style={{ color: styleVariables.primerColorBrand || "#18A94B" }}>
                    Card Payment
                  </p>
                  
                  <div className="border border-gray-200 rounded-md p-4" style={{ borderRadius: styleVariables.primerRadiusBase }}>
                    {renderCardFormComponents()}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="apms">
              <div 
                className="bg-white border border-gray-200 rounded-md p-6 shadow-sm"
                style={previewStyle}
              >
                <div className="space-y-4">
                  <p className="text-base font-medium" style={{ color: styleVariables.primerColorBrand || "#18A94B" }}>
                    Alternative Payment Methods
                  </p>
                  
                  <div className="p-4 border rounded-md" style={{ borderRadius: styleVariables.primerRadiusBase }}>
                    <div 
                      className="h-12 bg-[#0070BA] text-white rounded-md flex items-center justify-center font-medium"
                      style={{ borderRadius: styleVariables.primerRadiusBase }}
                    >
                      <span>PayPal</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 border rounded-md" style={{ borderRadius: styleVariables.primerRadiusBase }}>
                    <div 
                      className="h-12 bg-black text-white rounded-md flex items-center justify-center font-medium" 
                      style={{ borderRadius: styleVariables.primerRadiusBase }}
                    >
                      <span>Apple Pay</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Preview;
